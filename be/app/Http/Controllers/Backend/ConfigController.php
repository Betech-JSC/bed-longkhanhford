<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Models\Config;
use App\Traits\HasCrudActions;

class ConfigController extends Controller
{
    use HasCrudActions;

    public $model = Config::class;

    private function folder()
    {
        return Str::studly($this->getTable());
    }

    public function index()
    {
        $settingName =  Str::studly('configs');

        $breadcrumbs = [
            [
                'url' => route($this->getResource() . '.index'),
                'name' => 'Cài đặt',
            ]
        ];

        $flashSale = $this->defaultConfig(Config::FLASH_SALE, [
            ['image_title' => null],
            ['background_image' => null]
        ]);

        $featuredProduct = $this->defaultConfig(Config::FEATURED_PRODUCT, [
            ['image_title' => null],
            ['title' => null],
            ['text_color' => '#000000'],
            ['background_image' => null],
            ['products' => null]
        ]);

        $featuredCategory = $this->defaultConfig(Config::FEATURED_CATEGORY, [
            ['categories' => null]
        ]);

        $topCategory = $this->defaultConfig(Config::TOP_CATEGORY, [
            ['categories' => null]
        ]);

        $closed = $this->defaultConfig(Config::CLOSED, [
            ['time_open' => null],
            ['time_closed' => null],
            ['status' => Config::STATUS_OPEN]
        ]);

        $menuCategory = $this->defaultConfig(Config::MENU_CATEGORY, [
            ['categories' => null]
        ]);

        $search = $this->defaultConfig(Config::SEARCH, [
            ['keywords' => null]
        ]);

        $shipping = $this->defaultConfig(Config::SHIPPING, [
            ['default' => 50000],
            ['free_shipping' => 500000],
            ['product_count' => 10],
            ['free_shipping_vnp' => true]
        ]);

        $promotion = $this->defaultConfig(Config::PROMOTION, [
            ['content' => null]
        ]);

        $footerRedirect = $this->defaultConfig(Config::FOOTER_REDIRECT, [
            ['about' => null],
            ['job' => null]
        ]);

        $item = [
            'flash_sale' => [
                'image_title' => json_decode($flashSale['image_title']),
                'background_image' => json_decode($flashSale['background_image']),
            ],
            'featured_product' => [
                'image_title' => json_decode($featuredProduct['image_title']),
                'title' => $featuredProduct['title'] ?? null,
                'text_color' => $featuredProduct['text_color'] ?? '#000000',
                'background_image' => json_decode($featuredProduct['background_image']),
                'products' => json_decode($featuredProduct['products']) ?? [],
            ],
            'featured_category' => [
                'categories' => json_decode($featuredCategory['categories']) ?? []
            ],
            'top_category' => [
                'categories' => json_decode($topCategory['categories']) ?? []
            ],
            'closed' => $closed,
            'menu_category' => [
                'categories' => json_decode($menuCategory['categories']) ?? []
            ],
            'search' => [
                'keywords' => json_decode($search['keywords']) ?? []
            ],
            'shipping' => $shipping,
            'promotion' => $promotion,
            'footer_redirect' => $footerRedirect
        ];

        if (request()->wantsJson()) {
            return response()->json($item);
        }

        return Inertia::render($settingName, [
            'item' => $item,
            'breadcrumbs' => $breadcrumbs,
            'schema' => $this->getSchema(),
        ]);
    }

    public function store(Request $request, $id = null)
    {
        $this->checkAuthorize($id ? 'update' : 'store');

        $rules = $this->model::rules($id);

        $validated = $request->validate($rules);

        settings()->group($id)->set($validated);

        return $this->redirectBack('Lưu đối tượng thành công.');
    }

    public function defaultConfig($group, $columns)
    {
        $data = settings()->group($group)->all();

        if (count($data) == 0) {
            foreach ($columns as $column) {
                settings()->group($group)->set($column);
            }

            $data = settings()->group($group)->all();
        }

        return $data;
    }
}
