<?php

namespace JamstackVietnam\Translation\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Amirami\Localizator\Services\Parser;
use Amirami\Localizator\Services\FileFinder;
use Amirami\Localizator\Services\Localizator;
use JamstackVietnam\Core\Traits\HasCrudActions;
use JamstackVietnam\Translation\Models\Translation;
use Illuminate\Support\Facades\Artisan;

class TranslationController extends Controller
{
    use HasCrudActions;
    public $model = Translation::class;

    private function folder()
    {
        return "@Core/" . Str::studly($this->getTable());
    }

    public function beforeIndex($query)
    {
        return $query->groupBy('key');
    }

    private function table()
    {
        $this->scanFromView();
        $items = $this->model::query()
            ->get()
            ->groupBy('key')
            ->map(function ($value, $key) {
                return [
                    'key' => $key,
                    'translations' => $value->keyBy('locale')->map(fn ($translation) => $translation->value)
                ];
            })->values();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->only('key', 'locale', 'value');

        $item = Translation::where('locale', $data['locale'])
            ->whereRaw('BINARY `key` = ?', [$data['key']])
            ->first();

        if (!empty($item->id)) {
            $item->value = $data['value'];
            $item->save();
        } else {
            Translation::updateOrCreateData($data);
        }

        $this->storeToJson();
        $this->buildFrontendAssets();

        return response()->json($item);
    }


    public function scanFromView()
    {
        $localizator = new Localizator;

        $config = config();
        $file = new FileFinder($config);
        $parser = new Parser($config, $file);
        $parser->parseKeys();

        $translations = collect();
        $locale = config('app.locale');

        foreach ($this->getTypes() as $type) {
            $translations = $translations->concat($localizator->collect(
                $parser->getKeys($locale, $type),
                $type,
                $locale,
                true
            ));
        }

        $storedTranslations = Translation::pluck('key')
            ->map(fn ($key) => Translation::encodeEmail($key));

        $diff = $translations->map(fn ($item) => Translation::encodeEmail(trim($item)))
            ->diff($storedTranslations);

        $unusedTranslations = $storedTranslations->diff($translations)->values();
        // Translation::whereIn('key', $diff->values())->delete();

        if ($diff->count()) {
            foreach ($diff as $item) {
                $item = Translation::decodeEmail($item);
                $data = [
                    'key' => $item,
                    'value' => $item,
                    'locale' => $locale
                ];

                Translation::updateOrCreateData($data);
            }
        }
    }

    public function storeToJson()
    {
        $translations = Translation::get()->groupBy('key');
        $appLocales = config('app.locales');
        $defaultLocale = config('app.locale');

        $locales = [];
        foreach ($appLocales as $locale) {
            $locales[$locale] = [];
            foreach ($translations as $key => $translation) {
                $translateLocale = $translation->firstWhere('locale', $locale)?->value;
                $translateDefaultLocale = $translation->firstWhere('locale', $defaultLocale)?->value;

                $locales[$locale][Translation::encodeEmail($key)] = Translation::encodeEmail($translateLocale) ?? Translation::encodeEmail($translateDefaultLocale);
            }
        }

        foreach ($locales as $locale => $value) {
            $jsonLocales = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;

            file_put_contents(public_path("build/locales/$locale.json"), $jsonLocales);
        }
    }

    public function buildFrontendAssets()
    {
        shell_exec('yarn frontend:build');
    }

    protected function getLocales(): array
    {
        return $this->argument('lang')
            ? explode(',', $this->argument('lang'))
            : [config('app.locale')];
    }

    protected function getTypes(): array
    {
        return array_keys(array_filter(config('localizator.localize')));
    }
}
