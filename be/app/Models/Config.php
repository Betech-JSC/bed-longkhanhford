<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    public const FLASH_SALE = 'flash-sale';
    public const FEATURED_PRODUCT = 'featured-products';
    public const FEATURED_CATEGORY = 'featured-categories';
    public const TOP_CATEGORY = 'top-categories';
    public const CLOSED = 'closed';
    public const MENU_CATEGORY = 'menu-categories';
    public const SEARCH = 'search';
    public const SHIPPING = 'shipping';
    public const PROMOTION = 'promotion';
    public const FOOTER_REDIRECT = 'footer-redirect';
    public const VNPAY = 'vnpay';

    public const STATUS_OPEN = 'open';
    public const STATUS_CLOSED = 'closed';
    public const STATUS_TIMER = 'timer';

    public $rules = [
        'group' => 'nullable',
        'name' => 'nullable',
    ];

    public static function rules($id)
    {
        return [
            self::FLASH_SALE => [
                'image_title' => 'required',
                'background_image' => 'required',
            ],
            self::FEATURED_PRODUCT => [
                'image_title' => 'nullable',
                'title' => 'required',
                'text_color' => ['required', 'regex:/^(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s\/]*[\d\.]+%?\))$/i'],
                'background_image' => 'required',
                'products' => 'required'
            ],
            self::FEATURED_CATEGORY => [
                'categories' => 'required'
            ],
            self::TOP_CATEGORY => [
                'categories' => 'required'
            ],
            self::CLOSED => [
                'time_open' => 'nullable',
                'time_closed' => 'nullable',
                'status' => 'nullable'
            ],
            self::MENU_CATEGORY => [
                'categories' => 'required'
            ],
            self::SEARCH => [
                'keywords' => 'nullable'
            ],
            self::SHIPPING => [
                'default' => 'required',
                'free_shipping' => 'required',
                'product_count' => 'required',
                'free_shipping_vnp' => 'required'
            ],
            self::PROMOTION => [
                'content' => 'nullable'
            ],
            self::FOOTER_REDIRECT => [
                'about' => 'nullable',
                'job' => 'nullable'
            ],
            self::VNPAY => [
                'tmn_code' => 'required',
                'hash_secret' => 'required',
                'test_mode' => 'required',
            ],
        ][$id] ?? [];
    }

    public static function getFeaturedProduct()
    {
        $featuredProduct = settings()->group(self::FEATURED_PRODUCT)->all();

        $data = [
            'image_title' => static_url(json_decode($featuredProduct['image_title'] ?? null)?->path),
            'title' => $featuredProduct['title'] ?? null,
            'text_color' => $featuredProduct['text_color'] ?? '#000000',
            'background_image' => static_url(json_decode($featuredProduct['background_image'] ?? null)?->path),
            'product_ids' => collect(json_decode($featuredProduct['products'] ?? null))->pluck('id')
        ];

        return $data;
    }

    public static function getFlashSale()
    {
        $featuredProduct = settings()->group(self::FLASH_SALE)->all();

        $data = [
            'image_title' => static_url(json_decode($featuredProduct['image_title'] ?? null)?->path),
            'background_image' => static_url(json_decode($featuredProduct['background_image'] ?? null)?->path),
        ];

        return $data;
    }

    public static function getFeaturedCategoryIds()
    {
        $featuredCategory = settings()->group(self::FEATURED_CATEGORY)->all();

        return collect(json_decode($featuredCategory['categories'] ?? null))->pluck('id');
    }

    public static function getTopCategoryIds()
    {
        $topCategory = settings()->group(self::TOP_CATEGORY)->all();

        return collect(json_decode($topCategory['categories'] ?? null))->pluck('id');
    }

    public static function getMenuCategoryIds()
    {
        $menuCategory = settings()->group(self::MENU_CATEGORY)->all();

        return collect(json_decode($menuCategory['categories'] ?? null))->pluck('id');
    }

    public static function getKeywords()
    {
        $search = settings()->group(self::SEARCH)->all();

        return collect(json_decode($search['keywords'] ?? null))->pluck('title');
    }

    public static function getShipping()
    {
        $shipping = settings()->group(self::SHIPPING)->all();

        return [
            'default' => $shipping['default'] ?? 50000,
            'free_shipping' => $shipping['free_shipping'] ?? 500000,
            'product_count' => $shipping['product_count'] ?? 0,
            'free_shipping_vnp' => $shipping['free_shipping_vnp'] ?? false
        ];
    }

    public static function getFooterRedirect()
    {
        $footerRedirect = settings()->group(self::FOOTER_REDIRECT)->all();

        return [
            'link_about' => $footerRedirect['about'] ?? null,
            'link_job' => $footerRedirect['job'] ?? null
        ];
    }

    public static function available()
    {
        $data = settings()->group(self::CLOSED)->all();

        if (!empty($data['status'])) {
            switch ($data['status']) {
                case self::STATUS_CLOSED:
                    return false;
                    break;
                case self::STATUS_TIMER:
                    $timeOpen = !empty($data['time_open']) ? strtotime($data['time_open']) : null;
                    $timeClosed = !empty($data['time_closed']) ? strtotime($data['time_closed']) : null;
                    $now = strtotime(now());

                    if ($timeOpen == null && $timeClosed == null) {
                        return true;
                    } else if ($timeOpen != null && $timeClosed == null) {
                        return $timeOpen < $now;
                    } else if ($timeOpen == null && $timeClosed != null) {
                        return $timeClosed > $now;
                    } else {
                        return ($timeOpen < $now && $timeClosed < $now)
                            || ($timeOpen > $now && $timeClosed > $now)
                            || $timeOpen < $now
                            || $timeClosed > $now;
                    }
                    break;
                default:
                    return true;
            }
        }
        return true;
    }

    public static function getPromotion()
    {
        $promotion = settings()->group(self::PROMOTION)->all();

        return $promotion['content'] ?? null;
    }
}
