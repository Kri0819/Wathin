// Wathin｜未止 — Visual tuning values  v2.0.1
// 視覺微調時，優先改這裡，不必在每個元件中找數字。

export const VISUAL = {
  nav: {
    height: 76,
    horizontalPadding: 22,
    bottomPadding: 12,
    iconBoxHeight: 29,
    labelSize: 11,
    itemGap: 5,
    activeOpacity: 0.94,
    inactiveOpacity: 0.42,
    backgroundDarkness: 0.94,
  },
  page: {
    contentMaxWidth: 430,
    horizontalPadding: 24,
    headerTop: 48,
    bottomClearance: 98,
  },
  message: {
    titleSize: 20,
    titleTracking: '0.24em',
    subtitleSize: 13,
    textareaMinHeight: 166,
    textareaFontSize: 17,
    textareaLineHeight: 1.95,
    textareaRadius: 16,
  },
  shore: {
    cardRadius: 16,
    cardMinHeight: 78,
    cardGap: 10,
  },
} as const;
