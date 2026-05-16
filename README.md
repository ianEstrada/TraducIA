# 🌐 TraducIA — Translation Learning Assistant

**Translate any text and discover the culture, history, and grammar behind every language. Powered by AI.**

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## 🧠 What is TraducIA?

TraducIA isn't just another translator — it's a **language learning companion**. When you translate text, the app simultaneously:

1. **Translates** via MyMemory API (free, instant)
2. **Enriches** via Groq LLM (cultural context, fun facts, grammar tips)
3. **Saves** to Supabase (your personal glossary)
4. **Analyzes** via AI (text type detection, tone, improvement suggestions)

Everything happens in parallel — no waterfalls, no waiting.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User Browser                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Sign In   │  │  Translate   │  │   History     │  │
│  │ (Google)  │  │   Form UI    │  │   (Resume)    │  │
│  └─────┬─────┘  └──────┬───────┘  └───────┬───────┘  │
└────────┼───────────────┼──────────────────┼──────────┘
         │               │                  │
         ▼               ▼                  ▼
┌─────────────────────────────────────────────────────┐
│              Next.js 14 App Router                   │
│  ┌──────────────────────────────────────────────┐   │
│  │             Middleware (session refresh)      │   │
│  │          @supabase/ssr cookie-based auth     │   │
│  └──────────────────────────────────────────────┘   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ /auth/      │  │  Server      │  │  Server    │  │
│  │ callback    │  │  Actions     │  │  Components│  │
│  │ route.ts   │  │  translate   │  │  Navbar    │  │
│  │             │  │  analyze     │  │  History   │  │
│  └─────────────┘  │  settings    │  │  Settings  │  │
│                   │  resume      │  └───────────┘  │
│                   └──────┬───────┘                  │
└──────────────────────────┼──────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
     ┌──────────┐  ┌──────────┐  ┌──────────┐
     │ Supabase │  │ MyMemory │  │   Groq   │
     │  (Auth + │  │  (Free   │  │  (LLM)   │
     │   DB)    │  │  Trans.) │  │          │
     └──────────┘  └──────────┘  └──────────┘
```

---

## 🤖 AI Inference Pipeline

Every translation triggers a **parallel AI pipeline**:

```
User submits text
        │
        ├──► MyMemory API ──────► translatedText, detectedLanguage
        │
        ├──► Groq classifyTextType ──► "professional" | "casual"
        │
        └──► Groq generateCulturalNotes ──► {
               fun_facts, cultural_context, grammar_tips
             }
        
        All 3 calls run simultaneously via Promise.all
        
        ↓ After response:
        
User clicks "Analyze with AI"
        │
        └──► Groq analyzeText ──► {
               summary, recommendations, tone
             }
             (returns in user's native language from settings)
```

**Models used**: `llama-3.3-70b-versatile` via Groq (fast inference, ~350-400 tokens per call)

**Performance**: All Groq + MyMemory calls complete in ~2-3s total (parallelized, not sequential).

---

## 🗄️ Database Schema

```sql
-- User settings (auto-created on first login redirect)
user_settings (
  user_id UUID PRIMARY KEY,
  native_language TEXT DEFAULT 'es',
  target_languages JSONB DEFAULT '["en"]'
)

-- Translation history (personal glossary)
translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  cultural_notes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- All RLS policies: auth.uid() = user_id
-- SELECT, INSERT, UPDATE, DELETE policies active
```

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google OAuth** | Sign in with Google via Supabase Auth |
| 🌍 **Translation** | 12 languages via MyMemory API |
| 🧠 **Cultural Enrichment** | Fun facts, grammar tips, cultural context via Groq LLM |
| 📊 **AI Analysis** | Text type detection, tone, improvement recommendations |
| 📝 **Personal Glossary** | Every translation saved to your history |
| ⏪ **Resume** | Click any history item to resume from that point |
| ⚙️ **Language Settings** | Native language + target languages preference |
| 📱 **PWA** | Installable on mobile/desktop, offline-ready |
| 🎨 **Responsive** | Hamburger menu on mobile, 3-column desktop layout |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router, Server Actions) |
| **Frontend** | React 18, Tailwind CSS, Inter font |
| **Auth** | Supabase Auth (Google OAuth) + `@supabase/ssr` |
| **Database** | Supabase PostgreSQL + RLS |
| **Translation** | MyMemory API (free tier) |
| **AI / LLM** | Groq API (`llama-3.3-70b-versatile`) |
| **Hosting** | Vercel |
| **PWA** | Service Worker, Web Manifest |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Groq API key
- Google Cloud Console OAuth credentials

### 1. Clone
```bash
git clone https://github.com/ianEstrada/TraducIA.git
cd TraducIA
npm install
```

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
GROQ_API_KEY=gsk_...
```

### 3. Database
Run `supabase/schema.sql` in your Supabase SQL Editor.

### 4. Google OAuth
1. **Google Cloud Console** → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

### 5. Supabase Auth Config
- **Authentication** → **Providers** → Google → Enable (paste Client ID + Secret)
- **Authentication** → **URL Configuration** → Site URL: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/**`

### 6. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🚢 Deployment (Vercel)

1. Import repo from GitHub
2. Set environment variables in Vercel project settings
3. Add Vercel URL to Supabase redirect URLs: `https://your-app.vercel.app/**`
4. Deploy — every push to `main` triggers automatic deployment

---

## 📁 Project Structure

```
src/
├── actions/           # Server Actions (mutations)
│   ├── analyze.ts     # AI text analysis
│   ├── resume.ts      # Resume from history
│   ├── settings.ts    # Save user preferences
│   └── translate.ts   # Main translation pipeline
├── app/
│   ├── auth/
│   │   └── callback/  # OAuth callback handler
│   ├── history/       # Translation history page
│   ├── settings/      # Language preferences page
│   ├── globals.css    # Global styles + design tokens
│   ├── layout.tsx     # Root layout + PWA meta
│   └── page.tsx       # Home page (translator)
├── components/
│   ├── AnalyzePanel.tsx      # Slide-out AI analysis
│   ├── CulturalCard.tsx      # Fun facts + grammar
│   ├── HistoryList.tsx       # Clickable history
│   ├── HomeClient.tsx        # Main page logic
│   ├── MobileNav.tsx         # Hamburger menu
│   ├── Navbar.tsx            # Top navigation
│   ├── SignInButton.tsx      # Google OAuth button
│   ├── SignOutButton.tsx     # Logout handler
│   ├── TranslateForm.tsx     # Input form
│   └── TranslationOutput.tsx # Output panel
├── lib/
│   ├── groq.ts         # Groq LLM client + prompts
│   ├── languages.ts    # Shared language list
│   ├── mymemory.ts     # MyMemory API client
│   └── supabase/
│       ├── client.ts   # Browser Supabase client
│       └── server.ts   # Server Supabase client
└── middleware.ts        # Session refresh + auth
```

---

## 🔒 Security

- **RLS** enabled on all tables (`auth.uid() = user_id`)
- **Service role key** never exposed to client (server-only `createAdminClient`)
- **Prompt injection** mitigation via input sanitization
- **Cookie-based auth** via `@supabase/ssr` (httpOnly, secure, sameSite)
- **Input validation** on all Server Actions

---

## 📄 License

MIT
