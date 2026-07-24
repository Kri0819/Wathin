// Wathin｜未止 — Content Safety  v2.0.1
// 第一層規則：不留下私人資訊、聯絡線索、情色或血腥獵奇內容。
// 正式多人版仍需在後端加入更完整的內容審核，不能只依賴正規表示式。

export type SafetyCategory = 'empty' | 'length' | 'private' | 'explicit';

export interface ValidationResult {
  ok: boolean;
  category?: SafetyCategory;
  reason?: string;
}

const PRIVATE_PATTERNS: RegExp[] = [
  // 電話與長串數字（包含空白、短橫線、括號等分隔方式）
  /(?:\+?886[-\s()]*)?0?9\d{2}[-\s]*\d{3}[-\s]*\d{3}/,
  /(?:\d[-\s().]*){8,}/,

  // Email、網址、社群帳號與邀請連結
  /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/i,
  /(?:https?:\/\/|www\.)\S+/i,
  /(?:line\s*(?:id|帳號)?|line\.me|賴\s*(?:id|帳號)?)/i,
  /(?:instagram|insta(?:gram)?|ig\s*(?:id|帳號)?)/i,
  /(?:discord|dc\s*(?:id|帳號)?)/i,
  /(?:telegram|t\.me|tg\s*(?:id|帳號)?)/i,
  /(?:threads|脆\s*(?:id|帳號)?)/i,
  /(?:wechat|微信|whatsapp|facebook|臉書)/i,
  /@[a-z0-9_.-]{2,}/i,

  // 常見台灣地址與可辨識身分線索
  /[\u4e00-\u9fff]{2,}(?:縣|市)[\u4e00-\u9fff\d]{1,}(?:區|鄉|鎮|市)[\u4e00-\u9fff\d]{1,}(?:路|街|大道|巷|弄)\s*\d+/,
  /(?:身分證|身份證|護照|健保卡|學號|員工編號)\s*[:：]?\s*[a-z0-9-]{5,}/i,
];

const EXPLICIT_PATTERNS: RegExp[] = [
  // 明確情色、性邀約或裸露內容
  /(?:約炮|援交|買春|賣春|性交易|一夜情|找床伴|裸聊|裸照|私密照)/i,
  /(?:做愛|性交|口交|肛交|自慰|手淫|射精|內射|顏射|潮吹|性侵|強姦|強奸)/i,
  /(?:陰莖|雞巴|龜頭|陰道|屄|乳交|精液|A片|色情片|成人片)/i,
  /(?:打[炮砲泡]|想打[炮砲泡]|來打[炮砲泡]|約打[炮砲泡])/i,
  /(?:色色|色色的|色色一下|發情|約嗎)/i,

  // 血腥獵奇、具體殘虐畫面
  /(?:斬首|砍頭|割喉|開膛|剖腹|分屍|碎屍|屍塊|人肉|挖眼|剝皮)/i,
  /(?:血肉模糊|腦漿|內臟外露|滿地是血|肢解|虐殺)/i,
];

export function validateMessage(text: unknown): ValidationResult {
  const trimmed = typeof text === 'string' ? text.trim() : '';

  if (!trimmed) {
    return { ok: false, category: 'empty', reason: '先寫下一句話，再把它放進河裡。' };
  }

  if (trimmed.length > 120) {
    return { ok: false, category: 'length', reason: '字太多了，讓它輕一點吧。' };
  }

  if (PRIVATE_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return { ok: false, category: 'private', reason: '未止不留下私人資訊或能找到彼此的線索。' };
  }

  if (EXPLICIT_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return { ok: false, category: 'explicit', reason: '未止不承載情色、血腥或獵奇內容。' };
  }

  return { ok: true };
}
