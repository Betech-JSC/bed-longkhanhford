<?php

namespace JamstackVietnam\Core\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use JamstackVietnam\Core\Models\File;

class FileController extends Controller
{
    public function index()
    {
        if (request()->wantsJson()) {
            return $this->getData();
        }
        return Inertia::render('@Core/FileManager');
    }

    private function getData()
    {
        $file = new File(request()->input('path', '/'));

        return $file->items();
    }

    public function show(Request $request, $path = '/')
    {
        $file = new File($path);
        return $file->findOrFail($request->all());
    }

    public function store(Request $request)
    {
        $files = $request->file('files');

        $file = new File($request->input('path', '/'));
        return $file->store($files);
    }

    public function destroy(Request $request)
    {
        $file = new File();
        return $file->delete($request->input('files'));
    }

    public function folderCreate(Request $request)
    {
        $file = new File($request->input('path', '/'));
        return $file->folderCreate($request->input('name'));
    }

    public function folderDelete(Request $request)
    {
        $file = new File($request->input('path', '/'));
        return $file->folderDelete();
    }

    public function folderRename(Request $request)
    {
        $file = new File($request->input('path', '/'));
        return $file->folderRename($request->input('name'));
    }
}
