<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('landing_pages', 'telegram_chat_id')) {
            Schema::table('landing_pages', function (Blueprint $table) {
                $table->string('telegram_chat_id')->nullable()->after('sales_email');
            });
        }

        if (Schema::hasTable('settings')) {
            \Illuminate\Support\Facades\DB::table('settings')->updateOrInsert(
                ['group' => 'telegram', 'name' => 'telegram_enabled'],
                ['val' => '1', 'updated_at' => now(), 'created_at' => now()]
            );
            \Illuminate\Support\Facades\DB::table('settings')->updateOrInsert(
                ['group' => 'telegram', 'name' => 'telegram_bot_token'],
                ['val' => '8971593281:AAEfA2pEnzn9ZlwcU1MISb2we-EiLGJ0ofg', 'updated_at' => now(), 'created_at' => now()]
            );
        }
    }

    public function down()
    {
        if (Schema::hasColumn('landing_pages', 'telegram_chat_id')) {
            Schema::table('landing_pages', function (Blueprint $table) {
                $table->dropColumn('telegram_chat_id');
            });
        }
    }
};
