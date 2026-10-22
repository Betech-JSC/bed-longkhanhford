<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        try {
            if (Schema::hasTable('settings')) {
                $smtp = \DB::table('settings')->where('group', 'smtp')->pluck('val', 'name');
                $mailConfig = array_filter([
                    'mail.from.name' => $smtp['mail_from_name'] ?? null,
                    'mail.from.address' => $smtp['mail_from_address'] ?? null,
                    'mail.mailers.smtp.host' => $smtp['mail_host'] ?? null,
                    'mail.mailers.smtp.port' => $smtp['mail_port'] ?? null,
                    'mail.mailers.smtp.encryption' => $smtp['mail_encryption'] ?? null,
                    'mail.mailers.smtp.username' => $smtp['mail_username'] ?? null,
                    'mail.mailers.smtp.password' => $smtp['mail_password'] ?? null,
                ], fn($v) => $v !== null && $v !== '');

                if (!empty($mailConfig['mail.mailers.smtp.host']) && !empty($mailConfig['mail.mailers.smtp.username'])) {
                    $mailConfig['mail.default'] = 'smtp';
                }
                if (!empty($mailConfig)) {
                    config($mailConfig);
                }
            }
        } catch (\Throwable $e) {
            // Fail silently when database is not ready
        }
    }

    public function boot()
    {
        try {
            \DB::connection()->getDoctrineSchemaManager()
                ->getDatabasePlatform()
                ->registerDoctrineTypeMapping('enum', 'string');
        } catch (\Throwable $e) {
        }
    }
}
