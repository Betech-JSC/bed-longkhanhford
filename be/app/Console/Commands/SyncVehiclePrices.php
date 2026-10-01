<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleVersion;
use App\Models\Vehicle\VehicleCategory;
use Illuminate\Support\Facades\DB;

class SyncVehiclePrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vehicles:sync-prices {--dry-run : Simulate the synchronization without modifying database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Safely synchronize vehicle master prices, categories, and versions in the CMS database without data loss';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = (bool) $this->option('dry-run');

        if ($isDryRun) {
            $this->warn('🔍 RUNNING IN DRY-RUN MODE: No database changes will be committed.');
        } else {
            $this->info('🚀 Starting vehicle master price & category synchronization (LIVE MODE)...');
        }

        if (!$isDryRun) {
            DB::beginTransaction();
        }

        try {
            // 1. Find or verify Pickup category
            $catPickup = VehicleCategory::whereHas('translations', function ($q) {
                $q->where('slug', 'ban-tai')->orWhere('slug', 'pickup');
            })->first();

            if (!$catPickup) {
                $catPickup = VehicleCategory::whereHas('translations', function ($q) {
                    $q->where('title', 'LIKE', '%Bán tải%')->orWhere('title', 'LIKE', '%Pickup%');
                })->first();
            }

            if ($catPickup) {
                $this->line("   ℹ Found Pickup category: ID {$catPickup->id}");
            } else {
                if ($isDryRun) {
                    $this->line("   [DRY-RUN] Would create missing VehicleCategory: Bán tải (slug: 'ban-tai', en: 'Pickup', slug: 'pickup')");
                } else {
                    $catPickup = new VehicleCategory(['status' => 'ACTIVE', 'sort_order' => 2]);
                    $catPickup->fill([
                        'vi' => ['title' => 'Bán tải', 'slug' => 'ban-tai'],
                        'en' => ['title' => 'Pickup', 'slug' => 'pickup'],
                    ]);
                    $catPickup->save();
                    $this->info("   ✓ Created missing Pickup category (ID: {$catPickup->id})");
                }
            }

            // 2. Define master price datasets
            $datasets = [
                'territory' => [
                    'slugs' => ['ford-territory', 'territory'],
                    'name' => 'Ford Territory',
                    'type' => 'suv',
                    'base_price' => 739000000,
                    'category_slug' => 'suv',
                    'versions' => [
                        [
                            'target_id' => 1,
                            'name' => 'Territory Titanium X 1.5L AT',
                            'price' => 954000000,
                            'matches' => ['Titanium X', 'Titanium-X', '954', '875']
                        ],
                        [
                            'target_id' => null,
                            'name' => 'Territory Sport 1.5L AT',
                            'price' => 909000000,
                            'matches' => ['Sport', '909']
                        ],
                        [
                            'target_id' => 23,
                            'name' => 'Territory Titanium 1.5L AT',
                            'price' => 899000000,
                            'matches' => ['Titanium', '899', '819']
                        ],
                        [
                            'target_id' => 30,
                            'name' => 'Territory Trend 1.5L AT',
                            'price' => 739000000,
                            'matches' => ['Trend', '739']
                        ],
                    ]
                ],
                'ranger' => [
                    'slugs' => ['ford-ranger', 'ranger'],
                    'name' => 'Ford Ranger',
                    'type' => 'pickup',
                    'base_price' => 669000000,
                    'category_slug' => 'ban-tai',
                    'versions' => [
                        [
                            'target_id' => 36,
                            'name' => 'Ranger Wildtrak 2.0L Bi-Turbo 10AT 4x4',
                            'price' => 979000000,
                            'matches' => ['Wildtrak', '979', '949', '948']
                        ],
                        [
                            'target_id' => 24,
                            'name' => 'Ranger Stormtrak 2.0L Bi-Turbo 10AT 4x4',
                            'price' => 1039000000,
                            'matches' => ['Stormtrak', '1039']
                        ],
                        [
                            'target_id' => 9,
                            'name' => 'Ranger Raptor 2.0L Bi-Turbo 10AT 4x4',
                            'price' => 1299000000,
                            'matches' => ['Raptor', '1299', '1448']
                        ],
                        [
                            'target_id' => 26,
                            'name' => 'Ranger Sport 2.0L 4x4 6AT',
                            'price' => 864000000,
                            'matches' => ['Ranger Sport', 'Sport 2.0L', '864']
                        ],
                        [
                            'target_id' => 28,
                            'name' => 'Ranger XLS 2.0L 4x4 6AT',
                            'price' => 779000000,
                            'matches' => ['XLS 4x4', 'XLS 2.0L 4x4', '779', '776']
                        ],
                        [
                            'target_id' => 27,
                            'name' => 'Ranger XLS 2.0L 4x2 6AT',
                            'price' => 707000000,
                            'matches' => ['XLS 4x2', 'XLS 2.0L 4x2', '707']
                        ],
                        [
                            'target_id' => 29,
                            'name' => 'Ranger XL 2.0L 4x4 6MT',
                            'price' => 669000000,
                            'matches' => ['Ranger XL', 'XL 2.0L', '6MT', '669']
                        ],
                    ]
                ],
                'everest' => [
                    'slugs' => ['ford-everest', 'everest'],
                    'name' => 'Ford Everest',
                    'type' => 'suv',
                    'base_price' => 1099000000,
                    'category_slug' => 'suv',
                    'versions' => [
                        [
                            'target_id' => 4,
                            'name' => 'Everest Wildtrak 2.0L AT 4x4',
                            'price' => 1540000000,
                            'matches' => ['Wildtrak', 'Platinum+', '1540', '1629']
                        ],
                        [
                            'target_id' => 34,
                            'name' => 'Everest Titanium+ 2.0L AT 4x4',
                            'price' => 1468000000,
                            'matches' => ['Titanium+ 4x4', 'Platinum 4x4', 'Titanium+ 2.0L', '1468', '1440']
                        ],
                        [
                            'target_id' => 5,
                            'name' => 'Everest Titanium 2.0L AT 4x2',
                            'price' => 1399000000,
                            'matches' => ['Titanium 4x2', 'Platinum 4x2', 'Titanium 2.0L', '1399', '1335']
                        ],
                        [
                            'target_id' => 31,
                            'name' => 'Everest Sport 2.0L AT 4x2',
                            'price' => 1178000000,
                            'matches' => ['Everest Sport', 'Sport 2.0L', '1178', '1209']
                        ],
                        [
                            'target_id' => 32,
                            'name' => 'Everest Ambiente 2.0L AT 4x2',
                            'price' => 1099000000,
                            'matches' => ['Ambiente', 'Active', '1099', '1129']
                        ],
                    ]
                ],
            ];

            // 3. Process each master vehicle dataset
            foreach ($datasets as $key => $data) {
                $this->info("🚗 Processing {$data['name']}...");

                // Find vehicle by slug or title
                $vehicle = Vehicle::whereHas('translations', function ($q) use ($data) {
                    $q->whereIn('slug', $data['slugs'])
                      ->orWhereIn('seo_slug', $data['slugs']);
                })->first();

                if (!$vehicle) {
                    $vehicle = Vehicle::whereHas('translations', function ($q) use ($data) {
                        $q->where('title', 'LIKE', "%{$data['name']}%");
                    })->first();
                }

                if (!$vehicle) {
                    $this->warn("   ⚠️ Vehicle {$data['name']} not found in database. Skipping.");
                    continue;
                }

                // Update Vehicle base price & type
                $formattedBasePrice = number_format($data['base_price']);
                if ($isDryRun) {
                    $this->line("   [DRY-RUN] Would update Vehicle ID {$vehicle->id} ({$data['name']}): type = '{$data['type']}', base_price = {$formattedBasePrice} VNĐ, status = 'ACTIVE'");
                } else {
                    Vehicle::where('id', $vehicle->id)->update([
                        'type' => $data['type'],
                        'base_price' => $data['base_price'],
                        'status' => Vehicle::STATUS_ACTIVE,
                    ]);
                    $this->line("   [APPLIED] Updated Vehicle ID {$vehicle->id}: base_price -> {$formattedBasePrice} VNĐ, type -> '{$data['type']}', status -> ACTIVE");
                }

                // Attach Pickup category for Ranger if needed
                if ($key === 'ranger') {
                    if ($catPickup) {
                        if ($isDryRun) {
                            $this->line("   [DRY-RUN] Would attach Pickup category (ID: {$catPickup->id}) to Ranger (ID: {$vehicle->id})");
                        } else {
                            $vehicle->categories()->syncWithoutDetaching([$catPickup->id]);
                            $this->line("   [APPLIED] Attached Pickup category (ID: {$catPickup->id}) to Ranger");
                        }
                    } elseif ($isDryRun) {
                        $this->line("   [DRY-RUN] Would attach Pickup category to Ranger (ID: {$vehicle->id})");
                    }
                }

                // Track matched version IDs to avoid duplicate mapping
                $usedVersionIds = [];

                // Sync versions
                foreach ($data['versions'] as $sortOrder => $verData) {
                    $verName = $verData['name'];
                    $verPrice = $verData['price'];
                    $formattedPrice = number_format($verPrice);
                    $version = null;

                    // 1. Try finding version by explicit target_id
                    if (!empty($verData['target_id'])) {
                        $vById = VehicleVersion::find($verData['target_id']);
                        if ($vById && !in_array($vById->id, $usedVersionIds, true)) {
                            if ($vById->vehicle_id === $vehicle->id) {
                                $version = $vById;
                            } else {
                                // Reassign legacy or misplaced version (e.g. Raptor ID 9) to this master vehicle
                                if ($isDryRun) {
                                    $this->line("   [DRY-RUN] Would reassign Version ID {$vById->id} from vehicle #{$vById->vehicle_id} to vehicle #{$vehicle->id} ({$data['name']})");
                                } else {
                                    $vById->update(['vehicle_id' => $vehicle->id]);
                                    $this->line("   [APPLIED] Reassigned Version ID {$vById->id} from vehicle #{$vById->vehicle_id} to vehicle #{$vehicle->id} ({$data['name']})");
                                }
                                $version = $vById;
                            }
                        }
                    }

                    // 2. Try finding version by exact name
                    if (!$version) {
                        $version = VehicleVersion::where('vehicle_id', $vehicle->id)
                            ->whereNotIn('id', $usedVersionIds)
                            ->whereHas('translations', function ($q) use ($verName) {
                                $q->where('name', $verName);
                            })->first();
                    }

                    // 3. Try finding by matching keywords
                    if (!$version && !empty($verData['matches'])) {
                        foreach ($verData['matches'] as $matchKeyword) {
                            $version = VehicleVersion::where('vehicle_id', $vehicle->id)
                                ->whereNotIn('id', $usedVersionIds)
                                ->whereHas('translations', function ($q) use ($matchKeyword) {
                                    $q->where('name', 'LIKE', "%{$matchKeyword}%");
                                })->first();
                            if ($version) {
                                break;
                            }
                        }
                    }

                    if ($version) {
                        $usedVersionIds[] = $version->id;
                        $oldPriceFormatted = number_format((float)$version->price);

                        if ($isDryRun) {
                            $this->line("   [DRY-RUN] Would update Version ID {$version->id} ({$verName}): price {$oldPriceFormatted} -> {$formattedPrice} VNĐ, status -> ACTIVE");
                        } else {
                            $version->update([
                                'price' => $verPrice,
                                'status' => VehicleVersion::STATUS_ACTIVE,
                                'sort_order' => $sortOrder + 1,
                            ]);
                            $version->fill(['vi' => ['name' => $verName]]);
                            $version->save();
                            $this->line("   [APPLIED] Updated Version ID {$version->id} ({$verName}): {$formattedPrice} VNĐ (was {$oldPriceFormatted} VNĐ)");
                        }
                    } else {
                        if ($isDryRun) {
                            $this->line("   [DRY-RUN] Would create new Version for {$data['name']}: {$verName} -> {$formattedPrice} VNĐ");
                        } else {
                            $newVersion = new VehicleVersion([
                                'vehicle_id' => $vehicle->id,
                                'price' => $verPrice,
                                'status' => VehicleVersion::STATUS_ACTIVE,
                                'sort_order' => $sortOrder + 1,
                            ]);
                            $newVersion->fill(['vi' => ['name' => $verName]]);
                            $newVersion->save();
                            $usedVersionIds[] = $newVersion->id;
                            $this->line("   [APPLIED] Created new Version ID {$newVersion->id}: {$verName} -> {$formattedPrice} VNĐ");
                        }
                    }
                }
            }

            // 4. Sweep and purge any remaining legacy 948tr / 949tr prices across all versions
            $this->info("🧹 Sweeping all legacy 948.000.000 & 949.000.000 VNĐ prices across all versions...");
            $legacyVersions = VehicleVersion::whereIn('price', [948000000, 949000000])->get();
            if ($legacyVersions->isEmpty()) {
                $this->line("   ✓ No remaining versions found with price 948tr or 949tr.");
            } else {
                foreach ($legacyVersions as $lv) {
                    $vTitle = $lv->name ?? "Version #{$lv->id}";
                    $oldPrice = number_format((float)$lv->price);
                    if ($isDryRun) {
                        $this->line("   [DRY-RUN] Would update legacy price for Version ID {$lv->id} ({$vTitle}): {$oldPrice} -> 979.000.000 VNĐ");
                    } else {
                        $lv->update(['price' => 979000000]);
                        $this->line("   [APPLIED] Purged legacy price for Version ID {$lv->id} ({$vTitle}): {$oldPrice} -> 979.000.000 VNĐ");
                    }
                }
            }

            // 5. Handle version ID 42 specifically (Ranger Wildtrak legacy under ranger-2026)
            $ver42 = VehicleVersion::find(42);
            if ($ver42) {
                if ($isDryRun) {
                    $this->line("   [DRY-RUN] Would update Version ID 42: price -> 979.000.000 VNĐ, status -> INACTIVE");
                } else {
                    $ver42->update([
                        'price' => 979000000,
                        'status' => VehicleVersion::STATUS_INACTIVE,
                    ]);
                    $this->line("   [APPLIED] Updated Version ID 42: price -> 979.000.000 VNĐ, status -> INACTIVE");
                }
            }

            // 6. Deactivate duplicate / model-year legacy vehicles
            $this->info("🔒 Deactivating duplicate / model-year legacy vehicles...");
            $inactiveSlugs = ['ranger-2026', 'ranger-raptor-2026', 'ford-territory-2026'];
            $legacyVehicles = Vehicle::whereHas('translations', function ($q) use ($inactiveSlugs) {
                $q->whereIn('slug', $inactiveSlugs)
                  ->orWhereIn('seo_slug', $inactiveSlugs);
            })->get();

            if ($legacyVehicles->isEmpty()) {
                $this->line("   ℹ No vehicles found matching legacy slugs: " . implode(', ', $inactiveSlugs));
            } else {
                foreach ($legacyVehicles as $lv) {
                    $slugs = $lv->translations->pluck('slug')->filter()->implode(', ');
                    if ($isDryRun) {
                        $this->line("   [DRY-RUN] Would set status = 'INACTIVE' for vehicle ID {$lv->id} (Slugs: {$slugs})");
                        $verCount = $lv->versions()->count();
                        if ($verCount > 0) {
                            $this->line("   [DRY-RUN] Would set status = 'INACTIVE' for {$verCount} version(s) under vehicle ID {$lv->id}");
                        }
                    } else {
                        $lv->update(['status' => Vehicle::STATUS_INACTIVE]);
                        $lv->versions()->update(['status' => VehicleVersion::STATUS_INACTIVE]);
                        $this->line("   [APPLIED] Deactivated vehicle ID {$lv->id} (Slugs: {$slugs}) and its versions");
                    }
                }
            }

            if (!$isDryRun) {
                DB::commit();
                $this->info('🎉 [APPLIED] Vehicle master prices, categories, and versions successfully synchronized in DB!');
            } else {
                $this->info('✨ [DRY-RUN] Simulation completed successfully. No data was altered.');
            }

            return Command::SUCCESS;
        } catch (\Throwable $e) {
            if (!$isDryRun) {
                DB::rollBack();
            }
            $this->error('❌ Synchronization failed: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
