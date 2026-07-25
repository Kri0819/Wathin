// Wathin｜未止 — _app.tsx  v2.0.0
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const root = document.documentElement;
    const syncScreenHeight = () => {
      const iosNavigator = navigator as Navigator & { standalone?: boolean };
      const standalone = window.matchMedia('(display-mode: standalone)').matches || iosNavigator.standalone === true;
      const visualHeight = window.visualViewport?.height ?? window.innerHeight;
      const fullHeight = standalone
        ? Math.max(window.screen.height, window.innerHeight, visualHeight)
        : Math.max(window.innerHeight, visualHeight);
      root.style.setProperty('--screen-height', `${Math.ceil(fullHeight)}px`);
    };
    syncScreenHeight();
    window.addEventListener('resize', syncScreenHeight);
    window.visualViewport?.addEventListener('resize', syncScreenHeight);

    let refreshing = false;
    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker?.addEventListener('controllerchange', handleControllerChange);

    const registerWorker = () => {
      navigator.serviceWorker
        ?.register('/sw.js', { updateViaCache: 'none' })
        .then((registration) => registration.update())
        .catch(() => {});
    };
    if ('serviceWorker' in navigator) {
      if (document.readyState === 'complete') registerWorker();
      else window.addEventListener('load', registerWorker);
    }
    const handleBlur = () => { document.body.style.filter = 'blur(8px)'; };
    const handleFocus = () => { document.body.style.filter = 'none'; };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('load', registerWorker);
      window.removeEventListener('resize', syncScreenHeight);
      window.visualViewport?.removeEventListener('resize', syncScreenHeight);
      navigator.serviceWorker?.removeEventListener('controllerchange', handleControllerChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        <meta name="theme-color" content="#071B34" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="未止" />
        <meta name="description" content="等待未止，水流未止。" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Noto+Serif+TC:wght@300;400&display=swap" rel="stylesheet" />
        <title>Wathin｜未止</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
