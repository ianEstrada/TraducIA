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

