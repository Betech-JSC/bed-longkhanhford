<?php

namespace JamstackVietnam\Core\Models;

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
        'image' => 5,
        'video' => 50,
        'application' => 100,
        'others' => 10,
    ];

    public function __construct($path = '/', $disk = null)
    {
        $this->disk = $disk ?? 'uploads';
        if ($this->disk === 'uploads' && is_string($path)) {
            $cleanedPath = ltrim($path, '/');
            while (
                str_starts_with($cleanedPath, 'static/') ||
                str_starts_with($cleanedPath, 'uploads/') ||
                str_starts_with($cleanedPath, 'storage/')
            ) {
                if (str_starts_with($cleanedPath, 'static/')) {
                    $cleanedPath = substr($cleanedPath, 7);
                } elseif (str_starts_with($cleanedPath, 'uploads/')) {
                    $cleanedPath = substr($cleanedPath, 8);
                } elseif (str_starts_with($cleanedPath, 'storage/')) {
                    $cleanedPath = substr($cleanedPath, 8);
                }
                $cleanedPath = ltrim($cleanedPath, '/');
            }
            $path = $cleanedPath === '' ? '/' : $cleanedPath;
        }
        $this->path = $path;
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
        $cacheKey = 'file_manager_tree_' . $this->disk;
        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 3600, function () {
            $rootPath = $this->storage->path('/');
            $flatItems = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($rootPath),
                RecursiveIteratorIterator::CHILD_FIRST
            );

            $tree = [];
            foreach ($flatItems as $item) {
                if (
                    !$item->isDir() ||
                    $this->firstCharIs($item->getFilename(), '.')
                ) continue;

                $path = [$item->getFilename() => []];

                for ($depth = $flatItems->getDepth() - 1; $depth >= 0; $depth--) {
                    $path = [$flatItems->getSubIterator($depth)->current()->getFilename() => $path];
                }
                $tree = array_merge_recursive($tree, $path);
            }

            return $this->transformTree($tree);
        });
    }

    public function transformTree($item, $name = null, $path = null)
    {
        $itemChildren = collect($item)
            ->map(fn ($subItem, $subKey) => $this->transformTree($subItem, $subKey, implode('/', [$path, $subKey])))
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
            ->filter(fn ($item) => $item->isDir())
            ->values()
            ->toArray();
    }

    public function files()
    {
        $files = $this->contents
            ->filter(fn ($item) => $item->isFile())
            ->values()
            ->reject(fn ($item) => $this->firstCharIs(basename($item->path()), '.'));

        if (request()->has('keyword')) {
            $keyword = request()->input('keyword');
            $keywordLower = mb_strtolower($keyword);
            $files = $files->filter(function($item) use ($keywordLower) {
                $filename = basename($item->path());
                $searchName = str_replace('-', ' ', Str::slug($filename));
                return str_contains(mb_strtolower($filename), $keywordLower) ||
                       str_contains(mb_strtolower($searchName), $keywordLower);
            });
        }

        // Sort by last modified descending
        $files = $files->sortByDesc(fn ($item) => $item->lastModified());

        if (request()->has('limit')) {
            $page = (int) (request()->input('page') ?? 1);
            $limit = (int) request()->input('limit');
            $files = $files->skip(($page - 1) * $limit)->take($limit);
        }

        return $files->values()->map(fn ($item) => $this->transformFile($item))->keyBy('path');
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

    public function store($files)
    {
        $successFiles = [];
        $failureFiles = [];

        foreach ($files as $file) {
            $fileName = $file->getClientOriginalName();

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
                        $targetPath = ($this->path == '/' ? '' : rtrim($this->path, '/') . '/') . $fileName;

                        $filePath = $this->storage->put($targetPath, $encoded) ? $targetPath : false;
                    } catch (\Exception $e) {
                        logger()->error('Image processing failed: ' . $e->getMessage());
                        $filePath = $this->storage->putFileAs(
                            $this->path,
                            $file,
                            $fileName
                        );
                    }
                } else {
                    $filePath = $this->storage->putFileAs(
                        $this->path,
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

    protected function clearTreeCache()
    {
        \Illuminate\Support\Facades\Cache::forget('file_manager_tree_' . $this->disk);
    }

    public function delete($items)
    {
        $deletedItems = [];
        $hasDirDeleted = false;

        foreach ($items as $item) {
            if (!$this->storage->exists($item['path'])) {
                continue;
            } else {
                if ($item['type'] === 'dir') {
                    $this->storage->deleteDirectory($item['path']);
                    $cacheFolder = 'cache/' . $item['path'];
                    $this->publicStorage->deleteDirectory($cacheFolder);
                    $hasDirDeleted = true;
                } else {
                    $this->storage->delete($item['path']);
                    $cacheFolder = 'cache/' . str_replace('.', '_', $item['path']);
                    $this->publicStorage->deleteDirectory($cacheFolder);
                }
            }

            $deletedItems[] = $item;
        }

        if ($hasDirDeleted) {
            $this->clearTreeCache();
        }

        return $deletedItems;
    }

    public function folderCreate($name)
    {
        $pathName = rtrim($this->path, '/') . '/' . ltrim($name, '/');

        if ($this->storage->exists($pathName)) {
            return false;
        }

        $result = (bool) $this->storage->makeDirectory($pathName);
        if ($result) {
            $this->clearTreeCache();
        }
        return $result;
    }

    public function folderDelete()
    {
        if (collect($this->storage->listContents($this->path))->count() > 0) {
            return false;
        }

        $result = (bool) $this->storage->deleteDirectory($this->path);
        if ($result) {
            $this->clearTreeCache();
        }
        return $result;
    }

    public function folderRename($newName)
    {
        $oldPath = rtrim($this->path, '/');
        $parentPath = dirname($oldPath);
        $newPath = ($parentPath === '.' ? '' : $parentPath . '/') . ltrim($newName, '/');

        if ($this->storage->exists($newPath)) {
            return false;
        }

        if ($this->storage->move($oldPath, $newPath)) {
            $this->clearTreeCache();
            return true;
        }

        return false;
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

            $image = Image::make($imagePath);

            if (isset($options['w'])) {
                $image->resize($options['w'], null, function ($constraint) {
                    $constraint->aspectRatio();
                });
            }

            $image
                ->encode($options['fm'], 80)
                ->save($this->publicStorage->path($cacheFullPath));
        }

        return redirect(asset('storage/' . $cacheFullPath), 302, [
            'Cache-Control' => 'public, max-age=86400',
        ]);
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
