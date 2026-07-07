<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Models\File;

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
        $relativePaths = $request->input('relative_paths', []);

        $file = new File($request->input('path', '/'));
        $result = $file->store($files, $relativePaths);

        if (!empty($result['failureFiles'])) {
            return response()->json([
                'message' => 'Tải file thất bại: File vượt quá giới hạn cấu hình PHP (upload_max_filesize / post_max_size) hoặc dung lượng tối đa cho phép.',
                'errors' => $result['failureFiles']
            ], 422);
        }

        return response()->json($result);
    }

    public function destroy(Request $request)
    {
        $file = new File();
        return $file->delete($request->input('files'));
    }

    public function folderCreate(Request $request)
    {
        $file = new File($request->input('path', '/'));
        $result = $file->folderCreate($request->input('name'));
        if (!$result) {
            return response()->json([
                'message' => 'Tạo thư mục thất bại. Thư mục đã tồn tại hoặc tên thư mục không hợp lệ.'
            ], 422);
        }
        return response()->json(['success' => true]);
    }

    public function folderDelete(Request $request)
    {
        $file = new File($request->input('path', '/'));
        $result = $file->folderDelete();
        if (!$result) {
            return response()->json([
                'message' => 'Xóa thư mục thất bại. Thư mục không trống hoặc không thể xóa.'
            ], 422);
        }
        return response()->json(['success' => true]);
    }
}
