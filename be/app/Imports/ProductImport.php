<?php

namespace App\Imports;

use App\Models\Product\Product;
use Rap2hpoutre\FastExcel\FastExcel;
use App\Models\Core\File;


class ProductImport
{
    private $products = [];

    public function import($path)
    {
        try {
            set_time_limit(0);
            ini_set('memory_limit', '-1');

            $data = (new FastExcel)->import($path);

            foreach ($data as $index => $line) {
                if (!empty($line['Tên']) && $index < 10) {
                    $brandId = $this->getBrandId($line['Hãng']);

                    $this->saveProduct($line, $brandId, 0);
                }
            }
            //dump('Import sản phẩm thành công');
            return true;
        } catch (Exception $e) {
            //dump('Import sản phẩm thất bại');
            return false;
        }
    }

    public function saveProduct($line, $brandId, $originId)
    {
        $default = empty($this->products[$line['Tên']]) ? true : false;

        $sku = explode('-', $line['Mã phiên bản sản phẩm'])[0];

        if ($default) {
            $file = new File('Product');

            $product = Product::updateOrCreate(
                [
                    'sku' => $sku,
                ],
                [
                    'content' => $line['Mô tả'],
                    'title' => $line['Tên'],
                    'seo_meta_title' => $line['SEO Title'],
                    'seo_meta_description' => $line['SEO Description'],
                    'seo_slug' => $line['Url'],
                    'status' => $line['Hiển thị'] == 'Yes' ? Product::STATUS_ACTIVE : Product::STATUS_INACTIVE
                ]
            );

            $this->products[$line['Tên']] = $product->id;

            return [$product->id];
        }
    }

    public function getCategoryIds($categories)
    {
        $categoryIds = [];
        $categories = explode('|', $categories);
        foreach ($categories as $category) {
            if (!empty($category)) {
                $categoryIds[] = $this->getCategoryId($category);
            }
        }

        return $categoryIds;
    }
}
