# Wathin｜未止 — v2.3.0

> 等待未止，水流未止。

匿名漂流紙船 PWA。把一句話折成紙船，放進河流，讓它漂流。沒有社群、沒有回覆、沒有帳號互動。船比人重要，訊息比身份重要，流動比留下重要。

本版本依照《Wathin Visual Design System v1.0》完整重建，包含精確的色彩 token、字體規格、紙船三態、光影系統與動態規格。

---

## 🚀 部署到 Vercel

```bash
git init
git add .
git commit -m "feat: v2.0.1 — rebuilt to design system v1.0 spec"
git remote add origin https://github.com/你的帳號/wathin.git
git push -u origin main
```

接著到 [vercel.com](https://vercel.com) → New Project → Import → Deploy。

---

## 🛠 本地開發

```bash
npm install
npm run dev
# http://localhost:3000
```

---

## 🎨 設計系統 Token

### 色彩
| Token | Hex | 用途 |
|---|---|---|
| Deep Blue | `#071B34` | 主背景（深夜） |
| Navy | `#0D2A4A` | 卡片/浮層 |
| Blue | `#123B63` | 強調/高光 |
| Water Light | `#CFE8FF` | 主要文字、水面高光 |
| Text | `#F5F9FF` | 內文 |
| Muted | `#9FB6CC` | 次要文字 |

### 字體
- **Cormorant Garamond** (Light/Regular) — Logo、英文標題，字距加寬
- **Noto Serif TC** (Light/Regular) — 中文內文、介面文字

### 間距系統
`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px`

### Motion
- 船漂移動：非常緩慢，線性或 ease-in-out
- 浮層出現：從下方浮起，淡入 + 位移
- 紙船折疊：平滑過渡 0.6 ~ 0.8s
- 微光呼吸：低頻呼吸感，8 ~ 12s 一次

---

## 🗂 專案結構

```
src/
├── design-system/          # 河流、月亮、紙船、動態與色彩調整值
├── components/
│   ├── WaterCanvas.tsx     # 月光水面 canvas 動畫
│   ├── WathinWave.tsx      # 品牌波浪 logo mark（含呼吸動畫）
│   ├── PaperBoat.tsx       # 紙船三態：靜止/漂浮/被接住(發光)
│   ├── DriftBoat.tsx       # 單船漂流引擎
│   ├── BoatOverlay.tsx     # 船訊浮層
│   ├── NavBar.tsx          # 底部導航
│   ├── NavIcons.tsx        # 岸邊/寫船圖示
│   ├── RiverScreen.tsx     # 首頁
│   ├── CreateScreen.tsx    # 寫船頁面
│   └── ShoreScreen.tsx     # 岸邊收藏區
├── hooks/
│   └── useRiver.ts         # 單船輪流引擎邏輯
├── lib/
│   ├── types.ts
│   ├── tokens.ts           # 設計系統 token（色彩/字體/間距）
│   ├── storage.ts          # localStorage 持久化
│   └── safety.ts           # 內容安全過濾
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   └── api/boats/
│       ├── next.ts
│       ├── create.ts
│       └── receive.ts
└── styles/
    └── globals.css
public/
├── manifest.json
├── sw.js
├── icon-192.png
├── icon-512.png
└── favicon.ico
```

---

## 版本歷史

| 版本 | 內容 |
|---|---|
| v1.0.0 – v1.0.9 | 初始迭代，逐步貼近視覺草圖 |
| v2.0.1 | 依照完整品牌視覺規範文件重建：精確色彩 token、字體規格、紙船三態、光影系統、間距系統、Motion 規格 |
| v2.0.2 | 船訊草稿自動保存；送出成功後才播放折船動畫；離線或伺服器失敗時保留原文並提供安靜回饋；補上輸入區螢幕閱讀器提示。 |
| v2.1.0 | 依品牌參考圖重製河流首頁：分層夜空、18 顆非同步星光、四層月光、破碎倒影、遠近水波、摺紙船材質與慢速漂流；空河等待改為隨機 3–10 秒；新增集中式 design-system；岸邊可提早放走；加強變形敏感詞檢查。 |
| v2.1.1 | 依電腦與手機實機截圖精準校準：增加動漫電影感水波與月光碎影、換用真實紙纖維紙船資產、修正 iPhone 底部安全區色塊、讓桌面底部 Banner 滿寬，並調整寬螢幕品牌與紙船比例。 |
| v2.2.0 | 河面視覺全面重製：桌面與手機使用各自的日系動畫電影級夜河底圖，疊加低頻呼吸、星光、月暈與動態碎光；裁除紙船透明留白並提高主角位置，讓船穩定出現在畫面中段。 |
| v2.2.1 | 新增 WebGL 流動河面：天空保持穩定，水域依遠近深度產生不同幅度的水平與垂直波動，月光碎影同步移動；紙船浮動週期調整為 4.2 秒並降低旋轉幅度，使船與河流自然連動。 |
| v2.2.2 | 改用跨瀏覽器 2D Canvas 分層水流，確保實際裝置可感知河面動態；近景與遠景使用不同位移幅度。紙船新增水線遮擋、深藍環境光、接觸陰影、加強倒影及兩層拍岸水紋，使船身真正融入河面。 |
| **v2.3.0** | 桌面與手機河面各自預先渲染成 24 幀、2.88 秒無縫 Animated WebP，使用平滑二維網格變形避免即時切片撕裂。紙船改用實際動畫河面材質遮住船底並重新調色；底部安全區上限固定為 34px，避免行動瀏覽器工具列造成巨大黑色留白。 |
