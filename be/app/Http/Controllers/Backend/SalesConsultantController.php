<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\SalesConsultant;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Rap2hpoutre\FastExcel\FastExcel;

class SalesConsultantController extends Controller
{
    use HasCrudActions;

    public $model = SalesConsultant::class;

    public function exportResourcesGenerator()
    {
        $query = $this->model::query();

        if ($selectIds = request()->input('sellectIds')) {
            $ids = explode(',', $selectIds);
            $query->whereIn('id', $ids);
        }

        foreach ($query->sortByPosition()->cursor() as $item) {
            $zaloNumber = $item->zalo_url;
            if ($item->zalo_url && preg_match('/zalo\.me\/([0-9]+)/', $item->zalo_url, $matches)) {
                $zaloNumber = $matches[1];
            }

            yield [
                'Họ tên' => $item->translate('vi')?->name ?? $item->name,
                'Số điện thoại/Zalo' => $item->phone,
                'Số zalo' => $zaloNumber,
                'PHÒNG' => $item->department,
                'Facebook' => $item->facebook_url,
                'Fanpage' => $item->fanpage_url,
                'Website' => $item->custom_domain,
            ];
        }
    }

    public function import(Request $request)
    {
        $this->checkAuthorize();

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        $file = $request->file('file');
        
        $rows = (new FastExcel)->import($file);

        if ($rows->isEmpty()) {
            return back()->with('error', 'File Excel không có dữ liệu!');
        }

        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {
                $normalizedRow = [];
                foreach ($row as $key => $value) {
                    $normalizedRow[trim($key)] = $value;
                }

                $name = trim($normalizedRow['Họ tên'] ?? $normalizedRow['Họ và tên'] ?? '');
                if (empty($name)) {
                    continue;
                }

                $phone = trim($normalizedRow['Số điện thoại/Zalo'] ?? $normalizedRow['Số điện thoại'] ?? '');
                $zalo = trim($normalizedRow['Số zalo'] ?? '');
                $department = trim($normalizedRow['PHÒNG'] ?? $normalizedRow['Phòng'] ?? '');
                $facebook = trim($normalizedRow['Facebook'] ?? '');
                $fanpage = trim($normalizedRow['Fanpage'] ?? '');
                $website = trim($normalizedRow['Website'] ?? '');

                // Format Zalo URL
                $zaloUrl = null;
                if (!empty($zalo)) {
                    if (str_starts_with($zalo, 'http')) {
                        $zaloUrl = $zalo;
                    } else {
                        $cleanZalo = preg_replace('/[^0-9]/', '', $zalo);
                        if (!empty($cleanZalo)) {
                            $zaloUrl = 'https://zalo.me/' . $cleanZalo;
                        }
                    }
                }

                // Format Facebook URL
                $facebookUrl = null;
                if (!empty($facebook)) {
                    if (str_starts_with($facebook, 'http')) {
                        $facebookUrl = $facebook;
                    } else {
                        $facebookUrl = $facebook;
                    }
                }

                // Format Fanpage URL
                $fanpageUrl = null;
                if (!empty($fanpage)) {
                    if (str_starts_with($fanpage, 'http')) {
                        $fanpageUrl = $fanpage;
                    } else {
                        $fanpageUrl = $fanpage;
                    }
                }

                // Map department (e.g. "1" or "PHÒNG 2" -> "1", "2")
                $departmentId = 'sales';
                if (!empty($department)) {
                    if (preg_match('/(\d+)/', $department, $matches)) {
                        $departmentId = $matches[1];
                    } else {
                        $lowerDept = strtolower($department);
                        if (str_contains($lowerDept, 'dịch vụ') || str_contains($lowerDept, 'service')) {
                            $departmentId = 'service';
                        } elseif (str_contains($lowerDept, 'marketing')) {
                            $departmentId = 'marketing';
                        } elseif (str_contains($lowerDept, 'kỹ thuật') || str_contains($lowerDept, 'technical')) {
                            $departmentId = 'technical';
                        } else {
                            $departmentId = $department;
                        }
                    }
                }

                // Clean website protocol if present in Excel
                if (!empty($website)) {
                    $website = preg_replace('/^https?:\/\//i', '', $website);
                    $website = trim($website, '/');
                }

                // Find existing consultant
                $consultant = null;
                if (!empty($phone)) {
                    $consultant = SalesConsultant::where('phone', $phone)->first();
                }
                
                if (!$consultant) {
                    $consultant = SalesConsultant::whereHas('translations', function ($q) use ($name) {
                        $q->where('name', $name)->where('locale', 'vi');
                    })->first();
                }

                if (!$consultant) {
                    $consultant = new SalesConsultant();
                    $consultant->sort_order = 0;
                }

                $consultant->fill([
                    'phone' => $phone ?: $consultant->phone,
                    'zalo_url' => $zaloUrl ?: $consultant->zalo_url,
                    'facebook_url' => $facebookUrl ?: $consultant->facebook_url,
                    'fanpage_url' => $fanpageUrl ?: $consultant->fanpage_url,
                    'custom_domain' => $website ?: $consultant->custom_domain,
                    'department' => $departmentId,
                    'status' => 'ACTIVE',
                ]);

                $consultant->fill([
                    'vi' => [
                        'name' => $name,
                        'slug' => str($name)->slug(),
                        'job_title' => $consultant->translate('vi')?->job_title ?? 'Cố vấn bán hàng',
                    ]
                ]);

                $consultant->save();
            }
        });

        return back()->with('success', 'Import danh sách cố vấn thành công!');
    }
}
