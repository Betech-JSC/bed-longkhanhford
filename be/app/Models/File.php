<?php

namespace App\Models;

use Illuminate\Support\Str;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use Illuminate\Support\Facades\Storage;
use Iman\Streamer\VideoStreamer;
use Image;

class File
{
    protected $path;
    protected $disk;
    protected $storage;
    protected $publicStorage;
    protected $contents;

    public const MAX_SIZE_LIST = [
        'image' => 20,
        'video' => 200,
        'application' => 200,
        'others' => 50,
    ];

    public function __construct($path = '/', $disk = null)
    {
        $this->path = $path;
        $this->disk = $disk ?? 'uploads';
        $this->storage = Storage::disk($this->disk);
        $this->publicStorage = Storage::disk('public');
    }

    public function items()
    {
        $this->contents = collect($this->storage->listContents($this->path));

        $tree = $this->tree();
        $directories = $this->directories();
        $files = $this->files();

        return compact('tree', 'directories', 'files');
    }

    public function tree()
    {
        $directories = $this->storage->allDirectories();

        $tree = [];
        foreach ($directories as $dir) {
            $parts = explode('/', $dir);
            $hasHidden = false;
            foreach ($parts as $part) {
                if ($this->firstCharIs($part, '.')) {
                    $hasHidden = true;
                    break;
                }
            }
            if ($hasHidden) {
                continue;
            }

            $current = &$tree;
            foreach ($parts as $part) {
                if (!isset($current[$part])) {
                    $current[$part] = [];
                }
                $current = &$current[$part];
            }
        }

        return $this->transformTree($tree);
    }

    public function transformTree($item, $name = null, $path = null)
    {
        $itemChildren = collect($item)
            ->map(fn($subItem, $subKey) => $this->transformTree($subItem, $subKey, implode('/', [$path, $subKey])))
            ->filter()
            ->sortBy('path')
            ->keyBy('path')
            ->values()
            ->toArray();

        if (is_null($path)) {
            return [[
                'slug' => Str::slug('/') .  '-' . generate_code(5),
                'name' => 'File Manager',
                'label' => 'File Manager',
                'path' => '/',
                'children' => $itemChildren,
            ]];
        }

        return [
            'slug' => Str::slug($path) .  '-' . generate_code(5),
            'name' => $name,
            'label' => $name,
            'path' => $path,
            'children' => $itemChildren,
        ];
    }

    public function directories()
    {
        return $this->contents
            ->filter(fn($item) => $item->isDir())
            ->values()
            ->toArray();
    }

    public function files()
    {
        $files = $this->contents
            ->filter(fn($item) => $item->isFile())
            ->values()
            ->map(fn($item) => $this->transformFile($item))
            ->reject(fn($item) => $this->firstCharIs($item['filename'], '.'));

        // 1. Search/Keyword Filter
        $search = request()->input('search') ?? request()->input('keyword');
        if (!empty($search)) {
            $searchLower = mb_strtolower($search);
            $files = $files->filter(function($item) use ($searchLower) {
                return str_contains(mb_strtolower($item['filename']), $searchLower) ||
                       str_contains(mb_strtolower($item['search_name']), $searchLower);
            });
        }

        // 2. Type Filter (image, video, document, other)
        $type = request()->input('type');
        if (!empty($type) && $type !== 'all') {
            $files = $files->filter(function($item) use ($type) {
                $ext = strtolower($item['extension']);
                if ($type === 'image') {
                    return in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'heic', 'avif']);
                }
                if ($type === 'video') {
                    return in_array($ext, ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', '3gp', 'm4v']);
                }
                if ($type === 'document') {
                    return in_array($ext, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'odt', 'ods']);
                }
                if ($type === 'other') {
                    return !in_array($ext, [
                        'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'heic', 'avif',
                        'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', '3gp', 'm4v',
                        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'odt', 'ods'
                    ]);
                }
                return true;
            });
        }

        // 3. Sorting
        $sort = request()->input('sort', 'date_desc');
        switch ($sort) {
            case 'date_asc':
                $files = $files->sortBy('last_modified');
                break;
            case 'name_asc':
                $files = $files->sortBy('filename', SORT_NATURAL | SORT_FLAG_CASE);
                break;
            case 'name_desc':
                $files = $files->sortByDesc('filename', SORT_NATURAL | SORT_FLAG_CASE);
                break;
            case 'size_desc':
                $files = $files->sortByDesc('file_size');
                break;
            case 'size_asc':
                $files = $files->sortBy('file_size');
                break;
            case 'date_desc':
            default:
                $files = $files->sortByDesc('last_modified');
                break;
        }

        $files = $files->values()->keyBy('path');

        // 4. Pagination
        if (request()->has('limit')) {
            $page = (int) request()->input('page', 1);
            $limit = (int) request()->input('limit', 50);
            return $files->skip(($page - 1) * $limit)->take($limit);
        }

        return $files;
    }

    public function findOrFail($options = [])
    {
        try {
            if ($this->isVideo()) {
                return $this->responseStreamingVideo();
            }

            if ($this->isPdf()) {
                return $this->responsePdf($options);
            }

            if ($this->isImage()) {
                return $this->responseImage($options);
            }

            return $this->responseDefault();
        } catch (\Exception $exception) {
            logger()->error($exception->getMessage());

            return response($exception->getMessage(), 404)
                ->header('Content-Type', 'text/plain');
        }
    }

    public function store($files, $relativePaths = [])
    {
        $successFiles = [];
        $failureFiles = [];

        foreach ($files as $index => $file) {
            if (is_string($file) && preg_match('/^data:([^;]+);base64,(.*)$/', $file, $matches)) {
                $mimeType = $matches[1];
                $data = base64_decode($matches[2]);
                
                // Get extension from mime type
                $extension = 'bin';
                $extensions = [
                    'application/pdf' => 'pdf',
                    'application/msword' => 'doc',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
                    'image/jpeg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                    'image/webp' => 'webp',
                ];
                if (isset($extensions[$mimeType])) {
                    $extension = $extensions[$mimeType];
                } else {
                    $parts = explode('/', $mimeType);
                    if (count($parts) === 2) {
                        $extension = $parts[1];
                    }
                }

                $fileName = 'cv_' . uniqid() . '.' . $extension;
                $targetPath = ($this->path == '/' ? '' : rtrim($this->path, '/') . '/') . $fileName;

                // Validate size
                $fileSize = strlen($data);
                $maxSize = self::MAX_SIZE_LIST['others'];
                foreach (self::MAX_SIZE_LIST as $key => $size) {
                    if (str_contains($mimeType, $key)) {
                        $maxSize = $size;
                    }
                }

                if ($fileSize / 1024 / 1024 > $maxSize) {
                    $failureFiles[] = $fileName;
                    continue;
                }

                $isImage = str_contains($mimeType, 'image/') && !str_contains($mimeType, 'svg') && !str_contains($mimeType, 'gif');
                if ($isImage) {
                    try {
                        $image = Image::make($data);
                        if ($image->width() > 2000) {
                            $image->resize(2000, null, function ($constraint) {
                                $constraint->aspectRatio();
                                $constraint->upsize();
                            });
                        }

                        $quality = 80;
                        $encoded = (string) $image->encode('webp', $quality);

                        while (strlen($encoded) > 300 * 1024 && $quality > 10) {
                            $quality -= 10;
                            $encoded = (string) $image->encode('webp', $quality);
                        }

                        $fileName = pathinfo($fileName, PATHINFO_FILENAME) . '.webp';
                        $targetPath = ($this->path == '/' ? '' : rtrim($this->path, '/') . '/') . $fileName;

                        $filePath = $this->storage->put($targetPath, $encoded) ? $targetPath : false;
                    } catch (\Exception $e) {
                        logger()->error('Image processing failed: ' . $e->getMessage());
                        $filePath = $this->storage->put($targetPath, $data) ? $targetPath : false;
                    }
                } else {
                    $filePath = $this->storage->put($targetPath, $data) ? $targetPath : false;
                }
                if ($filePath) {
                    $successFiles[] = static_url($filePath, [], false);
                } else {
                    $failureFiles[] = $fileName;
                }
            } else {
                if (is_object($file) && method_exists($file, 'getClientOriginalName')) {
                    $originalName = $file->getClientOriginalName();
                    
                    $relativePath = $relativePaths[$index] ?? null;
                    if ($relativePath) {
                        $subDir = dirname($relativePath);
                        $fileName = basename($relativePath);
                        if ($subDir && $subDir !== '.') {
                            $targetDir = $this->path == '/' ? $subDir : rtrim($this->path, '/') . '/' . $subDir;
                        } else {
                            $targetDir = $this->path;
                        }
                    } else {
                        $fileName = $originalName;
                        $targetDir = $this->path;
                    }

                    if (!$file->isValid()) {
                        $failureFiles[] = $fileName;
                        continue;
                    }

                    if ($this->fileValidation($file)) {
                        $mimeType = $file->getMimeType();
                        $isImage = str_contains($mimeType, 'image/') && !str_contains($mimeType, 'svg') && !str_contains($mimeType, 'gif');

                        if ($isImage) {
                            try {
                                $image = Image::make($file->path());

                                if ($image->width() > 2000) {
                                    $image->resize(2000, null, function ($constraint) {
                                        $constraint->aspectRatio();
                                        $constraint->upsize();
                                    });
                                }

                                $quality = 80;
                                $encoded = (string) $image->encode('webp', $quality);

                                while (strlen($encoded) > 300 * 1024 && $quality > 10) {
                                    $quality -= 10;
                                    $encoded = (string) $image->encode('webp', $quality);
                                }

                                $fileName = pathinfo($fileName, PATHINFO_FILENAME) . '.webp';
                                $targetPath = ($targetDir == '/' ? '' : rtrim($targetDir, '/') . '/') . $fileName;

                                $filePath = $this->storage->put($targetPath, $encoded) ? $targetPath : false;
                            } catch (\Exception $e) {
                                logger()->error('Image processing failed: ' . $e->getMessage());
                                $filePath = $this->storage->putFileAs(
                                    $targetDir,
                                    $file,
                                    $fileName
                                );
                            }
                        } else {
                            $filePath = $this->storage->putFileAs(
                                $targetDir,
                                $file,
                                $fileName
                            );
                        }
                        $successFiles[] = static_url($filePath, [], false);

                        if (!$filePath) {
                            logger('Store file');
                            logger($file);
                            logger("Disk: $this->disk");
                            logger("Folder: $this->path");
                            logger("File name: $fileName");
                            logger('End store file');
                        }
                    } else {
                        $failureFiles[] = $fileName;
                    }
                } else {
                    $failureFiles[] = 'unknown_file';
                }
            }
        }
        return [
            'successFiles' => $successFiles,
            'failureFiles' => $failureFiles,
        ];
    }

    public function storeFromUrl($url)
    {
        try {
            $file = file_get_contents($url);
            $mime = (new \finfo(FILEINFO_MIME_TYPE))->buffer($file);

            $extension = explode('/', $mime)[1] ?? 'png';
            if (!in_array($extension, ['png', 'jpeg', 'jpg', 'webp', 'gif', 'tiff'])) {
                logger()->error('Can not store image: ' . $url);
                return false;
            }

            $filePath = Str::slug(urldecode(pathinfo($url)['filename'])) . '.' . $extension;

            if ($this->path != '/') {
                $filePath = $this->path . '/' . $filePath;
            }

            $this->storage->put($filePath, $file);

            return $filePath;
        } catch (\Throwable $th) {
            logger()->error('Can not store image: ' . $url);
            logger()->error($th->getMessage());
            return false;
        }
    }

    public function delete($items)
    {
        $deletedItems = [];

        foreach ($items as $item) {
            if (!$this->storage->exists($item['path'])) {
                continue;
            } else {
                if ($item['type'] === 'dir') {
                    $this->storage->deleteDirectory($item['path']);

                    $cacheFolder = 'cache/' . $item['path'];

                    $this->publicStorage->deleteDirectory($cacheFolder);
                } else {
                    $this->storage->delete($item['path']);
                    $cacheFolder = 'cache/' . str_replace('.', '_', $item['path']);

                    $this->publicStorage->deleteDirectory($cacheFolder);
                }
            }

            $deletedItems[] = $item;
        }

        return $deletedItems;
    }

    public function folderCreate($name)
    {
        $pathName = rtrim($this->path, '/') . '/' . ltrim($name, '/');

        if ($this->storage->exists($pathName)) {
            return false;
        }

        return (bool) $this->storage->makeDirectory($pathName);
    }

    public function folderDelete()
    {
        if (collect($this->storage->listContents($this->path))->count() > 0) {
            return false;
        }

        return (bool) $this->storage->deleteDirectory($this->path);
    }

    protected function responsePdf()
    {
        $filePath = $this->getFullPath();
        if (isset($options['download'])) {
            return response()->download($filePath, basename($filePath));
        }

        return $this->responseDefault();
    }

    protected function responseStreamingVideo(): bool
    {
        return VideoStreamer::streamFile($this->getFullPath());
    }

    protected function responseImage($options)
    {
        $pathinfo = pathinfo($this->path);
        $options = array_merge(['fm' => 'webp'], $options);

        $newFilename = implode('_', $options);

        $cacheFolder = 'cache/' . $pathinfo['dirname'] . '/' . str_replace('.', '_', $pathinfo['basename']);
        $cacheFilename = $pathinfo['filename'] . '_' . $newFilename . '.' . $options['fm'];
        $cacheFullPath = $cacheFolder . '/' . $cacheFilename;

        if (!$this->publicStorage->exists($cacheFullPath)) {
            // Create cache folder if it doesn't exist
            $this->publicStorage->makeDirectory($cacheFolder, 0755, true);

            $imagePath = $this->storage->path($this->path);

            // Check if the image has been modified
            $lastModified = filemtime($imagePath);
            $etag = md5_file($imagePath);
            $headers = [
                'Last-Modified' => gmdate('D, d M Y H:i:s', $lastModified) . ' GMT',
                'ETag' => $etag,
            ];
            if (
                request()->headers->has('If-Modified-Since') &&
                strtotime(request()->headers->get('If-Modified-Since')) >= $lastModified
            ) {
                return response()->make('', 304, $headers);
            }
            if (
                request()->headers->has('If-None-Match') &&
                request()->headers->get('If-None-Match') == $etag
            ) {
                return response()->make('', 304, $headers);
            }

            $image = Image::make($imagePath);

            if (isset($options['w'])) {
                $image->resize($options['w'], null, function ($constraint) {
                    $constraint->aspectRatio();
                });
            }

            $image
                ->encode($options['fm'], 100)
                ->save($this->publicStorage->path($cacheFullPath));

            // Set caching headers
            $headers = [
                'Content-Type' => 'image/' . $options['fm'],
                'Cache-Control' => 'max-age=86400',
                'Last-Modified' => gmdate('D, d M Y H:i:s', $lastModified) . ' GMT',
                'ETag' => $etag,
            ];
        } else {
            // Set caching headers
            $headers = [
                'Content-Type' => 'image/' . $options['fm'],
                'Cache-Control' => 'max-age=86400',
            ];
        }

        $imageData = $this->publicStorage->get($cacheFullPath);

        return response()
            ->make($imageData, 200, $headers);
    }


    protected function responseDefault()
    {
        return response()
            ->make($this->getFileData(), 200)
            ->header('Content-Type', $this->getMimeType());
    }

    protected function getFullPath(): string
    {
        return $this->storage->path($this->path);
    }

    protected function getFileData()
    {
        return $this->storage->get($this->path);
    }

    protected function getSize(): string
    {
        return $this->storage->size($this->path);
    }

    protected function getMimeType(): string
    {
        return $this->storage->mimeType($this->path);
    }

    protected function isPdf(): bool
    {
        return str_contains($this->path, '.pdf');
    }

    protected function isImage(): bool
    {
        $mimeType = $this->getMimeType();
        return str_contains($mimeType, 'image/') && $mimeType !== 'image/heic' && !str_contains($this->path, '.svg') && !str_contains($this->path, '.gif');
    }

    protected function isVideo(): bool
    {
        return str_contains($this->path, '.mp4');
    }

    private function formatBytes($size)
    {
        $base = log($size) / log(1024);
        $suffix = array("bytes", "KB", "MB", "GB", "TB")[floor($base)];
        return round(pow(1024, $base - floor($base)), 2) .  ' ' . $suffix;
    }

    private function firstCharIs($string, $char)
    {
        return mb_substr($string, 0, 1) === $char;
    }

    private function fileValidation($file)
    {
        if (!$file->isValid()) {
            return false;
        }
        $mimeType = $file->getMimeType();
        $maxSize = self::MAX_SIZE_LIST['others'];
        foreach (self::MAX_SIZE_LIST as $key => $size) {
            if (str_contains($mimeType, $key)) {
                $maxSize = $size;
            }
        }

        return $file->getSize() / 1024 / 1024 <= $maxSize;
    }

    private function transformFile($item)
    {
        $metadata = $item->jsonSerialize();
        $filename = basename($metadata['path']);

        return array_merge($metadata, [
            'search_name' => str_replace('-', ' ', Str::slug($filename)),
            'filename' => $filename,
            'extension' => pathinfo($metadata['path'], PATHINFO_EXTENSION),
            'static_url' => $this->storage->url($metadata['path']),
            'formatted_file_size' => $this->formatBytes($metadata['file_size']),
        ]);
    }
}
