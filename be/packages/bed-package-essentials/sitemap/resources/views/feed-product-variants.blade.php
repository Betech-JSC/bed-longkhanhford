@php
    $appUrl = env('APP_URL');
    $appName = env('APP_NAME');
    $url = url()->current();
    $metaPage = cache_response('/', fn() => MetaPage::where('url', '/')->first(), 'meta_pages');

    $title = $metaPage?->seo_meta_title ?? $appName;
    $description = $metaPage?->seo_meta_description ?? $appName;
@endphp
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>Sản phẩm</title>
        <link>{{ $appUrl }}</link>
        <description>{{ $description }}</description>
        @foreach ($items as $product)
            @foreach ($product['variants'] as $variant)
                <item>
                    <g:id>{{ $variant['sku'] }}</g:id>
                    <g:title>{{ $product['title'] . ' ' . $variant['title'] }}</g:title>
                    <g:description>
                        {{ strip_tags(html_entity_decode($product['description'])) }}
                    </g:description>
                    <g:link>{{ head($product['url']) . '?id=' . $variant['id'] }}</g:link>
                    <g:image_link>{{ $variant['image']['url'] ?? $product['image']['url'] ?? null }}</g:image_link>
                    <g:availability>còn hàng</g:availability>
                    <g:price>{{ $variant['price'] }} VND</g:price>
                    <g:condition>mới</g:condition>
                </item>
            @endforeach
        @endforeach
    </channel>
</rss>
