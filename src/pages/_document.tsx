// Wathin｜未止 — _document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-TW">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#020911" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
