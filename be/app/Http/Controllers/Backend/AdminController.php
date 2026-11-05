<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use JamstackVietnam\Core\Traits\HasCrudActions;

class AdminController extends Controller
{
    use HasCrudActions;

    public $model = Admin::class;

    public $appends = [
        'index' => [],
        'form' => []
    ];

    private function folder()
    {
        return "@Core/" . Str::studly($this->getTable());
    }

    private function beforeStore($request, $rules)
    {
        if (!$request->input('id')) {
            $request->validate([
                'role_id' => 'required',
                'password' => 'required|min:8|max:255|confirmed',
            ]);
        }

        return $rules;
    }

    private function beforeForm($data)
    {
        $data['sales_consultants'] = \App\Models\Vehicle\SalesConsultant::where('status', 'ACTIVE')
            ->sortByPosition()
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'email' => $c->email,
                'phone' => $c->phone,
            ]);

        return $data;
    }

    private function afterForm($item)
    {
        if (!current_admin()->hasRole('Super Admin') && $item->hasRole('Super Admin')) {
            abort(403);
        }

        return $item;
    }

    private function beforeIndex($query)
    {
        $query->orderByRaw('CASE WHEN id = 1 THEN 0 ELSE 1 END ASC')->orderBy('id', 'ASC');

        if (current_admin()->hasRole('Super Admin')) {
            $query->whereHas('roles', function ($query) {
                $query->whereNot('name', 'admin');
            });
        }

        return $query;
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'nullable|min:8|max:255|confirmed',
        ]);

        $data = [
            'name' => $request->input('name'),
        ];

        if ($password = $request->input('password')) {
            $data['password'] = Hash::make($password);
        }

        auth('admin')->user()->update($data);
    }
}
