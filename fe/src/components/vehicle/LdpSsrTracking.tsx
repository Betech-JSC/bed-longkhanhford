import {
  LdpConsultantForTracking,
  extractGtagId,
  extractGtmId,
  extractNumericId,
  extractAlphanumericId,
} from "./ldpTrackingHelpers";

interface LdpSsrTrackingProps {
  salesConsultant?: LdpConsultantForTracking | null;
}

export default function LdpSsrTracking({ salesConsultant }: LdpSsrTrackingProps) {
  const tc = salesConsultant?.tracking_config;
  if (!salesConsultant || !tc || typeof tc !== "object") {
    return null;
  }

  const marker = `sale-${salesConsultant.id || "ldp"}`;

  const gtagId = extractGtagId(tc.google_ads_id);
  const ga4Id = extractGtagId(tc.ga4_id);
  const primaryTagId = gtagId || ga4Id;

  const gtmId = extractGtmId(tc.gtm_id);
  const fbPixelId = extractNumericId(tc.facebook_pixel_id);
  const ttPixelId = extractAlphanumericId(tc.tiktok_pixel_id);

  if (!primaryTagId && !gtmId && !fbPixelId && !ttPixelId) {
    return null;
  }

  const gtagInlineScript = primaryTagId
    ? [
        `window.dataLayer=window.dataLayer||[];`,
        `if(typeof window.gtag!=='function'){window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());}`,
        gtagId ? `window.gtag('config',${JSON.stringify(gtagId)});` : "",
        ga4Id ? `window.gtag('config',${JSON.stringify(ga4Id)});` : "",
      ]
        .filter(Boolean)
        .join("")
    : "";

  const gtmInitScript = gtmId
    ? `window.dataLayer=window.dataLayer||[];if(typeof window.gtag!=='function'){window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());}window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`
    : "";

  const fbqInlineScript = fbPixelId
    ? `if(!window.fbq){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');}window.fbq('init',${JSON.stringify(fbPixelId)});window.fbq('track','PageView');`
    : "";

  const ttqInlineScript = ttPixelId
    ? `if(!window.ttq){!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load(${JSON.stringify(ttPixelId)});ttq.page()}(window,document,'ttq');}`
    : "";

  return (
    <>
      {primaryTagId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryTagId)}`}
            data-ldp-ssr-track={marker}
            suppressHydrationWarning
          />
          <script
            id={`${marker}-gtag`}
            data-ldp-ssr-track={marker}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: gtagInlineScript }}
          />
        </>
      )}

      {gtmId && (
        <>
          <script
            id={`${marker}-gtm-init`}
            data-ldp-ssr-track={marker}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: gtmInitScript }}
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`}
            data-ldp-ssr-track={marker}
            suppressHydrationWarning
          />
          <noscript data-ldp-ssr-track={marker} suppressHydrationWarning>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {fbPixelId && (
        <>
          <script
            id={`${marker}-fbq`}
            data-ldp-ssr-track={marker}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: fbqInlineScript }}
          />
          <noscript data-ldp-ssr-track={marker} suppressHydrationWarning>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${encodeURIComponent(fbPixelId)}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {ttPixelId && (
        <script
          id={`${marker}-ttq`}
          data-ldp-ssr-track={marker}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: ttqInlineScript }}
        />
      )}
    </>
  );
}
