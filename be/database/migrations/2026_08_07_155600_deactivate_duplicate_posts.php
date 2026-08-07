<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Post\PostTranslation;
use App\Models\Post\Post;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $duplicateSlugs = [
            'ra-mat-ford-everest-sport-phien-ban-dac-biet-voi-gia-1199-ty-tai-thi-truong-viet-nam1' => 'ra-mat-ford-everest-sport-phien-ban-dac-biet-voi-gia-1199-ty-tai-thi-truong-viet-nam',
            'uu-dai-lai-suat-0-trong-4-thang1' => 'uu-dai-lai-suat-0-trong-4-thang',
            'uu-dai-lai-suat-0-trong-4-thang12' => 'uu-dai-lai-suat-0-trong-4-thang'
        ];

        foreach ($duplicateSlugs as $oldSlug => $newSlug) {
            // Deactivate duplicate post
            $trans = PostTranslation::where('slug', $oldSlug)->first();
            if ($trans && $trans->post_id) {
                Post::where('id', $trans->post_id)->update([
                    'status' => Post::STATUS_INACTIVE
                ]);
            }

            // Create 301 redirect rule
            $oldUrl = 'tin-tuc/' . $oldSlug;
            $newUrl = 'tin-tuc/' . $newSlug;

            DB::table('redirects')->updateOrInsert(
                ['old_url' => $oldUrl],
                [
                    'new_url' => $newUrl,
                    'status_code' => 301,
                    'is_active' => 1,
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Not necessary to revert data updates
    }
};
