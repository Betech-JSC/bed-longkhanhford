<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\RoleSeeder;

class SyncPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically scan all registered admin routes and sync new permissions into database without running full seeders.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Scanning admin routes and syncing permissions to database...');

        RoleSeeder::createPermissions();

        $this->info('Permissions successfully synchronized with database!');

        return Command::SUCCESS;
    }
}
