<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\Rule;

class LandingPage extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'landing_pages';

    public $translationModel = LandingPageTranslation::class;
    public $translationForeignKey = 'landing_page_id';
    public $with = ['translations'];

    protected $fillable = [
        'sales_consultant_id',
        'zalo_url',
        'sales_email',
        'vehicle_id',
        'vehicle_ids',
        'layout_blocks',
        'promotions',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'vehicle_ids' => 'array',
        'layout_blocks' => 'array',
        'promotions' => 'array',
        'sort_order' => 'integer',
    ];

    protected $appends = ['vehicles_list'];

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public $translatedAttributes = [
        'title',
        'seo_meta_title',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    public function setVehicleIdsAttribute($value)
    {
        if (is_string($value)) {
            $value = json_decode($value, true);
        }
        if (is_array($value)) {
            $ids = [];
            foreach ($value as $item) {
                $parsed = null;
                if (is_numeric($item)) {
                    // Plain int or string like "3", 5, "12"
                    $parsed = (int) $item;
                } elseif (is_array($item)) {
                    // Object like {id: 3, label: "..."} or {value: 3}
                    if (isset($item['id'])) {
                        $parsed = (int) $item['id'];
                    } elseif (isset($item['value'])) {
                        $parsed = (int) $item['value'];
                    }
                } elseif (is_object($item)) {
                    // StdClass object from JSON decode
                    if (isset($item->id)) {
                        $parsed = (int) $item->id;
                    } elseif (isset($item->value)) {
                        $parsed = (int) $item->value;
                    }
                }
                if ($parsed !== null && $parsed > 0) {
                    $ids[] = $parsed;
                }
            }
            // Loại bỏ trùng lặp và đảm bảo mảng tuần tự
            $ids = array_values(array_unique($ids));
            $this->attributes['vehicle_ids'] = json_encode($ids);
            if (!empty($ids)) {
                $currentVehicleId = (int)($this->attributes['vehicle_id'] ?? 0);
                if (!$currentVehicleId || !in_array($currentVehicleId, $ids)) {
                    $this->attributes['vehicle_id'] = $ids[0];
                }
            }
        } else {
            $this->attributes['vehicle_ids'] = null;
        }
    }

    public function getVehiclesListAttribute()
    {
        $ids = $this->vehicle_ids;
        if (empty($ids) && $this->vehicle_id) {
            $ids = [(int)$this->vehicle_id];
        }
        if (empty($ids)) {
            return [];
        }
        return Vehicle::whereIn('id', (array)$ids)->get()->map(fn($v) => [
            'id' => $v->id,
            'title' => $v->title,
            'slug' => $v->slug,
        ])->toArray();
    }

    protected static function booted()
    {
        static::saving(function ($landingPage) {
            // Tự động kiểm tra và xóa index UNIQUE cũ uid_lp_sales_vehicle trên mọi môi trường DB
            try {
                $hasOldIndex = \Illuminate\Support\Facades\DB::select("SHOW INDEXES FROM landing_pages WHERE Key_name = 'uid_lp_sales_vehicle'");
                if (!empty($hasOldIndex)) {
                    \Illuminate\Support\Facades\DB::statement("ALTER TABLE landing_pages DROP FOREIGN KEY fk_lp_sales_consultant_id");
                    \Illuminate\Support\Facades\DB::statement("ALTER TABLE landing_pages DROP INDEX uid_lp_sales_vehicle");
                    \Illuminate\Support\Facades\DB::statement("ALTER TABLE landing_pages ADD INDEX idx_lp_sales_consultant (sales_consultant_id)");
                    \Illuminate\Support\Facades\DB::statement("ALTER TABLE landing_pages ADD CONSTRAINT fk_lp_sales_consultant_id FOREIGN KEY (sales_consultant_id) REFERENCES sales_consultants(id) ON DELETE CASCADE");
                }
            } catch (\Throwable $e) {
                // Tháo gỡ lỗi nếu DB không có quyền DDL hoặc đã xóa
            }

            $ids = $landingPage->vehicle_ids;
            if (is_array($ids) && count($ids) > 0) {
                $currentVehicleId = (int)($landingPage->vehicle_id ?? 0);
                if (!$currentVehicleId || !in_array($currentVehicleId, array_map('intval', $ids))) {
                    $landingPage->vehicle_id = (int)$ids[0];
                }
            }
            // Tự nạp layout_blocks mặc định cho từng xe nếu chưa có
            $blocks = $landingPage->layout_blocks;
            $ids = $landingPage->vehicle_ids;

            if (is_array($ids) && count($ids) > 0) {
                // Kiểm tra xem layout_blocks có phải map format hay không
                $isMapFormat = is_array($blocks) && !empty($blocks) && !isset($blocks[0]);
                $isFlatArray = is_array($blocks) && !empty($blocks) && isset($blocks[0]);

                if (empty($blocks)) {
                    // Khởi tạo map format mới cho tất cả xe
                    $map = [];
                    foreach ($ids as $vid) {
                        $vehicle = Vehicle::find((int)$vid);
                        if ($vehicle) {
                            $vBlocks = $vehicle->layout_blocks;
                            if (is_string($vBlocks)) {
                                $vBlocks = json_decode($vBlocks, true);
                            }
                            $map[(string)$vid] = is_array($vBlocks) ? $vBlocks : [];
                        }
                    }
                    $landingPage->layout_blocks = $map;
                } elseif ($isFlatArray) {
                    // Legacy flat array: giữ nguyên backward compat — không auto-migrate
                } elseif ($isMapFormat) {
                    // Map format: bổ sung blocks cho xe mới thêm vào (nếu chưa có)
                    foreach ($ids as $vid) {
                        $vidStr = (string)$vid;
                        if (!isset($blocks[$vidStr]) && !isset($blocks[(int)$vid])) {
                            $vehicle = Vehicle::find((int)$vid);
                            if ($vehicle) {
                                $vBlocks = $vehicle->layout_blocks;
                                if (is_string($vBlocks)) {
                                    $vBlocks = json_decode($vBlocks, true);
                                }
                                $blocks[$vidStr] = is_array($vBlocks) ? $vBlocks : [];
                            }
                        }
                    }
                    $landingPage->layout_blocks = $blocks;
                }
            } elseif (empty($blocks) && $landingPage->vehicle_id) {
                // Fallback: 1 xe duy nhất, flat array
                $vehicle = Vehicle::find($landingPage->vehicle_id);
                if ($vehicle) {
                    $landingPage->layout_blocks = $vehicle->layout_blocks;
                }
            }
        });
    }

    public function salesConsultant()
    {
        return $this->belongsTo(SalesConsultant::class, 'sales_consultant_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    public function getFormattedZaloUrlAttribute(): ?string
    {
        $val = trim($this->zalo_url ?? '');
        if (empty($val)) return null;

        if (str_starts_with($val, 'http://') || str_starts_with($val, 'https://')) {
            return $val;
        }
        if (str_starts_with($val, 'zalo.me/')) {
            return 'https://' . $val;
        }
        $digits = preg_replace('/[^0-9]/', '', $val);
        return $digits ? ('https://zalo.me/' . $digits) : ('https://' . $val);
    }

    public function rules(): array
    {
        $salesConsultantId = request()->input('sales_consultant_id');
        $id = request()->route('id') ?? request()->input('id') ?? $this->id;

        $base = [
            'sales_consultant_id' => 'required|integer|exists:sales_consultants,id',
            'zalo_url' => 'nullable|string|max:255',
            'sales_email' => 'nullable|email|max:255',
            'vehicle_ids' => 'required|array|min:1',
            'vehicle_id' => 'nullable|integer',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order' => 'nullable|integer',
            'layout_blocks' => 'nullable|array',
            'promotions' => 'nullable|array',
            'vi.title' => 'required|string|max:255',
        ];

        return [
            'store' => $base,
            'update' => $base,
        ];
    }
}
