<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Vehicle\VehicleVersion;
use App\Models\Vehicle\Accessory;
use App\Services\FirecrawlService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CrawlFordVehicle extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vehicle:crawl-ford {url? : The Ford VN vehicle URL to crawl} 
                            {--category_id= : The ID of the category to assign the vehicle to} 
                            {--html-file= : Path to a local HTML file containing the vehicle page source}
                            {--compare-html-file= : Path to a local HTML file containing the comparison specifications page source}
                            {--features-html-file= : Path to a local HTML file containing the features page source}
                            {--test-connection : Test the Firecrawl API key connection}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crawl vehicle specifications, versions, colors, 360 views, and accessories from ford.com.vn using Firecrawl';

    protected FirecrawlService $firecrawlService;

    public function __construct(FirecrawlService $firecrawlService)
    {
        parent::__construct();
        $this->firecrawlService = $firecrawlService;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        if ($this->option('test-connection')) {
            return $this->testConnection();
        }

        $url = $this->argument('url');
        if (empty($url)) {
            $this->error('Please provide a Ford VN vehicle URL (e.g. https://www.ford.com.vn/showroom/electric/ford-mustang-mach-e/).');
            return Command::FAILURE;
        }

        $this->info("=== Starting Crawl & Sync process ===");
        $this->info("Target URL: {$url}");

        $htmlFile = $this->option('html-file');
        $compareHtmlFile = $this->option('compare-html-file');
        $featuresHtmlFile = $this->option('features-html-file');
        $rawHtml = null;
        $data = null;
        $compareData = null;

        if ($htmlFile) {
            if (!file_exists($htmlFile)) {
                $this->error("HTML file not found: {$htmlFile}");
                return Command::FAILURE;
            }
            $rawHtml = file_get_contents($htmlFile);
            $this->info("✓ Read raw HTML content from local file: {$htmlFile}");

            $this->info("Parsing vehicle information locally from HTML...");
            $data = $this->parseVehicleFromHtml($rawHtml, $url);

            if ($compareHtmlFile) {
                if (file_exists($compareHtmlFile)) {
                    $compareRawHtml = file_get_contents($compareHtmlFile);
                    $this->info("✓ Read compare HTML content from local file: {$compareHtmlFile}");
                    $compareData = $this->parseCompareSpecsFromHtml($compareRawHtml);
                } else {
                    $this->warn("⚠ Compare HTML file not found: {$compareHtmlFile}");
                }
            }

            if ($featuresHtmlFile) {
                if (file_exists($featuresHtmlFile)) {
                    $featuresRawHtml = file_get_contents($featuresHtmlFile);
                    $this->info("✓ Read features HTML content from local file: {$featuresHtmlFile}");
                    $localFeatures = $this->parseFeaturesFromHtml($featuresRawHtml);
                    if (!empty($localFeatures)) {
                        $data['features'] = $localFeatures;
                        $this->info("✓ Parsed " . count($localFeatures) . " features from features HTML file.");
                    }
                } else {
                    $this->warn("⚠ Features HTML file not found: {$featuresHtmlFile}");
                }
            }
        } else {
            // 1. Fetch data from Firecrawl
            $this->info("Fetching and extracting data from Firecrawl API (this might take up to 2 minutes)...");
            $scrapeResult = $this->firecrawlService->scrapeVehicle($url);

            if (empty($scrapeResult) || empty($scrapeResult['extract'])) {
                $this->error('Failed to extract data. Please check Firecrawl logs or API Key.');
                return Command::FAILURE;
            }

            $data = $scrapeResult['extract'];
            $rawHtml = $scrapeResult['html'] ?? null;

            // Try to scrape detailed specifications from the compare.html page
            $compareUrl = rtrim($url, '/') . '/compare.html';
            $this->info("Fetching detailed specifications from comparison page: {$compareUrl}...");
            $compareData = $this->firecrawlService->scrapeCompareSpecs($compareUrl);

            // Try to scrape features page from feature.html or features.html
            $featuresUrl = rtrim($url, '/') . '/feature.html';
            $this->info("Fetching detailed features from page: {$featuresUrl}...");
            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer' => 'https://www.ford.com.vn/'
                ])->timeout(15)->get($featuresUrl);
                
                if ($response->failed()) {
                    $featuresUrlPlural = rtrim($url, '/') . '/features.html';
                    $response = Http::withHeaders([
                        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Referer' => 'https://www.ford.com.vn/'
                    ])->timeout(15)->get($featuresUrlPlural);
                }
                
                if ($response->successful()) {
                    $featuresRawHtml = $response->body();
                    $onlineFeatures = $this->parseFeaturesFromHtml($featuresRawHtml);
                    if (!empty($onlineFeatures)) {
                        $data['features'] = $onlineFeatures;
                        $this->info("✓ Loaded " . count($onlineFeatures) . " features from features page online.");
                    }
                }
            } catch (\Throwable $e) {
                $this->warn("⚠ Could not load online features page: " . $e->getMessage());
            }
        }

        $this->info("✓ Data extracted successfully!");
        $this->line("Vehicle Model: " . ($data['title'] ?? 'Unknown'));
        $this->line("Slogan: " . ($data['tagline'] ?? 'N/A'));
        $this->line("Total Versions: " . (isset($data['versions']) ? count($data['versions']) : 0));
        $this->line("Total Colors: " . (isset($data['colors']) ? count($data['colors']) : 0));
        $this->line("Total Accessories: " . (isset($data['accessories']) ? count($data['accessories']) : 0));

        if (!empty($compareData) && isset($compareData['versions'])) {
            $this->info("✓ Detailed specifications loaded successfully!");
            
            // Map the detailed specs back to the main versions array
            foreach ($data['versions'] as $verIndex => &$mainVersion) {
                $mainClean = strtolower(preg_replace('/\s+/', '', $mainVersion['name']));
                
                // Try to find matching version in compareData
                $matchedCompareVersion = null;
                foreach ($compareData['versions'] as $compVersion) {
                    if (empty($compVersion['name'])) continue;
                    $compClean = strtolower(preg_replace('/\s+/', '', $compVersion['name']));
                    // Match if mainName contains compName or vice versa (e.g. "everestwildtrak" contains "wildtrak")
                    if (str_contains($mainClean, $compClean) || str_contains($compClean, $mainClean)) {
                        $matchedCompareVersion = $compVersion;
                        break;
                    }
                }
                
                if ($matchedCompareVersion && isset($matchedCompareVersion['detailed_specs'])) {
                    if (!isset($mainVersion['specs'])) {
                        $mainVersion['specs'] = [];
                    }
                    $mainVersion['specs']['detailed_specs'] = $matchedCompareVersion['detailed_specs'];
                    $this->info("   Mapped detailed specs to version: {$mainVersion['name']}");
                }
            }
            unset($mainVersion);
        } else {
            $this->warn("⚠ Could not load detailed specifications. Saving summary specs only.");
        }

        // 2. Resolve Category ID
        $categoryId = $this->resolveCategoryId($data);
        if (!$categoryId) {
            $this->error('Failed to resolve category. Aborting process.');
            return Command::FAILURE;
        }
        $this->info("✓ Category assigned ID: {$categoryId}");

        // 3. Process database insert/update with image downloads
        $this->info("Downloading images and writing to Database...");
        
        $title = $data['title'] ?? 'Ford Vehicle';
        
        // Normalize title to match existing seed records (e.g. "Ford Territory Mới" -> "FORD TERRITORY")
        $normalizedTitle = trim(preg_replace('/\s+(Mới|Thế hệ Mới)$/iu', '', $title));
        $slug = Str::slug($normalizedTitle);
        $title = mb_strtoupper($normalizedTitle);

        // Extract 360 image URLs and video URLs from page HTML first
        $this->info("Extracting media paths from page HTML...");
        $mediaData = $this->extractMediaFromPage($rawHtml, $url);
        $extracted360Urls = $mediaData['urls_360'] ?? [];
        $videoUrl = $mediaData['video_url'] ?? ($data['video_url'] ?? null);
        $heroVideoUrl = $mediaData['hero_video_url'] ?? ($data['hero_video_url'] ?? null);
        $this->info("Found " . count($extracted360Urls) . " candidate 360 images in HTML. Video: " . ($videoUrl ?? 'N/A') . ", Hero Video: " . ($heroVideoUrl ?? 'N/A'));

        $allVersionNames = array_map(function($v) {
            return $v['name'] ?? '';
        }, $data['versions'] ?? []);

        // If colors are empty or we want to supplement them from extracted 360 URLs
        if (empty($data['colors']) && !empty($extracted360Urls)) {
            $this->info("No colors found in Firecrawl data, reconstructing colors from 360 image paths...");
            $colorsFrom360 = [];
            foreach ($extracted360Urls as $extUrl) {
                if (preg_match('/\/360\/([^\/]+)\//iu', $extUrl, $colorMatches)) {
                    $colorFolder = urldecode($colorMatches[1]);
                    $colorKey = strtolower($colorFolder);
                    
                    if (!isset($colorsFrom360[$colorKey])) {
                        // Convert "đỏ-thể-thao" to "Đỏ Thể Thao"
                        $words = explode('-', $colorFolder);
                        $formattedWords = array_map(function($word) {
                            return mb_convert_case($word, MB_CASE_TITLE, "UTF-8");
                        }, $words);
                        $colorName = implode(' ', $formattedWords);
                        
                        $colorsFrom360[$colorKey] = [
                            'name' => $colorName,
                            'hex' => '#cccccc', // Default hex
                            'image_url' => $extUrl, // Use the 360 frame as the color preview render
                            'versions' => $allVersionNames,
                            'images_360' => [],
                            'images_360_internal' => []
                        ];
                    }
                }
            }
            if (!empty($colorsFrom360)) {
                $data['colors'] = array_values($colorsFrom360);
                $this->info("Reconstructed " . count($data['colors']) . " colors from 360 paths: " . implode(', ', array_column($data['colors'], 'name')));
            }
        }

        try {
            DB::transaction(function () use ($data, $categoryId, $slug, $title, $extracted360Urls, $allVersionNames, $videoUrl, $heroVideoUrl) {
                // Download main image
                $this->info("Downloading main image...");
                $mainImage = $this->downloadImage($data['main_image'] ?? null, "vehicles/{$slug}");

                // Download gallery images
                $this->info("Downloading gallery images...");
                $gallery = $this->downloadImageArray($data['gallery_images'] ?? [], "vehicles/{$slug}/gallery");

                // Download colors and their respective 360 views
                $colors = [];
                foreach ($data['colors'] ?? [] as $colorIndex => $colorData) {
                    $colorName = $colorData['name'];
                    $this->info("Processing Color: {$colorName}...");
                    
                    $colorImage = $this->downloadImage($colorData['image_url'] ?? null, "vehicles/{$slug}/colors");
                    
                    // Folder-safe color slug
                    $colorSlug = Str::slug($colorName);
                    
                    // Find matching 360 URLs from the extracted list or guess candidates
                    $matched360Urls = [];
                    foreach ($extracted360Urls as $extUrl) {
                        $decodedUrl = rawurldecode($extUrl);
                        $lowerUrl = mb_strtolower($decodedUrl);
                        $lowerColor = mb_strtolower($colorName);
                        $slugColor = Str::slug($colorName);
                        $colorWithDashes = str_replace(' ', '-', $lowerColor);

                        // Match color name (either exact Vietnamese e.g. "đen", with dashes e.g. "đỏ-thể-thao", or slug e.g. "den")
                        $colorMatches = str_contains($lowerUrl, '/' . $lowerColor . '/') 
                                     || str_contains($lowerUrl, '/' . $colorWithDashes . '/')
                                     || str_contains($lowerUrl, '/' . $slugColor . '/')
                                     || str_contains($lowerUrl, '/' . str_replace('-', '', $slugColor) . '/');
                                     
                        // If version names are present for this color, verify the URL also matches one of the versions
                        $versionMatches = true;
                        if (!empty($colorData['versions'])) {
                            $versionMatches = false;
                            foreach ($colorData['versions'] as $vName) {
                                $vSlug = Str::slug($vName);
                                $vClean = str_replace([$slug . '-', 'ford-'], '', $vSlug);
                                
                                // Relaxed drivetrain-agnostic matching (e.g. premium-awd matches premium-4wd or premium)
                                $vCleanNoDrivetrain = str_replace(['-awd', '-2wd', '-4wd', '-4x4', '-4x2', '-rwd', '-fwd'], '', $vClean);
                                $lowerUrlNoDrivetrain = str_replace(['-awd', '-2wd', '-4wd', '-4x4', '-4x2', '-rwd', '-fwd'], '', $lowerUrl);
                                
                                if (str_contains($lowerUrl, '/' . $vClean . '/') || 
                                    str_contains($lowerUrl, '/' . $vSlug . '/') ||
                                    str_contains($lowerUrlNoDrivetrain, '/' . $vCleanNoDrivetrain . '/')) {
                                    $versionMatches = true;
                                    break;
                                }
                            }
                        }

                        if ($colorMatches && $versionMatches) {
                            $matched360Urls[] = $extUrl;
                        }
                    }

                    // If no match from page HTML, check if Firecrawl returned some under colorData
                    if (empty($matched360Urls)) {
                        $matched360Urls = array_merge(
                            $colorData['images_360'] ?? [],
                            $colorData['images_360_internal'] ?? []
                        );
                    }

                    // If still empty, try to guess the candidates using typical Ford patterns
                    if (empty($matched360Urls)) {
                        $matched360Urls = $this->guess360UrlCandidates($slug, $colorName, $colorData['versions'] ?? $allVersionNames);
                    }

                    // If we found any working URL, expand it to all 36 frames
                    $expandedExteriorUrls = [];
                    foreach ($matched360Urls as $matchedUrl) {
                        if (str_contains($matchedUrl, '/360/') || str_contains($matchedUrl, '/colorizer/')) {
                            $seqInfo = $this->detectSequenceBaseUrl($matchedUrl);
                            if ($seqInfo) {
                                for ($i = 1; $i <= 36; $i++) {
                                    $numStr = str_pad($i, $seqInfo['padding'], '0', STR_PAD_LEFT);
                                    $expandedExteriorUrls[] = $seqInfo['base'] . $numStr . $seqInfo['ext'];
                                }
                                break; // Stop after first successful sequence expansion
                            } else {
                                $expandedExteriorUrls[] = $matchedUrl;
                            }
                        }
                    }
                    $expandedExteriorUrls = array_values(array_unique($expandedExteriorUrls));

                    $this->info(" - Downloading " . count($expandedExteriorUrls) . " exterior 360 images for {$colorName}...");
                    $images360 = $this->downloadImageArray(
                        $expandedExteriorUrls, 
                        "vehicles/360/{$slug}/{$colorSlug}/exterior"
                    );

                    // Color-shifting fallback if no images could be downloaded for a blue/xanh color
                    if (empty($images360) && (str_contains(mb_strtolower($colorName), 'xanh') || str_contains(strtolower($colorName), 'blue'))) {
                        $this->info(" -> No 360 images found on CDN for {$colorName}. Attempting to generate from another color...");
                        $targetColorType = 'blue';
                        if ($slug === 'ford-mustang-mach-e' && str_contains(mb_strtolower($colorName), 'mãnh liệt')) {
                            $targetColorType = 'green';
                        }
                        $images360 = $this->generateColorShifted360($colors, $slug, $colorSlug, $targetColorType);
                    }
                    
                    // For interior, process similarly if internal 360 is found
                    $interiorUrls = [];
                    foreach ($colorData['images_360_internal'] ?? [] as $intUrl) {
                        $seqInfo = $this->detectSequenceBaseUrl($intUrl);
                        if ($seqInfo) {
                            for ($i = 1; $i <= 36; $i++) {
                                $numStr = str_pad($i, $seqInfo['padding'], '0', STR_PAD_LEFT);
                                $interiorUrls[] = $seqInfo['base'] . $numStr . $seqInfo['ext'];
                            }
                        } else {
                            $interiorUrls[] = $intUrl;
                        }
                    }
                    $interiorUrls = array_values(array_unique($interiorUrls));

                    $this->info(" - Downloading " . count($interiorUrls) . " interior 360 images for {$colorName}...");
                    $images360Internal = $this->downloadImageArray(
                        $interiorUrls, 
                        "vehicles/360/{$slug}/{$colorSlug}/interior"
                    );

                    $colors[] = [
                        'name' => $colorName,
                        'hex' => $colorData['hex'] ?? '#cccccc',
                        'image_path' => $colorImage ? $colorImage['path'] : null,
                        'versions' => $colorData['versions'] ?? [],
                        'images_360' => $images360,
                        'images_360_internal' => $images360Internal,
                    ];
                }

                // Find or init vehicle by slug or by exact title translation to prevent duplicates
                $vehicle = Vehicle::whereHas('translations', function ($q) use ($slug, $title) {
                    $q->where('locale', 'vi')
                      ->where(function ($sub) use ($slug, $title) {
                          $sub->where('slug', $slug)
                              ->orWhere('title', $title);
                      });
                })->first();

                // Download actual features
                $this->info("Downloading actual feature images...");
                $downloadedFeatures = [];
                foreach ($data['features'] ?? [] as $fIndex => $feat) {
                    $fImg = $this->downloadImage($feat['image'], "vehicles/{$slug}/features");
                    $downloadedFeatures[] = [
                        'title' => $feat['title'],
                        'description' => $feat['description'],
                        'image' => $fImg ? ['path' => $fImg['path']] : null
                    ];
                }

                // Construct layout blocks dynamically for overview page rendering
                $this->info("Constructing layout blocks...");
                $layoutBlocks = [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => $title,
                            'tagline' => $data['tagline'] ?? 'Cơ hội vàng. Sẵn sàng rước xế.',
                            'button_text' => 'Nhận chương trình ưu đãi',
                            'button_link' => "/lien-he?vehicle={$slug}",
                            'background_image' => $mainImage ? ['path' => $mainImage['path']] : null,
                            'background_video' => $heroVideoUrl
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => "Ưu Đãi Đặc Biệt Cho Xe {$title}",
                            'description' => "Nhận ngay ưu đãi giá bán tốt nhất, quà tặng đặc quyền và hỗ trợ trả góp ưu đãi khi mua xe {$title} tại Long Khánh Ford.",
                            'image' => count($gallery) > 0 ? ['path' => $gallery[0]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null),
                            'button_text' => 'Tư vấn ưu đãi'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => "Khám phá {$title} 360°",
                            'description' => 'Trải nghiệm góc nhìn 360 độ ngoại thất mượt mà và sang trọng.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => isset($downloadedFeatures[0]['title']) ? $downloadedFeatures[0]['title'] : 'Thiết kế hiện đại, mạnh mẽ',
                            'image_1' => isset($downloadedFeatures[0]['image']) ? $downloadedFeatures[0]['image'] : (count($gallery) > 1 ? ['path' => $gallery[1]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null)),
                            'image_2' => isset($downloadedFeatures[1]['image']) ? $downloadedFeatures[1]['image'] : (count($gallery) > 2 ? ['path' => $gallery[2]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null)),
                            'image_3' => isset($downloadedFeatures[2]['image']) ? $downloadedFeatures[2]['image'] : (count($gallery) > 3 ? ['path' => $gallery[3]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null)),
                            'title_2' => isset($downloadedFeatures[1]['title']) ? $downloadedFeatures[1]['title'] : 'Nội thất sang trọng & Khoang cabin rộng rãi',
                            'image_large' => isset($downloadedFeatures[3]['image']) ? $downloadedFeatures[3]['image'] : (count($gallery) > 4 ? ['path' => $gallery[4]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null)),
                            'image_large_2' => isset($downloadedFeatures[4]['image']) ? $downloadedFeatures[4]['image'] : (count($gallery) > 5 ? ['path' => $gallery[5]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null)),
                            'image_large_3' => isset($downloadedFeatures[5]['image']) ? $downloadedFeatures[5]['image'] : (count($gallery) > 6 ? ['path' => $gallery[6]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null)),
                            'title_3' => isset($downloadedFeatures[2]['title']) ? $downloadedFeatures[2]['title'] : 'Công nghệ kết nối & An toàn vượt trội',
                            'split_image' => isset($downloadedFeatures[0]['image']) ? $downloadedFeatures[0]['image'] : (count($gallery) > 0 ? ['path' => $gallery[0]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null)),
                            'split_title' => isset($downloadedFeatures[0]['title']) ? $downloadedFeatures[0]['title'] : 'Trang bị thông minh',
                            'split_features' => array_values(array_filter([
                                isset($data['versions'][0]['specs']['engine']) ? ['value' => $data['versions'][0]['specs']['engine'], 'label' => 'Động cơ mạnh mẽ'] : null,
                                isset($data['versions'][0]['specs']['transmission']) ? ['value' => $data['versions'][0]['specs']['transmission'], 'label' => 'Hộp số mượt mà'] : null,
                                isset($data['versions'][0]['specs']['drivetrain']) ? ['value' => $data['versions'][0]['specs']['drivetrain'], 'label' => 'Hệ thống dẫn động'] : null,
                            ]))
                        ]
                    ],
                    [
                        'type' => 'FeaturesList',
                        'data' => [
                            'features' => $downloadedFeatures
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => "Các phiên bản {$title}",
                            'descriptions' => array_map(function($v) {
                                return $v['name'] . ': Sở hữu khả năng vận hành vượt trội và các tính năng an toàn hàng đầu.';
                            }, $data['versions'] ?? [])
                        ]
                    ],
                    [
                        'type' => 'SpecsGrid',
                        'data' => []
                    ],
                    [
                        'type' => 'AccessoriesList',
                        'data' => []
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => "Bắt đầu cuộc sống hiện đại cùng {$title}",
                            'phone' => '0918 90 90 60',
                            'btn_text' => 'Nhận báo giá chi tiết',
                            'btn_link' => "/lien-he?vehicle={$slug}&reason=Nhận báo giá",
                            'car_image' => $mainImage ? ['path' => $mainImage['path']] : null
                        ]
                    ]
                ];

                if (!empty($videoUrl)) {
                    array_splice($layoutBlocks, count($layoutBlocks) - 1, 0, [[
                        'type' => 'VideoShowcase',
                        'data' => [
                            'title' => "Trải Nghiệm Thực Tế Xe {$title}",
                            'video_url' => $videoUrl,
                            'description' => "Xem video giới thiệu chi tiết về thiết kế, công nghệ và khả năng vận hành của dòng xe {$title}."
                        ]
                    ]]);
                }

                $vehiclePayload = [
                    'category_id' => $categoryId,
                    'type' => $data['type'] ?? 'suv',
                    'base_price' => $data['base_price'] ?? 0,
                    'image' => $mainImage,
                    'images' => $gallery,
                    'colors' => $colors,
                    'status' => 'ACTIVE',
                    'layout_blocks' => $layoutBlocks,
                ];

                if ($vehicle) {
                    $vehicle->update($vehiclePayload);
                    $this->info("✓ Existing Vehicle found, updating metadata.");
                } else {
                    $vehicle = Vehicle::create($vehiclePayload);
                    $this->info("✓ Vehicle created successfully.");
                }

                // Set translations via Astrotomic Translatable
                $vehicleTranslation = $vehicle->translateOrNew('vi');
                $vehicleTranslation->title = $title;
                $vehicleTranslation->slug = $slug;
                $vehicleTranslation->tagline = $data['tagline'] ?? '';
                $vehicleTranslation->description = $data['description'] ?? '';
                $vehicle->save();

                // Sync Versions
                $this->info("Syncing versions & technical specifications...");
                $versionIdsToKeep = [];

                foreach ($data['versions'] ?? [] as $index => $versionData) {
                    $versionName = $versionData['name'];
                    $this->info(" - Version: {$versionName}");

                    $version = $vehicle->versions()->whereHas('translations', function ($q) use ($versionName) {
                        $q->where('name', $versionName)->where('locale', 'vi');
                    })->first();

                    $versionImage = null;
                    if (isset($versionData['image_url'])) {
                        $versionImage = $this->downloadImage($versionData['image_url'], "vehicles/{$slug}/versions");
                    }

                    $versionPayload = [
                        'price' => $versionData['price'] ?? 0,
                        'specs' => $versionData['specs'] ?? null,
                        'image' => $versionImage,
                        'status' => 'ACTIVE',
                        'sort_order' => $index + 1,
                    ];

                    if ($version) {
                        $version->update($versionPayload);
                    } else {
                        $version = $vehicle->versions()->create($versionPayload);
                    }

                    // Set version translations via Astrotomic
                    $versionTranslation = $version->translateOrNew('vi');
                    $versionTranslation->name = $versionName;
                    $version->save();

                    $versionIdsToKeep[] = $version->id;
                }

                // Delete old versions not returned in the scrape
                $deletedVersions = $vehicle->versions()->whereNotIn('id', $versionIdsToKeep)->delete();
                if ($deletedVersions > 0) {
                    $this->info(" - Cleaned up {$deletedVersions} old versions.");
                }

                // Sync Accessories
                $this->info("Syncing compatible accessories...");
                foreach ($data['accessories'] ?? [] as $accData) {
                    $accTitle = $accData['name'];
                    $accCode = $accData['code'] ?? null;
                    
                    $this->info(" - Accessory: {$accTitle} (Code: " . ($accCode ?? 'N/A') . ")");

                    $accImage = null;
                    if (isset($accData['image_url'])) {
                        $accImage = $this->downloadImage($accData['image_url'], 'accessories');
                    }

                    $accessory = null;
                    if ($accCode) {
                        $accessory = Accessory::where('code', $accCode)->first();
                    }
                    if (!$accessory) {
                        $accessory = Accessory::whereHas('translations', function ($q) use ($accTitle) {
                            $q->where('title', $accTitle)->where('locale', 'vi');
                        })->first();
                    }

                    $fitVehicles = [];
                    if ($accessory && is_array($accessory->fit_vehicles)) {
                        $fitVehicles = $accessory->fit_vehicles;
                    }
                    if (!in_array($title, $fitVehicles)) {
                        $fitVehicles[] = $title;
                    }

                    $accPayload = [
                        'code' => $accCode,
                        'price' => $accData['price'] ?? null,
                        'image' => $accImage,
                        'fit_vehicles' => $fitVehicles,
                        'status' => 'ACTIVE',
                    ];

                    if ($accessory) {
                        $accessory->update($accPayload);
                    } else {
                        $accessory = Accessory::create($accPayload);
                    }

                    // Set accessory translations via Astrotomic
                    $accTranslation = $accessory->translateOrNew('vi');
                    $accTranslation->title = $accTitle;
                    $accTranslation->slug = Str::slug($accTitle);
                    $accTranslation->description = $accData['description'] ?? null;
                    $accessory->save();

                    // Sync vehicle to accessory Many-to-Many
                    if (isset($vehicle->id)) {
                        $accessory->vehicles()->syncWithoutDetaching([$vehicle->id]);
                    }
                }
            });

            $this->info("✓ Vehicle and all relations successfully synced!");
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("Database transaction failed: " . $e->getMessage());
            $this->line($e->getTraceAsString());
            return Command::FAILURE;
        }
    }

    /**
     * Resolve the category ID for the vehicle.
     *
     * @param array $data
     * @return int|null
     */
    protected function resolveCategoryId(array $data): ?int
    {
        $cliOption = $this->option('category_id');
        if ($cliOption) {
            return (int) $cliOption;
        }

        $type = $data['type'] ?? 'suv';
        $slug = 'suv';
        if ($type === 'pickup') {
            $slug = 'ban-tai';
        } elseif ($type === 'commercial') {
            $slug = 'thuong-mai';
        }

        $category = VehicleCategory::whereHas('translations', function ($q) use ($slug) {
            $q->where('slug', $slug)->where('locale', 'vi');
        })->first();

        if ($category) {
            return $category->id;
        }

        // Return first category as fallback, or log/ask
        $fallback = VehicleCategory::first();
        if ($fallback) {
            $this->warn("Category slug '{$slug}' not found. Falling back to category ID: {$fallback->id} ({$fallback->title})");
            return $fallback->id;
        }

        $this->error("No Vehicle Categories found in the database. Please seed vehicle categories first.");
        return null;
    }

    /**
     * Download an image URL using Http Client and store on the uploads disk.
     *
     * @param string|null $url
     * @param string $subDir
     * @return array|null
     */
    protected function downloadImage(?string $url, string $subDir): ?array
    {
        if (empty($url)) {
            return null;
        }

        // Safely encode the URL path to handle Vietnamese characters
        $url = $this->encodeUrlPath($url);

        try {
            $cleanUrl = strtok($url, '?');
            $filename = rawurldecode(basename($cleanUrl));
            
            // Clean filename and extension
            $ext = pathinfo($filename, PATHINFO_EXTENSION) ?: 'png';
            $name = pathinfo($filename, PATHINFO_FILENAME);
            $safeFilename = Str::slug($name) . '.' . $ext;

            $targetPath = $subDir . '/' . $safeFilename;
            $disk = Storage::disk('uploads');

            if ($disk->exists($targetPath)) {
                return ['path' => $targetPath];
            }

            // Try downloading with simple request first (Ford CDN often blocks browser-like requests from server IPs)
            $response = Http::timeout(15)->get($url);

            if ($response->failed()) {
                // Fallback: try with browser headers
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer' => 'https://www.ford.com.vn/'
                ])->timeout(15)->get($url);
            }

            if ($response->failed()) {
                $this->warn(" - Failed to download image: {$url} (Status Code: " . $response->status() . ")");
                return null;
            }

            $disk->put($targetPath, $response->body());
            return ['path' => $targetPath];

        } catch (\Throwable $e) {
            $this->warn(" - Error downloading image {$url}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Download multiple images and return array of structures.
     *
     * @param array $urls
     * @param string $subDir
     * @return array
     */
    protected function downloadImageArray(array $urls, string $subDir): array
    {
        $downloaded = [];
        foreach ($urls as $url) {
            $res = $this->downloadImage($url, $subDir);
            if ($res) {
                $downloaded[] = $res;
            }
            // Sleep for 250ms to prevent triggering WAF rate limit
            usleep(250000);
        }
        return $downloaded;
    }

    /**
     * Test the connection to Firecrawl API.
     *
     * @return int
     */
    protected function testConnection(): int
    {
        $this->info("Testing connection to Firecrawl API...");
        $apiKey = config('services.firecrawl.key') ?? env('FIRECRAWL_API_KEY', '');
        
        if (empty($apiKey)) {
            $this->error("API Key is missing in .env file.");
            return Command::FAILURE;
        }

        $this->line("API Key found: " . substr($apiKey, 0, 6) . "..." . substr($apiKey, -4));
        
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get('https://api.firecrawl.dev/v1/scrape'); // Just ping or check credentials
            
            // Scrape check returns 405 for GET generally but indicates path exists and we get parsed response
            $this->info("API is accessible. Connection status: " . $response->status());
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("Failed to connect: " . $e->getMessage());
            return Command::FAILURE;
        }
    }

    /**
     * Decode and re-encode URL path to safely handle Vietnamese/special characters.
     *
     * @param string $url
     * @return string
     */
    protected function encodeUrlPath(string $url): string
    {
        $parts = parse_url($url);
        if (!$parts) {
            return $url;
        }

        $scheme = isset($parts['scheme']) ? $parts['scheme'] . '://' : '';
        $host = $parts['host'] ?? '';
        $port = isset($parts['port']) ? ':' . $parts['port'] : '';
        $path = $parts['path'] ?? '';
        $query = isset($parts['query']) ? '?' . $parts['query'] : '';
        $fragment = isset($parts['fragment']) ? '#' . $parts['fragment'] : '';

        $pathSegments = explode('/', $path);
        $encodedSegments = array_map(function ($segment) {
            // Decode first to prevent double encoding, then rawurlencode
            return rawurlencode(rawurldecode($segment));
        }, $pathSegments);
        $encodedPath = implode('/', $encodedSegments);

        return $scheme . $host . $port . $encodedPath . $query . $fragment;
    }

    /**
     * Extract all 360-degree colorizer URLs and video URLs from the rendered page HTML.
     *
     * @param string|null $rawHtml
     * @param string $url
     * @return array
     */
    protected function extractMediaFromPage(?string $rawHtml, string $url): array
    {
        $result = [
            'urls_360' => [],
            'video_url' => null,
            'hero_video_url' => null,
        ];

        try {
            $html = $rawHtml;
            if (empty($html)) {
                $this->info("   HTML from Firecrawl is empty, attempting fallback direct HTTP request...");
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer' => 'https://www.ford.com.vn/'
                ])->timeout(15)->get($url);

                if ($response->successful()) {
                    $html = $response->body();
                }
            }

            if (empty($html)) {
                return $result;
            }

            // 1. Try to extract from coloriserThreeSixty data-imageconfig attribute (accurate AEM JSON configuration)
            if (preg_match('/data-imageconfig="([^"]+)"/i', $html, $matches) || 
                preg_match("/data-imageconfig='([^']+)'/i", $html, $matches)) {
                $jsonConfig = html_entity_decode($matches[1]);
                $configData = json_decode($jsonConfig, true);
                
                if (is_array($configData) && isset($configData['sliderContent'])) {
                    $this->info("   Found AEM coloriserThreeSixty data-imageconfig JSON. Extracting paths...");
                    $extractedPaths = [];
                    foreach ($configData['sliderContent'] as $versionKey => $frames) {
                        if (is_array($frames)) {
                            foreach ($frames as $frame) {
                                if (isset($frame['fallbackRendition']['path'])) {
                                    $extractedPaths[] = $frame['fallbackRendition']['path'];
                                }
                                if (isset($frame['renditions']) && is_array($frame['renditions'])) {
                                    foreach ($frame['renditions'] as $rend) {
                                        if (isset($rend['path'])) {
                                            $extractedPaths[] = $rend['path'];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $extractedPaths = array_values(array_unique($extractedPaths));
                    foreach ($extractedPaths as $path) {
                        $result['urls_360'][] = str_starts_with($path, '/') ? 'https://www.ford.com.vn' . $path : $path;
                    }
                }
            }

            $htmlClean = str_replace('\/', '/', $html);

            // 2. Fallback regex match for any colorizer paths if JSON extraction was empty or incomplete
            if (empty($result['urls_360'])) {
                $pattern = '/\/content\/dam\/Ford\/vn\/nameplate\/[a-zA-Z0-9_-]+\/model\/[a-zA-Z0-9_-]+\/colorizer\/360\/[^\s"\'#>]+/iu';
                if (preg_match_all($pattern, $htmlClean, $matches)) {
                    $urls = array_unique($matches[0]);
                    $result['urls_360'] = array_map(function ($path) {
                        if (str_starts_with($path, '/')) {
                            return 'https://www.ford.com.vn' . $path;
                        }
                        return $path;
                    }, $urls);
                }
            }

            // 3. Extract video URL (YouTube iframe embeds, YouTube watch links, or direct MP4 files)
            $youtubePattern = '/(https?:)?\/\/(www\.)?(youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i';
            if (preg_match($youtubePattern, $htmlClean, $videoMatches)) {
                $result['video_url'] = $videoMatches[0];
            } else {
                $mp4Pattern = '/(https?:)?\/\/[^\s"\'#>]*\/[^\s"\'#>]*\.(mp4|webm|ogv)/i';
                if (preg_match($mp4Pattern, $htmlClean, $mp4Matches)) {
                    $result['video_url'] = $mp4Matches[0];
                }
            }

            // 4. Extract direct MP4/WebM video URLs for Hero Banner Background
            $mp4Pattern = '/\/content\/dam\/Ford\/[a-zA-Z0-9_\-\/]+\.(mp4|webm)/i';
            if (preg_match_all($mp4Pattern, $htmlClean, $mp4Matches)) {
                $mp4Urls = array_unique($mp4Matches[0]);
                foreach ($mp4Urls as $mp4Path) {
                    $fullMp4Url = str_starts_with($mp4Path, '/') ? 'https://www.ford.com.vn' . $mp4Path : $mp4Path;
                    $lowerPath = strtolower($mp4Path);
                    if (str_contains($lowerPath, 'hero') || str_contains($lowerPath, 'banner') || str_contains($lowerPath, 'mustang') || str_contains($lowerPath, 'mach-e')) {
                        $result['hero_video_url'] = $fullMp4Url;
                        break;
                    }
                }
                if (empty($result['hero_video_url']) && !empty($mp4Urls)) {
                    $firstMp4 = $mp4Urls[0];
                    $result['hero_video_url'] = str_starts_with($firstMp4, '/') ? 'https://www.ford.com.vn' . $firstMp4 : $firstMp4;
                }
            }
        } catch (\Throwable $e) {
            $this->warn("Failed to extract media from page HTML: " . $e->getMessage());
        }

        return $result;
    }

    /**
     * Try to match a sequence number like -01, _01, -1, _1 at the end of the filename (excluding extension)
     *
     * @param string $url
     * @return array|null
     */
    protected function detectSequenceBaseUrl(string $url): ?array
    {
        if (preg_match('/^(.*[_-])(\d+)(\.(webp|png|jpg|jpeg))$/i', $url, $matches)) {
            return [
                'base' => $matches[1],
                'start' => (int)$matches[2],
                'padding' => strlen($matches[2]),
                'ext' => $matches[3],
            ];
        }
        return null;
    }

    /**
     * Guess potential 360 image URL candidates using standard Ford VN naming conventions.
     *
     * @param string $vehicleSlug
     * @param string $colorName
     * @param array $versionNames
     * @return array
     */
    protected function guess360UrlCandidates(string $vehicleSlug, string $colorName, array $versionNames): array
    {
        $nameplate = str_replace('ford-', '', $vehicleSlug);
        $colorVn = mb_strtolower(trim($colorName));
        $colorVnSlug = Str::slug($colorVn);
        
        $colorMap = [
            'đen' => ['absolute-black', 'black', 'shadow-black', 'den'],
            'đen bóng' => ['shadow-black', 'absolute-black', 'black', 'den-bong', 'den'],
            'đen huyền bí' => ['absolute-black', 'shadow-black', 'black', 'den-huyen-bi'],
            'đen tuyệt đối' => ['absolute-black', 'shadow-black', 'black', 'den-tuyet-doi', 'den'],
            'trắng' => ['snowflake-white', 'oxford-white', 'white', 'trang'],
            'trắng tuyết' => ['snowflake-white', 'snowflake', 'trang-tuyet'],
            'trắng ánh sao' => ['star-white', 'snowflake-white', 'white', 'trang-anh-sao'],
            'trắng ngọc trai' => ['snowflake-white-pearl', 'white-pearl', 'trang-ngoc-trai'],
            'trắng kim cương' => ['snowflake-white', 'oxford-white', 'white', 'trang-kim-cuong'],
            'trắng bạch kim' => ['snowflake-white-pearl', 'white-pearl', 'trang-bach-kim'],
            'xám' => ['meteor-grey', 'meteor-gray', 'grey', 'gray', 'xam'],
            'xám meteor' => ['meteor-grey', 'meteor-gray', 'xam-meteor'],
            'xám ánh trăng' => ['meteor-grey', 'meteor-gray', 'xam-anh-trang'],
            'bạc' => ['aluminum-metallic', 'silver', 'bac'],
            'bạc alumi' => ['aluminum-metallic', 'aluminum', 'bac-alumi'],
            'bạc tinh thể' => ['aluminum-metallic', 'silver', 'bac-tinh-the'],
            'bạc space' => ['space-white-metallic', 'space-white', 'space', 'aluminum-metallic', 'silver', 'bac-space'],
            'xanh' => ['lightning-blue', 'blue', 'lucid-blue', 'xanh'],
            'xanh dương' => ['grabber-blue-metallic', 'grabber-blue', 'blue', 'xanh-duong'],
            'xanh mãnh liệt' => ['eruption-green-metallic', 'eruption-green', 'green', 'xanh-manh-liet'],
            'xanh biển sâu' => ['lightning-blue', 'blue', 'xanh-bien-sau'],
            'đỏ' => ['sunset-orange', 'rapid-red', 'red', 'do'],
            'đỏ thể thao' => ['molten-magenta', 'rapid-red', 'red', 'do-the-thao'],
            'đỏ cam' => ['sunset-orange', 'do-cam'],
            'đỏ hỏa tinh' => ['sunset-orange', 'rapid-red', 'red', 'do-hoa-tinh'],
            'nâu' => ['equator-bronze', 'bronze', 'nau'],
            'nâu equator' => ['equator-bronze', 'nau-equator'],
            'vàng' => ['luxe-yellow', 'yellow', 'vang'],
            'vàng luxe' => ['luxe-yellow', 'vang-luxe'],
        ];

        $colorEnCandidates = $colorMap[$colorVn] ?? [$colorVnSlug];

        $candidates = [];
        $versions = !empty($versionNames) ? $versionNames : ['standard'];

        foreach ($versions as $vName) {
            $vSlug = Str::slug($vName);
            $vClean = str_replace([$vehicleSlug . '-', 'ford-'], '', $vSlug);

            $vCleanVariations = [$vClean];
            if (str_contains($vClean, 'awd')) {
                $vCleanVariations = [
                    str_replace('awd', '4wd', $vClean),
                    $vClean,
                    str_replace('awd', '2wd', $vClean),
                    str_replace('-awd', '', $vClean)
                ];
            }

            foreach ($vCleanVariations as $vVar) {
                foreach ($colorEnCandidates as $colorEn) {
                    $colorVnFolders = array_unique([str_replace(' ', '-', $colorVn), $colorVnSlug, $colorVn]);
                    
                    foreach ($colorVnFolders as $colorFolder) {
                        foreach (['models', 'model'] as $modelFolder) {
                            $candidates[] = "https://www.ford.com.vn/content/dam/Ford/vn/nameplate/{$nameplate}/{$modelFolder}/{$vVar}/colorizer/360/{$colorFolder}/vn-{$vVar}-{$colorEn}-01.webp";
                            $candidates[] = "https://www.ford.com.vn/content/dam/Ford/vn/nameplate/{$nameplate}/{$modelFolder}/{$vVar}/colorizer/360/{$colorFolder}/vn-{$colorEn}-01.webp";
                            $candidates[] = "https://www.ford.com.vn/content/dam/Ford/vn/nameplate/{$nameplate}/{$modelFolder}/{$vVar}/colorizer/360/{$colorFolder}/{$colorEn}-01.webp";
                        }
                    }
                }
            }
        }

        $candidates = array_values(array_unique($candidates));

        // Sequential check to prevent triggering WAF block
        $checkedCount = 0;
        foreach ($candidates as $candidate) {
            $encodedCandidate = $this->encodeUrlPath($candidate);
            $checkedCount++;
            
            // Limit checks to top 15 candidates to keep execution fast
            if ($checkedCount > 15) {
                break;
            }

            try {
                $response = Http::withHeaders([
                    'Referer' => 'https://www.ford.com.vn/'
                ])->timeout(3)->get($encodedCandidate);

                if ($response->status() === 200) {
                    $this->info("   Found working 360 candidate: {$candidate}");
                    return [$candidate];
                }

                if ($response->status() === 403) {
                    $this->warn("   Akamai WAF 403 Forbidden detected. Bypassing check and trusting candidate: {$candidate}");
                    return [$candidate];
                }
            } catch (\Throwable $e) {
                // Continue on timeout or connection error
            }
        }

        // Return the first candidate as fallback if all failed or checked
        if (!empty($candidates)) {
            $this->warn("   No candidate returned 200. Defaulting to first candidate: " . $candidates[0]);
            return [$candidates[0]];
        }

        return [];
    }

    /**
     * Parse vehicle data fields from local HTML file source.
     *
     * @param string $html
     * @param string $url
     * @return array
     */
    protected function parseVehicleFromHtml(string $html, string $url): array
    {
        $vehicleSlug = basename(rtrim($url, '/'));
        $slug = str_replace('ford-', '', $vehicleSlug);
        
        // 1. Extract Title
        $title = '';
        if (preg_match('/data-title="([^"]+)"/iu', $html, $matches)) {
            $title = trim($matches[1]);
        } elseif (preg_match('/<title>([^<|]+)(?:\||-)/iu', $html, $matches)) {
            $title = trim($matches[1]);
        } else {
            $title = Str::title(str_replace('-', ' ', $vehicleSlug));
        }

        // 2. Extract Tagline
        $tagline = '';
        if (preg_match('/<p[^>]*class="[^"]*heading3-medium[^"]*"[^>]*>\s*<span[^>]*>([^<]+)<\/span>\s*<\/p>/iu', $html, $matches)) {
            $tagline = trim($matches[1]);
        } elseif (preg_match('/<div[^>]*class="[^"]*title-medium-skyview[^"]*"[^>]*>([^<]+)<\/div>/iu', $html, $matches)) {
            $tagline = trim($matches[1]);
        } elseif (preg_match('/<p[^>]*class="[^"]*body1-medium[^"]*"[^>]*>\s*<span[^>]*>([^<]+)<\/span>\s*<\/p>/iu', $html, $matches)) {
            $tagline = trim($matches[1]);
        }

        // 3. Extract Description
        $description = "Dòng xe {$title} mới nhất tại Long Khánh Ford. Liên hệ hotline để nhận ưu đãi tốt nhất.";
        if (preg_match('/<p[^>]*class="[^"]*body1-regular-black[^"]*"[^>]*>([^<]+)<\/p>/iu', $html, $matches)) {
            $description = trim($matches[1]);
        } elseif (preg_match('/<p[^>]*class="[^"]*body3-regular-black[^"]*"[^>]*>([^<]+)<\/p>/iu', $html, $matches)) {
            $description = trim($matches[1]);
        }

        // 4. Extract Type
        $type = 'suv';
        $lowerUrl = strtolower($url);
        if (str_contains($lowerUrl, '/trucks/') || str_contains($lowerUrl, '/ranger/') || str_contains($lowerUrl, '/pickup/')) {
            $type = 'pickup';
        } elseif (str_contains($lowerUrl, '/commercial/') || str_contains($lowerUrl, '/transit/')) {
            $type = 'commercial';
        }

        // 5. Extract Main Image
        $mainImage = null;
        if (preg_match('/src="([^"]+?\/billboards\/[^"]+?)"/iu', $html, $matches)) {
            $mainImage = $matches[1];
        } elseif (preg_match('/src="([^"]+?\/overview\/[^"]+?)"/iu', $html, $matches)) {
            $mainImage = $matches[1];
        } elseif (preg_match('/src="([^"]+?\/content\/dam\/Ford\/[^"]+?)"/iu', $html, $matches)) {
            $mainImage = $matches[1];
        }
        if ($mainImage && str_starts_with($mainImage, '/')) {
            $mainImage = 'https://www.ford.com.vn' . $mainImage;
        }

        // 6. Extract Gallery Images
        $galleryImages = [];
        if (preg_match_all('/src="([^"]+?\/content\/dam\/Ford\/[^"]+?)"/iu', $html, $matches)) {
            $allImages = array_unique($matches[1]);
            foreach ($allImages as $img) {
                $lowerImg = strtolower($img);
                if (str_contains($lowerImg, '/logo') || str_contains($lowerImg, '/icon') || str_contains($lowerImg, '/360/') || str_contains($lowerImg, '/colorizer/')) {
                    continue;
                }
                $galleryImages[] = str_starts_with($img, '/') ? 'https://www.ford.com.vn' . $img : $img;
            }
        }
        $galleryImages = array_slice(array_unique($galleryImages), 0, 10);

        // 7. Extract Versions & Specs/Prices
        $versions = [];
        if (preg_match_all('/<div class="brandcard-item[^>]*>.*?<a href="([^"]+)" class="brandcard-image.*?<div class="brandcard-desc-title[^>]*>\s*<p>([^<]+)<\/p>.*?<div class="brandcard-desc">\s*<p>([^<]+)<\/p>/is', $html, $brandMatches, PREG_SET_ORDER)) {
            foreach ($brandMatches as $match) {
                $href = $match[1];
                $vName = trim($match[2]);
                $vDesc = trim($match[3]);
                
                if (str_contains($href, '/models/') || str_contains($href, '/showroom/')) {
                    $vImage = null;
                    if (preg_match('/src="([^"]+)"/iu', $match[0], $imgMatch)) {
                        $vImage = str_starts_with($imgMatch[1], '/') ? 'https://www.ford.com.vn' . $imgMatch[1] : $imgMatch[1];
                    }
                    
                    $versions[] = [
                        'name' => $vName,
                        'image_url' => $vImage,
                        'description' => $vDesc,
                        'price' => 0,
                        'specs' => [],
                        'href' => $href
                    ];
                }
            }
        }

        if (empty($versions)) {
            $versions[] = [
                'name' => $title,
                'price' => 0,
                'specs' => []
            ];
        }

        // Parse Prices
        $foundPrices = [];
        if (preg_match_all('/([0-9]{1,3}(?:[.,][0-9]{3}){2,3})\s*(?:VNĐ|VND)/iu', $html, $allPriceMatches)) {
            $foundPrices = array_unique(array_map(function($p) {
                return (int)str_replace([',', '.'], '', $p);
            }, $allPriceMatches[1]));
        }
        rsort($foundPrices);

        foreach ($versions as &$version) {
            $versionName = $version['name'];
            $versionClean = strtolower(preg_replace('/\s+/', '', $versionName));
            
            $lines = explode("\n", $html);
            foreach ($lines as $line) {
                $lineClean = strtolower(preg_replace('/\s+/', '', $line));
                if (str_contains($lineClean, $versionClean) || str_contains($lineClean, str_replace('-', '', $versionClean))) {
                    if (preg_match('/([0-9]{1,3}(?:[.,][0-9]{3}){2,3})\s*(?:VNĐ|VND)/iu', $line, $linePriceMatches)) {
                        $version['price'] = (int)str_replace([',', '.'], '', $linePriceMatches[1]);
                        break;
                    }
                }
            }
            
            if ($version['price'] === 0 && !empty($foundPrices)) {
                if (count($versions) === 1) {
                    $version['price'] = $foundPrices[0];
                }
            }
        }
        foreach ($versions as &$version) {
            if (!empty($version['href'])) {
                $versionUrl = $version['href'];
                if (str_starts_with($versionUrl, '/')) {
                    $versionUrl = 'https://www.ford.com.vn' . $versionUrl;
                }
                
                $this->info("   Downloading version page: {$versionUrl}");
                try {
                    $response = Http::withHeaders([
                        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Referer' => 'https://www.ford.com.vn/'
                    ])->timeout(10)->get($versionUrl);
                    
                    if ($response->successful()) {
                        $vHtml = $response->body();
                        $version['specs'] = array_merge($version['specs'] ?? [], $this->parseVersionSpecsFromHtml($vHtml));
                        $this->info("   ✓ Parsed specs from version page: " . json_encode($version['specs'], JSON_UNESCAPED_UNICODE));
                    }
                } catch (\Throwable $e) {
                    $this->warn("   ⚠ Failed to download version page: " . $e->getMessage());
                }
            }
            
            // Fallback default specs for Mustang Mach-E if empty or failed
            $vehicleSlug = Str::slug($title);
            if (empty($version['specs']) && (str_contains(strtolower($vehicleSlug), 'mustang-mach-e') || str_contains(strtolower($title), 'mustang-mach-e') || str_contains(strtolower($version['name']), 'premium-awd'))) {
                $version['specs'] = [
                    'engine' => 'Thuần điện (EV)',
                    'power_torque' => '395PS / 676Nm',
                    'power' => '395 Ps',
                    'torque' => '676 Nm',
                    'range' => '550 km',
                    'battery' => '87 kWh',
                    'drivetrain' => 'Dẫn động 4 bánh (AWD)',
                    'transmission' => 'Tự động đơn cấp',
                    'charging' => 'CCS2',
                    'energy_consumption' => '193 Wh/km'
                ];
                $this->info("   ✓ Applied fallback specs for Mustang Mach-E version.");
            }
        }
        unset($version);

        $basePrice = 0;
        $pricesList = array_filter(array_column($versions, 'price'));
        if (!empty($pricesList)) {
            $basePrice = min($pricesList);
        } elseif (!empty($foundPrices)) {
            $basePrice = min($foundPrices);
        }

        // 8. Parse Colors & 360 images from data-imageconfig JSON
        $colors = [];
        if (preg_match('/data-imageconfig="([^"]+)"/i', $html, $matches) || 
            preg_match("/data-imageconfig='([^']+)'/i", $html, $matches)) {
            $jsonConfig = html_entity_decode($matches[1]);
            $configData = json_decode($jsonConfig, true);
            
            if (is_array($configData) && isset($configData['sliderContent'])) {
                $colorsFromConfig = [];
                $extracted360Paths = [];
                
                $traverseArray = function($arr) use (&$traverseArray, &$extracted360Paths) {
                    foreach ($arr as $k => $v) {
                        if (is_array($v)) {
                            $traverseArray($v);
                        } elseif (is_string($v)) {
                            if (str_contains($v, '/360/') || str_contains($v, '/colorizer/')) {
                                $extracted360Paths[] = $v;
                            }
                        }
                    }
                };
                $traverseArray($configData);
                $extracted360Paths = array_values(array_unique($extracted360Paths));

                foreach ($extracted360Paths as $path) {
                    if (preg_match('/\/360\/([^\/]+)\//iu', $path, $colorMatches)) {
                        $colorFolder = urldecode($colorMatches[1]);
                        $colorKey = strtolower($colorFolder);
                        
                        if (!isset($colorsFromConfig[$colorKey])) {
                            $words = explode('-', $colorFolder);
                            $formattedWords = array_map(function($word) {
                                return mb_convert_case($word, MB_CASE_TITLE, "UTF-8");
                            }, $words);
                            $colorName = implode(' ', $formattedWords);
                            
                            $colorsFromConfig[$colorKey] = [
                                'name' => $colorName,
                                'hex' => '#cccccc',
                                'image_url' => str_starts_with($path, '/') ? 'https://www.ford.com.vn' . $path : $path,
                                'versions' => [],
                                'images_360' => [],
                                'images_360_internal' => []
                            ];
                        }
                        
                        // Map version slug back to version name
                        if (preg_match('/\/models?\/([^\/]+)\//iu', $path, $verMatches)) {
                            $verSlug = $verMatches[1];
                            $matchedVersionName = null;
                            foreach ($versions as $ver) {
                                $vSlug = Str::slug($ver['name']);
                                $vClean = str_replace(['ford-', $slug . '-'], '', $vSlug);
                                $vCleanNoDrivetrain = str_replace(['-awd', '-2wd', '-4wd', '-4x4', '-4x2', '-rwd', '-fwd'], '', $vClean);
                                $verSlugClean = str_replace(['-awd', '-2wd', '-4wd', '-4x4', '-4x2', '-rwd', '-fwd'], '', $verSlug);
                                
                                if (str_contains($vClean, $verSlug) || str_contains($verSlug, $vClean) || 
                                    str_contains($vCleanNoDrivetrain, $verSlugClean) || str_contains($verSlugClean, $vCleanNoDrivetrain)) {
                                    $matchedVersionName = $ver['name'];
                                    break;
                                }
                            }
                            
                            if ($matchedVersionName && !in_array($matchedVersionName, $colorsFromConfig[$colorKey]['versions'])) {
                                $colorsFromConfig[$colorKey]['versions'][] = $matchedVersionName;
                            }
                        }
                    }
                }
                $colors = array_values($colorsFromConfig);
            }
        }

        if (empty($colors)) {
            $fallbackColorsMap = [
                'ford-mustang-mach-e' => [
                    ['name' => 'Trắng Ánh Sao', 'hex' => '#ffffff'],
                    ['name' => 'Đỏ Thể Thao', 'hex' => '#c2185b'],
                    ['name' => 'Đen Huyền Bí', 'hex' => '#000000'],
                    ['name' => 'Xanh Mãnh Liệt', 'hex' => '#4d6542']
                ],
                'ford-territory' => [
                    ['name' => 'Trắng Kim Cương', 'hex' => '#ffffff'],
                    ['name' => 'Đỏ Hỏa Tinh', 'hex' => '#b71c1c'],
                    ['name' => 'Xám Ánh Trăng', 'hex' => '#757575'],
                    ['name' => 'Xanh Biển Sâu', 'hex' => '#006064'],
                    ['name' => 'Đen Tuyệt Đối', 'hex' => '#000000']
                ],
                'ford-everest' => [
                    ['name' => 'Trắng Tuyết', 'hex' => '#ffffff'],
                    ['name' => 'Đỏ Cam', 'hex' => '#d84315'],
                    ['name' => 'Xám Meteor', 'hex' => '#4e342e'],
                    ['name' => 'Đen Tuyệt Đối', 'hex' => '#000000'],
                    ['name' => 'Bạc Alumi', 'hex' => '#bdbdbd'],
                    ['name' => 'Vàng Luxe', 'hex' => '#fbc02d'],
                    ['name' => 'Xanh Dương', 'hex' => '#1565c0']
                ],
                'ford-explorer' => [
                    ['name' => 'Đen Bóng', 'hex' => '#000000'],
                    ['name' => 'Xanh Atlas', 'hex' => '#0d47a1'],
                    ['name' => 'Đỏ', 'hex' => '#c62828'],
                    ['name' => 'Trắng', 'hex' => '#ffffff']
                ],
                'ford-ranger' => [
                    ['name' => 'Cam Code Orange', 'hex' => '#e65100'],
                    ['name' => 'Xám Meteor', 'hex' => '#424242'],
                    ['name' => 'Đen Tuyệt Đối', 'hex' => '#000000'],
                    ['name' => 'Trắng Bạch Kim', 'hex' => '#f5f5f5'],
                    ['name' => 'Bạc Alumi', 'hex' => '#9e9e9e'],
                    ['name' => 'Xanh Dương', 'hex' => '#0d47a1']
                ],
                'ford-ranger-raptor' => [
                    ['name' => 'Cam Code Orange', 'hex' => '#e65100'],
                    ['name' => 'Xám Meteor', 'hex' => '#424242'],
                    ['name' => 'Đen Tuyệt Đối', 'hex' => '#000000'],
                    ['name' => 'Trắng Bạch Kim', 'hex' => '#f5f5f5'],
                    ['name' => 'Xanh Dương', 'hex' => '#0d47a1']
                ],
                'ford-transit' => [
                    ['name' => 'Bạc Tinh Thể', 'hex' => '#cccccc'],
                    ['name' => 'Trắng Kim Cương', 'hex' => '#ffffff']
                ]
            ];

            $modelSlug = strtolower(trim($vehicleSlug));
            if (isset($fallbackColorsMap[$modelSlug])) {
                foreach ($fallbackColorsMap[$modelSlug] as $fallbackColor) {
                    $colors[] = [
                        'name' => $fallbackColor['name'],
                        'hex' => $fallbackColor['hex'],
                        'image_url' => $mainImage,
                        'versions' => array_column($versions, 'name')
                    ];
                }
            } else {
                $colors[] = [
                    'name' => 'Trắng Tuyết',
                    'hex' => '#ffffff',
                    'image_url' => $mainImage,
                    'versions' => array_column($versions, 'name')
                ];
            }
        }

        // 9. Parse actual features from showroom HTML using DOMXPath
        $features = [];
        try {
            $dom = new \DOMDocument();
            libxml_use_internal_errors(true);
            $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
            libxml_clear_errors();
            $xpath = new \DOMXPath($dom);

            $imgNodes = $xpath->query('//img[contains(@src, "/column-splitter/") or contains(@src, "/overview/") or contains(@src, "/features/")]');
            foreach ($imgNodes as $imgNode) {
                $imgSrc = $imgNode->getAttribute('src');
                if (empty($imgSrc)) continue;
                if (str_starts_with($imgSrc, '/')) {
                    $imgSrc = 'https://www.ford.com.vn' . $imgSrc;
                }
                
                // Skip mobile images and models/news/jellybean/logo images
                if (str_contains($imgSrc, '-mobile') || str_contains($imgSrc, '/mobile/') || $imgNode->getAttribute('class') === 'imgmobile') {
                    continue;
                }
                $lowerSrc = strtolower($imgSrc);
                if (str_contains($lowerSrc, '/logo') || str_contains($lowerSrc, '/icon') || str_contains($lowerSrc, 'jellybean') || str_contains($lowerSrc, '/models/') || str_contains($lowerSrc, 'tin-tuc')) {
                    continue;
                }

                $titleText = '';
                $descText = '';
                
                // Traversal up parent chain to find a container that has sibling richtext
                $sibling = null;
                $p = $imgNode->parentNode;
                $depth = 0;
                while ($p && $p->nodeName !== 'body' && $depth < 5) {
                    $divs = $xpath->query('.//div[contains(@class, "richtext") or contains(@class, "cmp-richtext")]', $p);
                    if ($divs->length > 0) {
                        $sibling = $divs->item(0);
                        break;
                    }
                    $p = $p->parentNode;
                    $depth++;
                }
                
                if ($sibling) {
                    // Try to isolate onlydesktop to prevent mobile/desktop duplicate extraction
                    $targetContainer = $sibling;
                    $desktopDivs = $xpath->query('.//div[contains(@class, "onlydesktop")]', $sibling);
                    if ($desktopDivs->length > 0) {
                        $targetContainer = $desktopDivs->item(0);
                    }

                    // Extract Title text
                    $hNodes = $xpath->query('.//h1|.//h2|.//h3|.//div[contains(@class, "medium")]|.//div[contains(@class, "bold")]|.//span[contains(@class, "medium")]', $targetContainer);
                    $titles = [];
                    foreach ($hNodes as $hNode) {
                        $titles[] = trim(preg_replace('/\s+/', ' ', $hNode->textContent));
                    }
                    $titleText = implode(' ', array_filter(array_unique($titles)));
                    
                    // Extract Description text
                    $pNodes = $xpath->query('.//p|.//div[contains(@class, "regular")]|.//div[contains(@class, "light")]|.//span[contains(@class, "regular")]', $targetContainer);
                    $descs = [];
                    foreach ($pNodes as $pNode) {
                        $txt = trim(preg_replace('/\s+/', ' ', $pNode->textContent));
                        if (!empty($txt) && !in_array($txt, $titles)) {
                            $descs[] = $txt;
                        }
                    }
                    $descText = implode(" | ", array_filter(array_unique($descs)));

                    // Clean up call-to-actions text from descriptions
                    $descText = preg_replace('/Tìm hiểu thêm|Bắt đầu mua xe|Tải Catalog|Tìm hiểu/i', '', $descText);
                    $descText = trim(preg_replace('/\s*\|\s*\|\s*/', ' | ', $descText), " | \t\n\r\0\x0B");
                }
                
                if (!empty($titleText) || !empty($descText)) {
                    $features[] = [
                        'image' => $imgSrc,
                        'title' => $titleText,
                        'description' => $descText
                    ];
                }
            }
        } catch (\Throwable $e) {
            // Silence DOM errors
        }

        // De-duplicate features by image URL
        $uniqueFeatures = [];
        $seenImages = [];
        foreach ($features as $feat) {
            if (!in_array($feat['image'], $seenImages)) {
                $seenImages[] = $feat['image'];
                $uniqueFeatures[] = $feat;
            }
        }
        $features = array_slice($uniqueFeatures, 0, 8); // Keep up to 8 key features
        $this->info("   Extracted " . count($features) . " actual features/sections from page HTML.");


        return [
            'title' => $title,
            'tagline' => $tagline,
            'description' => $description,
            'base_price' => $basePrice,
            'type' => $type,
            'main_image' => $mainImage,
            'gallery_images' => $galleryImages,
            'versions' => $versions,
            'colors' => $colors,
            'accessories' => [],
            'features' => $features
        ];
    }

    /**
     * Parse technical specifications comparison table from HTML page.
     *
     * @param string $html
     * @return array
     */
    protected function parseCompareSpecsFromHtml(string $html): array
    {
        $result = ['versions' => []];
        
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
        libxml_clear_errors();
        
        $xpath = new \DOMXPath($dom);
        
        $tables = $xpath->query('//table');
        if ($tables->length === 0) {
            return $result;
        }
        
        $table = $tables->item(0);
        $rows = $xpath->query('.//tr', $table);
        if ($rows->length === 0) {
            return $result;
        }
        
        $headerRow = $rows->item(0);
        $headers = $xpath->query('.//th|.//td', $headerRow);
        
        $versionColumns = [];
        for ($i = 1; $i < $headers->length; $i++) {
            $name = trim($headers->item($i)->textContent);
            if (!empty($name)) {
                $versionColumns[$i] = [
                    'name' => $name,
                    'detailed_specs' => []
                ];
            }
        }
        
        $currentCategory = 'Thông số cơ bản';
        for ($r = 1; $r < $rows->length; $r++) {
            $row = $rows->item($r);
            $cells = $xpath->query('.//td|.//th', $row);
            if ($cells->length === 0) continue;
            
            $firstCell = $cells->item(0);
            $colspan = $firstCell->getAttribute('colspan');
            
            if ($colspan && (int)$colspan >= 2) {
                $currentCategory = trim($firstCell->textContent);
                continue;
            }
            
            $specName = trim($firstCell->textContent);
            if (empty($specName)) continue;
            
            for ($c = 1; $c < $cells->length; $c++) {
                if (isset($versionColumns[$c])) {
                    $specValue = trim($cells->item($c)->textContent);
                    
                    $categoryFound = false;
                    foreach ($versionColumns[$c]['detailed_specs'] as &$catGroup) {
                        if ($catGroup['category'] === $currentCategory) {
                            $catGroup['items'][] = [
                                'name' => $specName,
                                'value' => $specValue
                            ];
                            $categoryFound = true;
                            break;
                        }
                    }
                    if (!$categoryFound) {
                        $versionColumns[$c]['detailed_specs'][] = [
                            'category' => $currentCategory,
                            'items' => [
                                [
                                    'name' => $specName,
                                    'value' => $specValue
                                ]
                            ]
                        ];
                    }
                }
            }
        }
        
        $result['versions'] = array_values($versionColumns);
        return $result;
    }

    /**
     * Generate 360 exterior images by shifting color of another downloaded color.
     *
     * @param array $existingColors
     * @param string $vehicleSlug
     * @param string $destColorSlug
     * @param string $targetColorType
     * @return array
     */
    protected function generateColorShifted360(array $existingColors, string $vehicleSlug, string $destColorSlug, string $targetColorType): array
    {
        $sourceColor = null;
        foreach ($existingColors as $c) {
            if (!empty($c['images_360']) && count($c['images_360']) === 36) {
                $sourceColor = $c;
                if (str_contains(mb_strtolower($c['name']), 'đỏ') || str_contains(mb_strtolower($c['name']), 'đỏ thể thao')) {
                    break;
                }
            }
        }

        if (!$sourceColor) {
            $this->warn("   Cannot find a source color with 36 images to shift.");
            return [];
        }

        $this->info("   Using {$sourceColor['name']} as the source for color shifting.");
        $disk = Storage::disk('uploads');
        $destImages = [];

        foreach ($sourceColor['images_360'] as $imgData) {
            $srcPath = $imgData['path'];
            $srcFullPath = $disk->path($srcPath);

            if (!file_exists($srcFullPath)) {
                continue;
            }

            $filename = basename($srcPath);
            if ($targetColorType === 'green') {
                $destFilename = str_replace(
                    ['molten-magenta', 'rapid-red', 'red', 'do-the-thao', 'do'],
                    ['grabber-green', 'grabber-green', 'green', 'xanh-manh-liet', 'xanh'],
                    $filename
                );
            } else {
                $destFilename = str_replace(
                    ['molten-magenta', 'rapid-red', 'red', 'do-the-thao', 'do'],
                    ['grabber-blue', 'grabber-blue', 'blue', 'xanh-manh-liet', 'xanh'],
                    $filename
                );
            }

            $destSubPath = "vehicles/360/{$vehicleSlug}/{$destColorSlug}/exterior/{$destFilename}";
            $destFullPath = $disk->path($destSubPath);

            if (!file_exists(dirname($destFullPath))) {
                @mkdir(dirname($destFullPath), 0755, true);
            }

            $success = $this->shiftImageHue($srcFullPath, $destFullPath, $targetColorType);
            if ($success) {
                $destImages[] = ['path' => $destSubPath];
            }
        }

        $this->info("   Generated " . count($destImages) . " color-shifted images.");
        return $destImages;
    }

    /**
     * Shifts color hue of an image.
     */
    protected function shiftImageHue(string $srcPath, string $destPath, string $targetColorType): bool
    {
        try {
            $img = @imagecreatefromwebp($srcPath);
            if (!$img) {
                $img = @imagecreatefrompng($srcPath);
            }
            if (!$img) {
                $img = @imagecreatefromjpeg($srcPath);
            }
            if (!$img) {
                return false;
            }

            $width = imagesx($img);
            $height = imagesy($img);

            for ($x = 0; $x < $width; $x++) {
                for ($y = 0; $y < $height; $y++) {
                    $rgb = imagecolorat($img, $x, $y);
                    $r = ($rgb >> 16) & 0xFF;
                    $g = ($rgb >> 8) & 0xFF;
                    $b = $rgb & 0xFF;
                    $a = ($rgb >> 24) & 0x7F;

                    list($h, $s, $l) = $this->rgbToHsl($r, $g, $b);

                    if ($targetColorType === 'blue') {
                        // reddish/magenta
                        if (($h >= 300 || $h <= 25) && $s > 15) {
                            $newH = $h - 120;
                            if ($newH < 0) {
                                $newH += 360;
                            }
                            $newS = min(100, $s * 1.1);
                            list($newR, $newG, $newB) = $this->hslToRgb($newH, $newS, $l);
                            $color = imagecolorallocatealpha($img, $newR, $newG, $newB, $a);
                            imagesetpixel($img, $x, $y, $color);
                        }
                    } elseif ($targetColorType === 'green') {
                        // reddish/magenta
                        if (($h >= 300 || $h <= 25) && $s > 15) {
                            $newH = ($h + 120) % 360;
                            $newS = min(100, $s * 0.55);
                            $newL = min(100, $l * 0.82);
                            list($newR, $newG, $newB) = $this->hslToRgb($newH, $newS, $newL);
                            $color = imagecolorallocatealpha($img, $newR, $newG, $newB, $a);
                            imagesetpixel($img, $x, $y, $color);
                        }
                    }
                }
            }

            imagewebp($img, $destPath, 85);
            imagedestroy($img);
            return true;
        } catch (\Throwable $e) {
            return false;
        }
    }

    protected function rgbToHsl(int $r, int $g, int $b): array
    {
        $r /= 255; $g /= 255; $b /= 255;
        $max = max($r, $g, $b);
        $min = min($r, $g, $b);
        $l = ($max + $min) / 2;
        if ($max == $min) {
            $h = $s = 0;
        } else {
            $d = $max - $min;
            $s = $l > 0.5 ? $d / (2 - $max - $min) : $d / ($max + $min);
            switch ($max) {
                case $r: $h = ($g - $b) / $d + ($g < $b ? 6 : 0); break;
                case $g: $h = ($b - $r) / $d + 2; break;
                case $b: $h = ($r - $g) / $d + 4; break;
            }
            $h /= 6;
        }
        return [$h * 360, $s * 100, $l * 100];
    }

    protected function hslToRgb(float $h, float $s, float $l): array
    {
        $h /= 360; $s /= 100; $l /= 100;
        if ($s == 0) {
            $r = $g = $b = $l;
        } else {
            $q = $l < 0.5 ? $l * (1 + $s) : $l + $s - $l * $s;
            $p = 2 * $l - $q;
            $r = $this->hueToRgb($p, $q, $h + 1/3);
            $g = $this->hueToRgb($p, $q, $h);
            $b = $this->hueToRgb($p, $q, $h - 1/3);
        }
        return [(int)round($r * 255), (int)round($g * 255), (int)round($b * 255)];
    }

    protected function hueToRgb(float $p, float $q, float $t): float
    {
        if ($t < 0) $t += 1;
        if ($t > 1) $t -= 1;
        if ($t < 1/6) return $p + ($q - $p) * 6 * $t;
        if ($t < 1/2) return $q;
        if ($t < 2/3) return $p + ($q - $p) * (2/3 - $t) * 6;
        return $p;
    }

    /**
     * Parse features list from features HTML page.
     *
     * @param string $html
     * @return array
     */
    protected function parseFeaturesFromHtml(string $html): array
    {
        $features = [];
        try {
            $dom = new \DOMDocument();
            libxml_use_internal_errors(true);
            $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
            libxml_clear_errors();
            $xpath = new \DOMXPath($dom);

            $cardNodes = $xpath->query('//div[contains(@class, "brandcard-item")]');
            foreach ($cardNodes as $cardNode) {
                // Skip cards with links containing /models/
                $linkNodes = $xpath->query('.//a[contains(@href, "/models/")]', $cardNode);
                if ($linkNodes->length > 0) {
                    continue;
                }

                // Extract Title
                $titleText = '';
                $titleNodes = $xpath->query('.//div[contains(@class, "brandcard-desc-title")]//h3|.//div[contains(@class, "brandcard-desc-title")]//p|.//h3', $cardNode);
                if ($titleNodes->length > 0) {
                    $titleText = trim(preg_replace('/\s+/', ' ', $titleNodes->item(0)->textContent));
                }

                // Extract Description
                $descText = '';
                $descNodes = $xpath->query('.//div[@class="brandcard-desc"]//p|.//div[@class="brandcard-desc"]', $cardNode);
                if ($descNodes->length > 0) {
                    $descText = trim(preg_replace('/\s+/', ' ', $descNodes->item(0)->textContent));
                }

                // Extract Image
                $imgSrc = '';
                $imgNodes = $xpath->query('.//img', $cardNode);
                foreach ($imgNodes as $imgNode) {
                    $src = $imgNode->getAttribute('src');
                    if (!empty($src)) {
                        $imgSrc = $src;
                        if ($imgNode->getAttribute('class') === 'dsktoponly') {
                            break;
                        }
                    }
                }

                if (empty($titleText) || empty($descText)) {
                    continue;
                }

                if (str_starts_with($imgSrc, '/')) {
                    $imgSrc = 'https://www.ford.com.vn' . $imgSrc;
                }

                $features[] = [
                    'image' => $imgSrc,
                    'title' => $titleText,
                    'description' => $descText
                ];
            }
        } catch (\Throwable $e) {
            // Silence DOM errors
        }

        // Deduplicate
        $uniqueFeatures = [];
        $seenTitles = [];
        foreach ($features as $feat) {
            $titleKey = strtolower(trim($feat['title']));
            if (!in_array($titleKey, $seenTitles)) {
                $seenTitles[] = $titleKey;
                $uniqueFeatures[] = $feat;
            }
        }

        return $uniqueFeatures;
    }

    protected function parseVersionSpecsFromHtml(string $html): array
    {
        $specs = [];
        
        try {
            $dom = new \DOMDocument();
            libxml_use_internal_errors(true);
            $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
            libxml_clear_errors();
            $xpath = new \DOMXPath($dom);

            // 1. Tìm Công suất & Mô men xoắn tối đa (ví dụ: "395PS / 676Nm")
            $powerTorqueNode = $xpath->query('//div[contains(@class, "heading1-medium") or contains(@class, "title-medium")][contains(text(), "PS") and contains(text(), "Nm")]');
            if ($powerTorqueNode->length > 0) {
                $specs['power_torque'] = trim($powerTorqueNode->item(0)->textContent);
            } else {
                if (preg_match('/([0-9]+PS\s*\/\s*[0-9]+Nm)/iu', $html, $matches)) {
                    $specs['power_torque'] = trim($matches[1]);
                }
            }

            // 2. Tìm khoảng cách/quãng đường vận hành
            $rangeNode = $xpath->query('//div[contains(@class, "heading1-medium") or contains(@class, "title-medium")][contains(text(), "km") or contains(text(), "Km")]');
            if ($rangeNode->length > 0) {
                $specs['range'] = trim($rangeNode->item(0)->textContent);
            } else {
                if (preg_match('/(?:Quãng đường vận hành|Khoảng cách vận hành|Khoảng cách)[^0-9]*([0-9]+\s*k?m)/iu', $html, $matches)) {
                    $specs['range'] = trim($matches[1]);
                } elseif (preg_match('/([0-9]+)\s*km\b/iu', $html, $matches)) {
                    $specs['range'] = $matches[1] . ' km';
                }
            }

            // 3. Tìm các chi tiết khác trong list/bảng
            $listItems = $xpath->query('//li');
            foreach ($listItems as $item) {
                $text = trim($item->textContent);
                if (empty($text)) continue;

                if (preg_match('/Công suất cực đại:\s*([^\n\r]+)/iu', $text, $m)) {
                    $specs['power'] = trim($m[1]);
                } elseif (preg_match('/Mô men xoắn cực đại:\s*([^\n\r]+)/iu', $text, $m)) {
                    $specs['torque'] = trim($m[1]);
                } elseif (preg_match('/Dung lượng pin:\s*([^\n\r]+)/iu', $text, $m)) {
                    $specs['battery'] = trim($m[1]);
                } elseif (preg_match('/Mức tiêu thụ năng lượng\s*([^\n\r]+)/iu', $text, $m)) {
                    $specs['energy_consumption'] = trim($m[1]);
                } elseif (preg_match('/Chuẩn sạc\s*([^\n\r]+)/iu', $text, $m)) {
                    $specs['charging'] = trim($m[1]);
                } elseif (preg_match('/(Dẫn động\s*[0-9A-Za-z\s]+)/iu', $text, $m)) {
                    $specs['drivetrain'] = trim($m[1]);
                }
            }

            // Fallbacks bằng Regex nếu DOM query bị lọt
            if (empty($specs['power']) && preg_match('/Công suất cực đại:\s*([0-9]+\s*(?:Ps|kW|HP|công suất))/iu', $html, $m)) {
                $specs['power'] = trim($m[1]);
            }
            if (empty($specs['torque']) && preg_match('/Mô men xoắn cực đại:\s*([0-9]+\s*Nm)/iu', $html, $m)) {
                $specs['torque'] = trim($m[1]);
            }
            if (empty($specs['battery']) && preg_match('/Dung lượng pin:\s*([0-9]+\s*kWh)/iu', $html, $m)) {
                $specs['battery'] = trim($m[1]);
            }
            if (empty($specs['drivetrain']) && preg_match('/(Dẫn động 4 bánh|Dẫn động cầu sau|Dẫn động cầu trước|AWD|RWD|FWD)/iu', $html, $m)) {
                $specs['drivetrain'] = trim($m[1]);
            }
            if (empty($specs['charging']) && preg_match('/Chuẩn sạc\s*([A-Z0-9]+)/iu', $html, $m)) {
                $specs['charging'] = trim($m[1]);
            }
            if (empty($specs['energy_consumption']) && preg_match('/Mức tiêu thụ năng lượng\s*([0-9]+\s*Wh\/km)/iu', $html, $m)) {
                $specs['energy_consumption'] = trim($m[1]);
            }

            // Thiết lập giá trị mặc định cho xe điện
            $specs['engine'] = $specs['engine'] ?? 'Thuần điện (EV)';
            $specs['transmission'] = $specs['transmission'] ?? 'Tự động đơn cấp';

        } catch (\Throwable $e) {
            // Silence
        }

        return $specs;
    }
}

