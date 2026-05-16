import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) throw new Error("GROQ_API_KEY environment variable is not set");
const groq = new Groq({ apiKey });

interface CulturalNote {
  fun_facts: string[];
  cultural_context: string;
  language_official_year: string;
  demographics: string;
  grammar_tips: string[];
  reading_recommendation: string;
}

export type { CulturalNote };

export interface TextAnalysis {
  summary: string;
  recommendations: string[];
  tone: string;
}

function extractJson(raw: string): string {
  let cleaned = raw
    .replace(/```[\w]*\s*/gi, "")
    .replace(/```/g, "")
    .replace(/^[\s\S]*?(\{)/, "$1")
    .replace(/(\})[\s\S]*$/, "$1")
    .trim();

  if (!cleaned.startsWith("{")) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) cleaned = match[0];
  }

  return cleaned || "{}";
}

function sanitize(text: string, maxLen = 2000): string {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').slice(0, maxLen);
}

export async function analyzeText(
  text: string,
  responseLang: string
): Promise<TextAnalysis> {
  const safe = sanitize(text);
  const prompt = `Analyze the following text and return ONLY a JSON object (no markdown, no code fences). Write all content in ${responseLang}.

Text:
"""${safe}"""

Return this EXACT structure — every field MUST have real content, never empty:
{
  "summary": "One sentence explaining the main message, purpose, and intended audience of this text.",
  "recommendations": ["First specific improvement to grammar or clarity.", "Second suggestion to improve tone or structure.", "Third recommendation for better impact or context."],
  "tone": "Short phrase describing the emotional tone and style. Examples: 'warm and professional', 'urgent and persuasive', 'casual and friendly', 'formal and authoritative'."
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.9,
    max_tokens: 400,
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const cleanJson = extractJson(raw);

  try {
    return JSON.parse(cleanJson) as TextAnalysis;
  } catch {
    return { summary: "", recommendations: [], tone: "" };
  }
}

export async function classifyTextType(
  text: string
): Promise<"professional" | "casual"> {
  const safe = sanitize(text, 500);
  const prompt = `Classify the following text as "professional" or "casual".

Professional texts include: CVs, resumes, homework, academic papers, business emails, formal documents, work-related content.
Casual texts include: social media posts, personal messages, informal chats, everyday conversation.

Text: "${safe}"

Reply with ONLY one word: "professional" or "casual".`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    max_tokens: 5,
  });

  const result = (completion.choices[0]?.message?.content || "").trim().toLowerCase();
  return result === "professional" ? "professional" : "casual";
}

export async function correctText(text: string, language: string): Promise<string> {
  const safe = sanitize(text, 1000);
  const prompt = `Fix ONLY obvious typos, missing accents, and punctuation in this ${language} text. Do NOT add words, rephrase, or change meaning. Return only the corrected text.

"${safe}"`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    max_tokens: Math.min(safe.length + 30, 500),
  });

  return (completion.choices[0]?.message?.content || text).trim();
}

export async function generateCulturalNotes(
  sourceLanguage: string,
  targetLanguage: string,
  originalText: string,
  responseLanguage?: string
): Promise<CulturalNote> {
  const language = responseLanguage || sourceLanguage;
  const safe = sanitize(originalText);

  const prompt = `You are a cultural linguistics expert. Given this translation:

- Source language: ${sourceLanguage}
- Target language: ${targetLanguage}
- Text: "${safe}"

Write ALL content in ${language} language.

Return ONLY a valid JSON object (no markdown). Be VERY concise - max 1-2 sentences per field:

{
  "fun_facts": ["two fascinating cultural facts about the TARGET language and its speakers", "another interesting fact about ${targetLanguage} culture"],
  "cultural_context": "1 SHORT sentence about where the TARGET language is spoken and its cultural significance.",
  "grammar_tips": ["one key grammar tip for learning ${targetLanguage}", "another useful tip for mastering ${targetLanguage}"]
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.9,
    max_tokens: 250,
  });

  const raw2 = completion.choices[0]?.message?.content || "{}";
  const cleanJson2 = extractJson(raw2);

  try {
    return JSON.parse(cleanJson2) as CulturalNote;
  } catch {
    return {
      fun_facts: [],
      cultural_context: "",
      language_official_year: "",
      demographics: "",
      grammar_tips: [],
      reading_recommendation: "",
    };
  }
}
