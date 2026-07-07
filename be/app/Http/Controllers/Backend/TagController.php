<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use JamstackVietnam\Tag\Models\Tag;
use App\Traits\HasCrudActions;

class TagController extends Controller
{
    use HasCrudActions;
    public $model = Tag::class;
}
