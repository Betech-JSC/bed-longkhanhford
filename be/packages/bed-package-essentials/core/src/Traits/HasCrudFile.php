<?php

namespace JamstackVietnam\Core\Traits;

use Illuminate\Support\Facades\Storage;
use JamstackVietnam\Core\Models\File;

trait HasCrudFile
{
    protected function storeFile($file, $folder = 'media', $user_id = null)
    {
        $path = Storage::putFile("uploads/{$folder}", $file);
        $user_id = $user_id ? $user_id : request()->user()->id;

        return File::create([
            'disk' => 'public',
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'extension' => $file->guessClientExtension() ?? '',
            'mime' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);
    }

    protected function storeFileByUrl($download_url, $folder = 'media', $user_id = null)
    {
        $fullPath = "uploads/{$folder}";

        $contents = file_get_contents($download_url);
        Storage::disk('public')->put("/" . $fullPath, $contents);

        return File::create([
            'user_id' => $user_id,
            'disk' => 'public',
            'path' => $fullPath,
        ]);
    }
}
