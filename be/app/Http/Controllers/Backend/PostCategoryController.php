<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Post\PostCategory;
use App\Traits\HasCrudActions;

class PostCategoryController extends Controller
{
    use HasCrudActions;
    public $model = PostCategory::class;
}
