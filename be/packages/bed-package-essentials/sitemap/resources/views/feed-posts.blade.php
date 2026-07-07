@php
    $appUrl = env('APP_URL');
    $appName = env('APP_NAME');
    $url = url()->current();
    $metaPage = cache_response('/', fn() => MetaPage::where('url', '/')->first(), 'meta_pages');

    $title = $metaPage?->seo_meta_title ?? $appName;
    $description = $metaPage?->seo_meta_description ?? $appName;
@endphp

<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0" xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
        <title>{{ $title }}</title>
        <link>{{ $appUrl }}</link>
        <description>{{ $description }}</description>
        <atom:link href="{{ $url }}" rel="self" type="application/rss+xml" />

        @foreach ($items as $item)
            <item>
                <title>{{ utf8_for_xml($item['title']) }}</title>
                <description>{{ utf8_for_xml($item['description']) }}</description>
                <link>{{ $item['url'] }}</link>
                <guid>{{ $item['url'] }}</guid>
                <pubDate>{{ date('D, d M Y H:i:s O', strtotime($item['published_at'])) }}</pubDate>
            </item>
        @endforeach
    </channel>
</rss>
