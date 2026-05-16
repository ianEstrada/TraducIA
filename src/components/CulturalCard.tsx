interface CulturalNote {
  fun_facts: string[];
  cultural_context: string;
  language_official_year: string;
  demographics: string;
  grammar_tips: string[];
  reading_recommendation: string;
}

interface Props {
  notes: CulturalNote;
  targetLanguage: string;
  sourceLanguage: string;
}

export default function CulturalCard({ notes, targetLanguage, sourceLanguage }: Props) {
  const hasFacts = notes.fun_facts?.length > 0;
  const hasTips = notes.grammar_tips?.length > 0;
  const hasContext = !!notes.cultural_context;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 animate-fade-in">
      {/* Fun Facts */}
      <div className="bg-gradient-to-br from-brand-gold/10 to-brand-cream/30 rounded-2xl border border-brand-gold/15 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-base">&#x2728;</span>
          <h4 className="text-xs font-semibold text-brand-olive uppercase tracking-wider">Fun Facts</h4>
        </div>
        {hasFacts ? (
          <ul className="space-y-1">
            {notes.fun_facts.slice(0, 2).map((fact, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-surface-700 leading-snug">
                <span className="text-brand-gold shrink-0 mt-0.5">&#x2022;</span>
                {fact}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-surface-400">Discover cultural facts about this language.</p>
        )}
      </div>

      {/* Grammar Tips */}
      <div className="bg-gradient-to-br from-brand-teal/10 to-brand-cream/20 rounded-2xl border border-brand-teal/15 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-base">&#x1F4DD;</span>
          <h4 className="text-xs font-semibold text-brand-teal uppercase tracking-wider">Grammar Tips</h4>
        </div>
        {hasTips ? (
          <ul className="space-y-1">
            {notes.grammar_tips.slice(0, 2).map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-surface-700 leading-snug">
                <span className="text-brand-teal shrink-0 mt-0.5">&#x2022;</span>
                {tip}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-surface-400">Practice daily with short exercises.</p>
        )}
      </div>

      {/* Cultural Context */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-brand-teal/10 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-base">&#x1F30D;</span>
          <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Context</h4>
        </div>
        {hasContext ? (
          <p className="text-xs text-surface-600 leading-snug">{notes.cultural_context}</p>
        ) : (
          <p className="text-xs text-surface-400">Learn where this language is spoken.</p>
        )}
      </div>
    </div>
  );
}
