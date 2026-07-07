<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FirecrawlService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.firecrawl.dev/v1';

    public function __construct()
    {
        $this->apiKey = config('services.firecrawl.key') ?? env('FIRECRAWL_API_KEY', '');
    }

    /**
     * Scrape a vehicle URL from ford.com.vn and extract structured data using LLM.
     *
     * @param string $url
     * @return array|null
     */
    public function scrapeVehicle(string $url): ?array
    {
        if (empty($this->apiKey)) {
            Log::error('Firecrawl API Key is missing. Please set FIRECRAWL_API_KEY in your .env file.');
            return null;
        }

        $schema = $this->getVehicleExtractionSchema();

        try {
            Log::info("Starting Firecrawl scrape for URL: {$url}");

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])
            ->timeout(120) // Scrapes with JS and LLM can take up to 2 minutes
            ->post("{$this->baseUrl}/scrape", [
                'url' => $url,
                'formats' => ['extract', 'html'],
                'extract' => [
                    'schema' => $schema,
                    'prompt' => 'Extract the real vehicle data from the page. Do NOT make up or hallucinate URLs. All image and video URLs must be real URLs from the page, typically hosted on www.ford.com.vn under /content/dam/Ford/. If an image or video is not found, leave the field empty or null instead of providing dummy example.com URLs.'
                ]
            ]);

            if ($response->failed()) {
                Log::error('Firecrawl API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $result = $response->json();

            if (isset($result['success']) && $result['success'] === true && isset($result['data']['extract'])) {
                return [
                    'extract' => $result['data']['extract'],
                    'html' => $result['data']['html'] ?? null,
                ];
            }

            Log::error('Firecrawl returned unsuccessful response', ['response' => $result]);
            return null;
        } catch (\Throwable $e) {
            Log::error('Error occurred during Firecrawl scrape', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return null;
        }
    }

    /**
     * Scrape the comparison page and extract detailed specs for each version.
     *
     * @param string $url
     * @return array|null
     */
    public function scrapeCompareSpecs(string $url): ?array
    {
        if (empty($this->apiKey)) {
            Log::error('Firecrawl API Key is missing for compare scrape.');
            return null;
        }

        $schema = [
            'type' => 'object',
            'properties' => [
                'versions' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'name' => [
                                'type' => 'string',
                                'description' => 'Full version name or short name, e.g., "Trend", "Titanium", "Titanium X", "Sport", "Wildtrak".'
                            ],
                            'detailed_specs' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'category' => [
                                            'type' => 'string',
                                            'description' => 'Category of technical specification in Vietnamese, e.g., "Kích thước & Trọng lượng", "Động cơ & Hộp số", "Hệ thống treo & Phanh", "Ngoại thất", "Nội thất", "Trang bị an toàn".'
                                        ],
                                        'items' => [
                                            'type' => 'array',
                                            'items' => [
                                                'type' => 'object',
                                                'properties' => [
                                                    'name' => [
                                                        'type' => 'string',
                                                        'description' => 'Specification name or feature name in Vietnamese, e.g., "Chiều dài cơ sở", "Hệ thống đèn trước", "Màn hình trung tâm", "Hệ thống phanh trước", "Túi khí".'
                                                    ],
                                                    'value' => [
                                                        'type' => 'string',
                                                        'description' => 'Value of the specification for this vehicle version, e.g., "2726 mm", "LED", "12-inch", "Đĩa tản nhiệt", "7 túi khí".'
                                                    ]
                                                ],
                                                'required' => ['name', 'value']
                                            ],
                                            'description' => 'List of specification key-value pairs in this category.'
                                        ]
                                    ],
                                    'required' => ['category', 'items']
                                ]
                            ]
                        ],
                        'required' => ['name', 'detailed_specs']
                    ]
                ]
            ],
            'required' => ['versions']
        ];

        try {
            Log::info("Starting Firecrawl scrape for comparison specs URL: {$url}");

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])
            ->timeout(120)
            ->post("{$this->baseUrl}/scrape", [
                'url' => $url,
                'formats' => ['extract'],
                'extract' => [
                    'schema' => $schema,
                ],
                'onlyMainContent' => true,
            ]);

            if ($response->failed()) {
                Log::error('Firecrawl compare API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $result = $response->json();

            if (isset($result['success']) && $result['success'] === true && isset($result['data']['extract'])) {
                return $result['data']['extract'];
            }

            Log::error('Firecrawl compare returned unsuccessful response', ['response' => $result]);
            return null;
        } catch (\Throwable $e) {
            Log::error('Error occurred during Firecrawl compare scrape', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return null;
        }
    }

    /**
     * Get the JSON Schema for LLM extraction.
     *
     * @return array
     */
    protected function getVehicleExtractionSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'title' => [
                    'type' => 'string',
                    'description' => 'The main model name, e.g., "Ford Everest", "Ford Ranger", "Ford Territory".',
                ],
                'tagline' => [
                    'type' => 'string',
                    'description' => 'The official marketing slogan or tagline of the car, e.g., "Dấn bước phiêu lưu".',
                ],
                'description' => [
                    'type' => 'string',
                    'description' => 'A short summary/description introducing the vehicle model.',
                ],
                'base_price' => [
                    'type' => 'number',
                    'description' => 'The starting/base price of the vehicle model in VND, e.g., 1099000000.',
                ],
                'type' => [
                    'type' => 'string',
                    'enum' => ['suv', 'pickup', 'commercial'],
                    'description' => 'Classification of the vehicle.',
                ],
                'main_image' => [
                    'type' => 'string',
                    'description' => 'The direct URL of the main featured/hero image of the vehicle.',
                ],
                'video_url' => [
                    'type' => 'string',
                    'description' => 'The direct URL of the main introduction video or YouTube video for the vehicle, if available.',
                ],
                'hero_video_url' => [
                    'type' => 'string',
                    'description' => 'The direct URL of the background/hero looping video (.mp4 or .webm) for the vehicle header banner, if available.',
                ],
                'gallery_images' => [
                    'type' => 'array',
                    'items' => ['type' => 'string'],
                    'description' => 'List of image URLs showing exterior and interior views of the vehicle.',
                ],
                'colors' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'name' => [
                                'type' => 'string',
                                'description' => 'Color name in Vietnamese, e.g., "Trắng Tuyết", "Đỏ Cam".',
                            ],
                            'hex' => [
                                'type' => 'string',
                                'description' => 'Approximate Hex color code, e.g., "#fafafa", "#c2410c".',
                            ],
                            'image_url' => [
                                'type' => 'string',
                                'description' => 'The URL of the car image rendered in this specific color.',
                            ],
                            'versions' => [
                                'type' => 'array',
                                'items' => ['type' => 'string'],
                                'description' => 'Names of versions that support this color, e.g., ["Everest Sport", "Everest Titanium+"] or leave empty if all versions support it.',
                            ],
                            'images_360' => [
                                'type' => 'array',
                                'items' => ['type' => 'string'],
                                'description' => 'List of URLs for 360-degree rotation images showing exterior of the car in this color.',
                            ],
                            'images_360_internal' => [
                                'type' => 'array',
                                'items' => ['type' => 'string'],
                                'description' => 'List of URLs for 360-degree internal panorama views.',
                            ]
                        ],
                        'required' => ['name', 'hex', 'image_url'],
                    ],
                    'description' => 'Color options available for the vehicle.',
                ],
                'versions' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'name' => [
                                'type' => 'string',
                                'description' => 'Full version name, e.g., "Everest Sport 2.0L Single-Turbo 6AT".',
                            ],
                            'price' => [
                                'type' => 'number',
                                'description' => 'Official retail price in VND, e.g., 1178000000.',
                            ],
                            'specs' => [
                                'type' => 'object',
                                'properties' => [
                                    'engine' => ['type' => 'string', 'description' => 'Engine type, e.g., "Single-Turbo Diesel 2.0L i4".'],
                                    'power' => ['type' => 'string', 'description' => 'Max power output, e.g., "170 Hp @ 3500 rpm".'],
                                    'torque' => ['type' => 'string', 'description' => 'Max torque output, e.g., "405 Nm @ 1750-2500 rpm".'],
                                    'transmission' => ['type' => 'string', 'description' => 'Transmission system, e.g., "Tự động 6 cấp".'],
                                    'drivetrain' => ['type' => 'string', 'description' => 'Drivetrain system, e.g., "Một cầu sau (RWD)".'],
                                    'dimensions' => ['type' => 'string', 'description' => 'Dimensions (L x W x H), e.g., "4.914 x 1.923 x 1.842 mm".'],
                                    'clearance' => ['type' => 'string', 'description' => 'Ground clearance in mm, e.g., "200 mm".'],
                                    'fuelEconomy' => ['type' => 'string', 'description' => 'Average fuel economy, e.g., "7.5 L/100km".'],
                                    'detailed_specs' => [
                                        'type' => 'array',
                                        'items' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'category' => [
                                                    'type' => 'string',
                                                    'description' => 'Category of technical specification in Vietnamese, e.g., "Kích thước & Trọng lượng", "Động cơ & Vận hành", "Hệ thống treo & Phanh", "Ngoại thất", "Nội thất", "Trang bị an toàn".'
                                                ],
                                                'items' => [
                                                    'type' => 'array',
                                                    'items' => [
                                                        'type' => 'object',
                                                        'properties' => [
                                                            'name' => [
                                                                'type' => 'string',
                                                                'description' => 'Specification name or feature name in Vietnamese, e.g., "Chiều dài cơ sở", "Hệ thống đèn trước", "Màn hình trung tâm", "Hệ thống phanh trước", "Túi khí".'
                                                            ],
                                                            'value' => [
                                                                'type' => 'string',
                                                                'description' => 'Value of the specification for this vehicle version, e.g., "2726 mm", "LED", "12-inch", "Đĩa tản nhiệt", "7 túi khí".'
                                                            ]
                                                        ],
                                                        'required' => ['name', 'value']
                                                    ],
                                                    'description' => 'List of specification key-value pairs in this category.'
                                                ]
                                            ],
                                            'required' => ['category', 'items']
                                        ],
                                        'description' => 'All detailed technical specifications and features for this vehicle version grouped by categories.'
                                    ]
                                ],
                            ],
                        ],
                        'required' => ['name', 'price'],
                    ],
                    'description' => 'Different versions of the vehicle.',
                ],
                'accessories' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'name' => ['type' => 'string', 'description' => 'Accessory name, e.g., "Thảm lót sàn cao cấp".'],
                            'code' => ['type' => 'string', 'description' => 'Accessory part number or code, e.g., "AMN1J-5415494-AA".'],
                            'price' => ['type' => 'number', 'description' => 'Price in VND if available.'],
                            'image_url' => ['type' => 'string', 'description' => 'URL of the accessory image.'],
                            'description' => ['type' => 'string', 'description' => 'Short description of the accessory.'],
                        ],
                        'required' => ['name'],
                    ],
                    'description' => 'Official accessories compatible with this vehicle model.',
                ],
            ],
            'required' => ['title', 'tagline', 'description', 'versions', 'colors'],
        ];
    }
}
