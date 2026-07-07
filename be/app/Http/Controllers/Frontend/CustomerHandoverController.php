<?php

namespace App\Http\Controllers\Frontend;

use App\Models\CustomerHandover;
use Illuminate\Routing\Controller;

class CustomerHandoverController extends Controller
{
    public function index()
    {
        $handovers = CustomerHandover::query()
            ->active()
            ->sortByPosition()
            ->get()
            ->map(fn($item) => $item->transform());

        return response()->json([
            'success' => true,
            'data' => $handovers
        ]);
    }
}
