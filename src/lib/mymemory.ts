const MYMEMORY_API = "https://api.mymemory.translated.net/get";

interface MyMemoryResponse {
  responseStatus: number;
  responseDetails: string;
  responseData: {
    translatedText: string;
    detectedLanguage?: string;
    match?: number;
  };
  matches?: Array<{ match: number; quality?: string; translation: string }>;
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
  confidence: number;
}

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<TranslationResult> {
  // If text fits in one request, translate directly
  if (new Blob([text]).size <= 450) {
    return translateChunk(text, targetLang, sourceLang);
  }

  // Otherwise, chunk and translate in parallel
  return translateLongText(text, targetLang, sourceLang);
}

async function translateChunk(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<TranslationResult> {
  const params = new URLSearchParams({
    q: text,
    langpair: `${sourceLang}|${targetLang}`,
  });

  const res = await fetch(`${MYMEMORY_API}?${params}&mt=1`);

  if (!res.ok) {
    throw new Error(`MyMemory API error: HTTP ${res.status}`);
  }

  const data: MyMemoryResponse = await res.json();

  if (data.responseStatus && data.responseStatus !== 200) {
    throw new Error(
      `MyMemory API error: ${data.responseDetails || data.responseStatus}`
    );
  }

  const detectedLanguage = data.responseData.detectedLanguage || sourceLang;

  // Pick best translation: prioritize quality over match score
  let bestTranslation = data.responseData.translatedText;
  let bestConfidence = data.responseData.match ?? 0;

  if (data.matches && data.matches.length > 0) {
    const sorted = [...data.matches].sort((a, b) => {
      const qualityA = parseInt(a.quality || "0");
      const qualityB = parseInt(b.quality || "0");
      return qualityB - qualityA;
    });
    const best = sorted[0];
    if (best.translation && parseInt(best.quality || "0") > 60) {
      bestTranslation = best.translation;
      bestConfidence = best.match;
    }
  }

  return {
    translatedText: bestTranslation,
    detectedLanguage,
    confidence: Math.round(bestConfidence * 100),
  };
}

function splitIntoChunks(text: string, maxBytes: number): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
  let current = "";

  for (const sentence of sentences) {
    const candidate = current + sentence;
    if (new Blob([candidate]).size > maxBytes && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

async function translateLongText(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<TranslationResult> {
  const chunks = splitIntoChunks(text, 450);

  const results = await Promise.all(
    chunks.map((chunk) => translateChunk(chunk, targetLang, sourceLang))
  );

  return {
    translatedText: results.map((r) => r.translatedText).join(" "),
    detectedLanguage: results[0]?.detectedLanguage || sourceLang,
    confidence: Math.round(
      results.reduce((sum, r) => sum + r.confidence, 0) / results.length
    ),
  };
}

