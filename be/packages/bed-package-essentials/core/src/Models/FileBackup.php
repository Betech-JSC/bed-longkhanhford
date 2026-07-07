<?php

namespace JamstackVietnam\Core\Models;

use Illuminate\Support\Str;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use Illuminate\Support\Facades\Storage;
use Iman\Streamer\VideoStreamer;

class FileBackup
{
    protected $path;
    protected $disk;
    protected $storage;
    protected $contents;

    public const MAX_SIZE_LIST = [
        'image' => 5,
        'video' => 50,
        'application' => 100,
        'others' => 10,
    ];

    public function __construct($path = '/', $disk = null)
    {
        $this->path = $path;
        $this->disk = $disk ?? 'uploads';
        $this->storage = Storage::disk($this->disk);
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
        return $this->contents
            ->filter(fn ($item) => $item->isFile())
            ->values()
            ->map(fn ($item) => $this->transformFile($item))
            ->reject(fn ($item) => $this->firstCharIs($item['filename'], '.'))
            ->sortByDesc('last_modified')
            ->keyBy('path');
    }

    public function findOrFail($options = [])
    {
        try {
            if (str_contains($this->path, '.mp4') && request()->input('stream') !== 'false') {
                return VideoStreamer::streamFile($this->storage->path($this->path));
            }

            $fileData = $this->storage->get($this->path);
            $filePath = $this->storage->path($this->path);
            $mimeType = $this->storage->mimeType($this->path);

            if (str_contains($this->path, '.mp4')) {
                $size = $this->storage->size($this->path);

                return response()->make($fileData, 200)
                    ->header('Accept-Ranges', 'bytes')
                    ->header('Content-Length', $size)
                    ->header('Content-Type', $mimeType);
            }

            if (
                str_contains($this->path, '.pdf') &&
                isset($options['download'])
            ) {
                return response()
                    ->download($filePath, basename($filePath));
            }

            return response()->make($fileData, 200)
                ->header('Content-Type', $mimeType);
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
            if ($this->fileValidation($file)) {
                $filePath = $this->storage->putFileAs(
                    $this->path,
                    $file,
                    $file->getClientOriginalName()
                );
                $successFiles[] = static_url($filePath, [], false);
            } else {
                $failureFiles[] = $file->getClientOriginalName();
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
                } else {
                    $this->storage->delete($item['path']);
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
