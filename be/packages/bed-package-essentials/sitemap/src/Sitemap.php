<?php

namespace JamstackVietnam\Sitemap;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;

class Sitemap
{
    public array $tags = [];

    const CHANGE_FREQUENCY_DAILY = 'daily';
    const PRIORITY = 0.8;

    public static function create(): static
    {
        return new static();
    }

    public function addStaticRoutes(): static
    {
        foreach (Route::getRoutes() as $route) {
            if ($route->getName() === 'dynamic-redirect') continue;

            if (isset($route->getAction()['middleware']) && $route->methods()[0] == 'GET') {
                $middleware = $route->getAction()['middleware'];
                $uri = $route->uri;
                if (is_array($middleware)) {
                    if (
                        in_array('frontend', $middleware) &&
                        !str_contains($uri, '{') &&
                        !str_contains($uri, '}') &&
                        $uri !== 'sitemap.xml' &&
                        $uri !== '/'
                    ) {
                        $this->add(url($uri));
                    }
                }
            }
        }

        return $this;
    }

    public function add(string | iterable | Model $tag, $name = null): static
    {
        if (is_iterable($tag)) {
            foreach ($tag as $item) {
                $this->add($item);
            }

            return $this;
        }

        if (is_string($tag)) {
            $tag = $this->createUrl($tag, $name);
        }

        if (!is_array($tag)) {
            $tag = $this->transformUrl($tag);
        }

        if (!in_array($tag, $this->tags)) {
            if (is_array($tag) && count($tag) && is_array(head($tag))) {
                $this->tags = array_merge($this->tags, $tag);
            } else {
                $this->tags[] = $tag;
            }
        }

        return $this;
    }

    public function render()
    {
        $items = collect($this->tags)
            ->whereNotNull('url')
            ->unique('url')
            ->filter()
            ->sortBy('priority')
            ->sortBy('url');

        return response()
            ->view('sitemap::sitemap', ['items' => $items])
            ->header('Content-Type', 'text/xml');
    }

    private function transformUrl($item)
    {
        if (is_array($item->url)) {
            $urls = [];
            foreach ($item->url as $url) {
                $newItem = (object) $item->toArray();
                $newItem->url = $url;
                $urls[] = $this->transformUrl($newItem);
            }
            return $urls;
        } else {
            return [
                'url' => $item->url,
                'lastModificationDate' => Carbon::create($item->created_at)->toAtomString(),
                'changeFrequency' => self::CHANGE_FREQUENCY_DAILY,
                'priority' => $item->priority ?? self::PRIORITY,
            ];
        }
    }

    private function createUrl(string $url, $name = null)
    {
        return [
            'url' => $url,
            'name' => $name,
            'lastModificationDate' => now()->toAtomString(),
            'changeFrequency' => self::CHANGE_FREQUENCY_DAILY,
            'priority' => self::PRIORITY
        ];
    }
}
