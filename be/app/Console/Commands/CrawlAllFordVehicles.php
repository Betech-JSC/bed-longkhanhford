<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CrawlAllFordVehicles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vehicle:crawl-all-ford';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crawl all major Ford vehicle models from ford.com.vn';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info("=== Starting Crawl All Ford Vehicles ===");
        
        $urls = [
            'https://www.ford.com.vn/showroom/suvs/ford-territory/',
            'https://www.ford.com.vn/showroom/suvs/ford-everest/',
            'https://www.ford.com.vn/showroom/suvs/ford-explorer/',
            'https://www.ford.com.vn/showroom/trucks/ford-ranger/',
            'https://www.ford.com.vn/showroom/trucks/ford-ranger-raptor/',
            'https://www.ford.com.vn/showroom/commercial/ford-transit/',
            'https://www.ford.com.vn/showroom/electric/ford-mustang-mach-e/'
        ];

        foreach ($urls as $index => $url) {
            $this->info("");
            $this->info("--------------------------------------------------");
            $this->info("[" . ($index + 1) . "/" . count($urls) . "] Processing: {$url}");
            $this->info("--------------------------------------------------");

            $slug = basename(rtrim($url, '/'));
            $htmlFile = "/tmp/{$slug}.html";
            $compareHtmlFile = "/tmp/{$slug}-compare.html";

            $params = [
                'url' => $url
            ];

            if (file_exists($htmlFile)) {
                $params['--html-file'] = $htmlFile;
                $this->info("✓ Offline HTML file detected: {$htmlFile}");
            }
            if (file_exists($compareHtmlFile)) {
                $params['--compare-html-file'] = $compareHtmlFile;
                $this->info("✓ Offline Compare HTML file detected: {$compareHtmlFile}");
            }

            try {
                $status = $this->call('vehicle:crawl-ford', $params);
                
                if ($status === self::SUCCESS) {
                    $this->info("✓ Successfully synced {$url}");
                } else {
                    $this->warn("⚠ Failed to sync {$url}");
                }
            } catch (\Throwable $e) {
                $this->error("Exception occurred while crawling {$url}: " . $e->getMessage());
            }
        }

        $this->info("");
        $this->info("=== Finished Crawl All Ford Vehicles ===");
        return self::SUCCESS;
    }
}
