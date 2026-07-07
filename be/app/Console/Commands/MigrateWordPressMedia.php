<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class MigrateWordPressMedia extends Command
{
    protected $signature = 'migrate:wordpress-media
        {--xml=ngnaiford.WordPress.2026-07-04.xml : The XML file name in the project root}';

    protected $description = 'Parse WordPress XML export file and download all media uploads to local storage';

    public function handle()
    {
        ini_set('memory_limit', '512M');
        
        $xmlFile = $this->option('xml');
        $xmlPath = base_path($xmlFile);

        if (!file_exists($xmlPath)) {
            $this->error("XML file not found at: {$xmlPath}");
            return Command::FAILURE;
        }

        $this->info("Parsing XML file: {$xmlPath}...");
        $content = file_get_contents($xmlPath);

        // Regex to match any uploads from the old domain
        $pattern = '/https?:\/\/dongnaiford\.com\.vn\/wp-content\/uploads\/[^"\'>\s\]\)]+\.(?:png|jpg|jpeg|gif|webp|svg|pdf|docx|xlsx|doc|xls|ppt|pptx|zip|rar|mp3|mp4)/i';
        
        if (!preg_match_all($pattern, $content, $matches)) {
            $this->error("No media URLs found in the XML file.");
            return Command::FAILURE;
        }

        $urls = array_unique($matches[0]);
        $total = count($urls);
        $this->info("Found {$total} unique media URLs to process.");

        $downloaded = 0;
        $skipped = 0;
        $failed = 0;

        $this->output->progressStart($total);

        foreach ($urls as $url) {
            // Extract the path parts after wp-content/uploads/
            $pathParts = explode('/wp-content/uploads/', $url);
            if (!isset($pathParts[1])) {
                $failed++;
                $this->output->progressAdvance();
                continue;
            }

            $relativePath = 'uploads/posts/' . $pathParts[1];
            // Decode URL characters (e.g. %20 to space)
            $relativePath = urldecode($relativePath);
            
            // Full local path in storage/app/public/
            $localPath = storage_path('app/public/' . $relativePath);

            // Check if file already exists
            if (file_exists($localPath) && filesize($localPath) > 0) {
                $skipped++;
                $this->output->progressAdvance();
                continue;
            }

            // Download the file
            try {
                // Ensure parent directory exists
                $dir = dirname($localPath);
                if (!file_exists($dir)) {
                    mkdir($dir, 0755, true);
                }

                // Download using Http client with a timeout and stream directly to disk (sink)
                $response = Http::withOptions([
                    'sink' => $localPath,
                    'verify' => false,
                    'connect_timeout' => 5,
                    'timeout' => 15,
                ])->get($url);

                if ($response->successful() && file_exists($localPath) && filesize($localPath) > 0) {
                    $downloaded++;
                } else {
                    if (file_exists($localPath)) {
                        @unlink($localPath);
                    }
                    $failed++;
                }
            } catch (\Exception $e) {
                if (file_exists($localPath)) {
                    @unlink($localPath);
                }
                $failed++;
            }

            // Free memory periodically
            unset($response);
            gc_collect_cycles();

            $this->output->progressAdvance();
        }

        $this->output->progressFinish();

        $this->info("═══════════════════════════════════════════════════════");
        $this->info("Media sync completed!");
        $this->info("Downloaded new: {$downloaded}");
        $this->info("Skipped (already exists): {$skipped}");
        $this->info("Failed to download: {$failed}");
        $this->info("Files saved to: " . storage_path('app/public/uploads/posts/'));
        $this->info("═══════════════════════════════════════════════════════");

        return Command::SUCCESS;
    }
}
