# DevKit — Project Reference (AI Quick-Access)

> **Amaç**: Bu döküman, projeyi analiz edecek AI asistanlar için hazırlanmıştır.
> Tüm kod tabanını taramaya gerek kalmadan hızlı ve doğru cevaplar üretmeyi sağlar.
> Son güncelleme: 2026-08-17

---

## 1. Proje Özeti

| Alan | Değer |
|---|---|
| **Ad** | DevKit — Developer Toolkit |
| **Domain** | DevKitIo |
| **Tür** | Single Page Application (SPA) — Client-side only |
| **Amaç** | Geliştiriciler için encoding, formatting, text manipulation, code generation araçları. Tüm data tarayıcıda kalır. |
| **Framework** | React 19 + TypeScript 6 |
| **Build Tool** | Vite 8 |
| **CSS** | Tailwind CSS v4 (`@tailwindcss/vite`) + Vanilla CSS (design tokens & component classes, tek dosya: `index.css`) |
| **Editor** | CodeMirror 6 (`@uiw/react-codemirror`) — 9 dil desteği |
| **Icons** | lucide-react |
| **Router** | react-router-dom v7 |
| **Fonts** | Inter (UI), JetBrains Mono (code) — Google Fonts CDN |
| **Path Alias** | `@` → `./src` (vite.config.ts + tsconfig) |
| **Default Theme** | Dark (`html.dark`) |
| **Default Locale** | English (`en`); optional Turkish (`tr`) via header EN/TR |
| **Lint** | oxlint |

---

## 2. Dizin Yapısı

```
DevKit1/
├── index.html                    # HTML entry, font preloads, class="dark"
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite + React + Tailwind + path alias (@→src)
├── tsconfig.json                 # References app & node configs
├── tsconfig.app.json             # ES2023, strict, path alias, react-jsx
├── tsconfig.node.json            # Node config for vite.config.ts
├── .oxlintrc.json                # Lint config
├── dist/                         # Production build output
├── public/                       # Static assets (favicon.svg)
└── src/
    ├── main.tsx                  # ReactDOM.createRoot entry
    ├── App.tsx                   # Root: BrowserRouter + ToolboxPage layout
    ├── index.css                 # TÜM stiller (tek CSS dosyası)
    │
    ├── components/               # 11 UI bileşeni
    │   ├── CategorySelector/CategorySelector.tsx
    │   ├── CopyButton/CopyButton.tsx
    │   ├── DiffView/DiffView.tsx
    │   ├── Editor/CodeEditor.tsx
    │   ├── InputPanel/InputPanel.tsx
    │   ├── OutputPanel/OutputPanel.tsx
    │   ├── Layout/Header.tsx
    │   ├── Sidebar/Sidebar.tsx
    │   ├── ToolOptions/ToolOptions.tsx
    │   ├── ToolSearch/ToolSearch.tsx
    │   └── ToolSelector/ToolSelector.tsx
    │
    ├── i18n/                     # EN (default) + TR çeviriler
    │   ├── en.ts / tr.ts / types.ts / index.ts
    │   └── LocaleContext.tsx
    ├── hooks/                    # 5 Custom React hooks
    │   ├── useFavorites.ts       # Favori tool yönetimi (localStorage)
    │   ├── useKeyboardShortcuts.ts  # Global kısayollar
    │   ├── useLocale.ts          # Dil seçimi (localStorage, default: en)
    │   ├── useTheme.ts           # Dark/light tema (localStorage)
    │   └── useToolbox.ts         # ★ Merkezi state yönetimi (190 satır)
    │
    ├── registry/                 # Tool & category kayıt sistemi
    │   ├── toolRegistry.ts       # Map<string, ToolDefinition>, auto-discovery, search, detect
    │   └── categoryRegistry.ts   # 9 kategori tanımı, getCategoryById
    │
    ├── services/                 # Yardımcı servisler
    │   ├── clipboard/clipboard.ts  # Copy/read clipboard (fallback: textarea)
    │   └── storage/storage.ts      # localStorage wrapper (prefix: devtoolbox_)
    │
    ├── tools/                    # Araç implementasyonları (16 dosya)
    │   ├── data/                 # jsonFormatter, jsonMinifier, jsonToClass, classToJson, xmlFormatter
    │   ├── debugging/            # diffCompare
    │   ├── encoding/             # base64
    │   ├── generators/           # guidGenerator
    │   ├── sql/                  # sqlFormatter, sqlInGenerator
    │   └── text/                 # columnToComma, commaToColumn, columnToQuoted, columnToSqlIn, removeDuplicates, sortLines, wordCounter, characterCounter
    │
    └── types/
        └── tool.ts               # ToolDefinition, ToolOption, ToolCategory, ToolboxState, UserPreferences
```

---

## 3. Mimari & Veri Akışı

### Başlatma Sırası
```
main.tsx → App() → BrowserRouter → ToolboxPage
  ↓ useEffect: initializeRegistry()
  ↓ import.meta.glob('../tools/**/*.ts', { eager: true })
  ↓ Her .ts dosyasının default export'u → registerTool(tool)
  ↓ registryReady = true → UI render
```

### Layout Hiyerarşisi (App.tsx)
```
div.h-screen.flex-col
├── Header                              # logo, arama, tema toggle
└── div.flex.flex-1.min-h-0.overflow-hidden
    ├── Sidebar                         # favoriler, son kullanılanlar, kategori ağacı
    └── main.flex-1.flex-col.overflow-hidden   ⚠️ overflow-hidden (scrollbar için kritik!)
        ├── Controls (shrink-0, overflow-y-auto)
        │   ├── CategorySelector + ToolSelector (grid 2-col)
        │   ├── Tool Description
        │   └── ToolOptions (dynamic form)
        └── Editor Area (flex-1, min-h-0)
            ├── [inputType=dual] DiffView + OutputPanel
            └── [default] Grid(InputPanel | OutputPanel) 2-col
                └── Transform Button (autoTransform=false ise)
```

### State Yönetimi (useToolbox — merkezi hook)
```
useToolbox() → ToolboxState + ToolboxActions
├── selectedCategoryId / selectedToolId / selectedTool
├── input, secondaryInput (dual-input tools için)
├── output, error, isProcessing
├── toolOptions: Record<string, unknown>
│
├── selectCategory(id)         → reset tool/IO
├── selectTool(id)             → reset IO, init default options
├── selectCategoryAndTool()    → her ikisini birden
├── setInput / setSecondaryInput / setOption
├── transform()                → tool.process(input, opts) çağır (async)
├── clearInput() / clearAll()
│
└── Auto-transform: autoTransform=true && input non-empty
    → 150ms debounce → runTransform()
```

### Tool Kayıt & Keşif Sistemi
```
toolRegistry.ts
├── initializeRegistry()
│   └── import.meta.glob('../tools/**/*.ts', { eager: true })
│       → Her dosyanın export default → registerTool()
│       → tools Map<string, ToolDefinition> + category.tools[] push
│
├── getToolById(id)              → O(1) Map lookup
├── getToolsByCategory(catId)    → kategori altındaki tool'lar
├── getAllTools()                 → tüm tool'lar
├── getCategoriesWithTools()     → tool'u olan kategoriler
├── searchTools(query)           → skorlu arama (name > keywords > description)
│   └── Scoring: exact name=100, startsWith=80, contains=60, keyword=40, description=20
└── detectTools(input)           → her tool.detect(input) çalıştır → max 6 öneri
```

### Routing
```
/                           → ToolboxPage (boş)
/tools/:category            → Kategori seçili
/tools/:category/:toolId    → Kategori + araç seçili
URL ↔ State çift yönlü sync (useEffect)
```

---

## 4. Type Definitions (`src/types/tool.ts`)

```typescript
type ToolOptionType = 'text' | 'number' | 'boolean' | 'select';

interface SelectOption { label: string; value: string; }

interface ToolOption {
  id: string;           // Option identifier
  label: string;        // Display label
  type: ToolOptionType;
  defaultValue?: unknown;
  placeholder?: string;
  options?: SelectOption[];  // For 'select' type
}

interface ToolDefinition {
  id: string;           // Unique ID (e.g., 'jsonFormatter')
  name: string;         // Display name
  description: string;
  category: string;     // Category ID
  keywords: string[];   // Search keywords
  inputType: 'text' | 'code' | 'json' | 'xml' | 'sql' | 'dual';
  outputType?: 'text' | 'code' | 'json' | 'xml' | 'sql';
  options?: ToolOption[];
  autoTransform?: boolean;
  detect?: (input: string) => boolean;     // Auto-detection heuristic
  process: (input: string, options?: Record<string, unknown>) => string | Promise<string>;
}

interface ToolCategory {
  id: string; name: string; description: string; icon: string;
  tools: ToolDefinition[];   // Populated at runtime by registerTool()
}

interface ToolboxState {
  selectedCategoryId: string | null;
  selectedToolId: string | null;
  toolOptions: Record<string, unknown>;
  input: string; secondaryInput: string;
  output: string; error: string | null; isProcessing: boolean;
}

interface UserPreferences {
  theme: 'dark' | 'light';
  favoriteToolIds: string[];
  editorSettings: { tabSize: number; wordWrap: boolean; fontSize: number; };
}
```

---

## 5. Kategoriler & Araçlar

### Kategori Listesi (categoryRegistry.ts — 9 kategori)

| ID | Ad | Icon | Açıklama |
|---|---|---|---|
| `sql` | SQL | Database | SQL formatting, generation, transformation |
| `data` | Data | Braces | JSON, YAML, XML, JS/TS formatting, data conversion |
| `text` | Text | Type | Text manipulation, sorting, transformation |
| `encoding` | Encoding | Lock | Base64, URL, HTML encoding/decoding |
| `generators` | Generators | Sparkles | UUID, hash, password, random data |
| `debugging` | Debugging | Bug | Diff, validation, debugging utilities |
| `code` | Code | Code | Code formatting, beautification |
| `conversion` | Conversion | ArrowLeftRight | Data format conversion |
| `web` | Web | Globe | URL parsing, cURL conversion |

### Tüm Araçlar (22 dosya)

| Dosya | Tool ID | Kategori | Input→Output | Auto | Lazy Load | Özet |
|---|---|---|---|---|---|---|
| `data/jsonFormatter.ts` | jsonFormatter | data | json→json | ✅ | — | Indent (2/4/tab), sort keys (recursive) |
| `data/jsonMinifier.ts` | jsonMinifier | data | json→json | ✅ | — | JSON.stringify(JSON.parse(input)) |
| `data/yamlFormatter.ts` | yamlFormatter | data | text→text | ✅ | `js-yaml` | YAML parse/dump, indent, sort keys |
| `data/javascriptFormatter.ts` | javascriptFormatter | data | code→code | ❌ | `prettier` | JS beautify (indent, semi, quotes) |
| `data/jqueryFormatter.ts` | jqueryFormatter | data | code→code | ❌ | `prettier` | jQuery/JS beautify |
| `data/typescriptFormatter.ts` | typescriptFormatter | data | code→code | ❌ | `prettier` | TS beautify (indent, semi, quotes) |
| `data/jsonToClass.ts` | jsonToClass | data | json→code | ✅ | — | JSON→C#/TS/Java class. Smart type inference (DateTime, Guid, nested) |
| `data/classToJson.ts` | classToJson | data | code→json | ✅ | — | C#/TS/Java class→JSON. Auto-detect dil |
| `data/xmlFormatter.ts` | xmlFormatter | data | xml→xml | ✅ | — | Pure-JS XML formatter, attr sorting |
| `debugging/diffCompare.ts` | diffCompare | debugging | dual→text | ❌ | `diff` lib | Line/word/char diff, unified format |
| `encoding/base64.ts` | base64 | encoding | text→text | ✅ | — | UTF-8 safe (TextEncoder), encode/decode mode |
| `generators/guidGenerator.ts` | guidGenerator | generators | text→text | ❌ | — | .NET GUID formats (D/N/B/P), count/case |
| `sql/sqlFormatter.ts` | sqlFormatter | sql | sql→sql | ❌ | `sql-formatter` lib | 6 dialekt (SQL, T-SQL, PG, MySQL, SQLite, PL/SQL) |
| `sql/sqlInGenerator.ts` | sqlInGenerator | sql | text→sql | ✅ | — | Lines→IN ('a','b','c'), quote style |
| `text/columnToComma.ts` | columnToComma | text | text→text | ✅ | — | Lines→comma-separated |
| `text/commaToColumn.ts` | commaToColumn | text | text→text | ✅ | — | Comma-separated→lines |
| `text/columnToQuoted.ts` | columnToQuoted | text | text→text | ✅ | — | Lines→'a','b','c' (quoted list) |
| `text/columnToSqlIn.ts` | columnToSqlIn | text | text→sql | ✅ | — | Lines→IN ('a','b','c') |
| `text/removeDuplicates.ts` | removeDuplicates | text | text→text | ✅ | — | Unique lines (Set), case option |
| `text/sortLines.ts` | sortLines | text | text→text | ✅ | — | Alpha/numeric sort, localeCompare |
| `text/wordCounter.ts` | wordCounter | text | text→text | ✅ | — | Words/lines/sentences/paragraphs |
| `text/characterCounter.ts` | characterCounter | text | text→text | ✅ | — | Chars ± spaces/newlines, letters, digits |

### Tool Dosyası Pattern
```typescript
import type { ToolDefinition } from '@/types/tool';
const tool: ToolDefinition = {
  id: 'toolId', name: 'Tool Name', description: '...',
  category: 'categoryId', keywords: ['...'],
  inputType: 'text', outputType: 'text',
  autoTransform: true,
  options: [{ id: 'opt', label: 'Option', type: 'select', defaultValue: 'x', options: [...] }],
  detect: (input) => /pattern/.test(input),     // optional
  process: (input, options?) => transformedResult,  // sync or async
};
export default tool;
```

**Yeni araç eklemek için**: `src/tools/<category>/` altına `.ts` dosyası oluştur → `export default ToolDefinition` → otomatik keşfedilir.

---

## 6. Bileşen Referansı (11 bileşen)

### App.tsx — Root Orchestrator
- **Export**: `App` (default) — BrowserRouter + Routes → `ToolboxPage`
- **Hooks**: useToolbox, useTheme, useFavorites, useKeyboardShortcuts
- **Local state**: searchOpen, sidebarOpen, registryReady
- **Helper**: `getEditorLanguage(inputType)` → EditorLanguage mapping
- **Routing**: `/`, `/tools/:category`, `/tools/:category/:toolId`

### CodeEditor — CodeMirror Wrapper
- **Konum**: `src/components/Editor/CodeEditor.tsx`
- **Export**: default + `EditorLanguage` type
- **Props**: value, onChange?, language?, readOnly?, theme?, placeholder?, height?, minHeight?
- **Temalar**: tokyoNight (dark), githubLight (light)
- **Diller**: text, javascript, typescript, json, sql, html, css, xml, markdown, python, java, diff
- **Features**: Line numbers, fold gutter, bracket matching, word wrap, search keymap

### InputPanel — Editable Input
- **Konum**: `src/components/InputPanel/InputPanel.tsx`
- **Props**: value, onChange, language?, theme?, placeholder?, label?, onPaste?, onClear?
- **Features**: Line/char sayacı, Paste (clipboard API), Clear, **Fullscreen toggle** (Maximize2/Minimize2)
- **Fullscreen**: ESC çıkış, overlay tıklama çıkış, body scroll kilidi, layout placeholder

### OutputPanel — Read-only Output
- **Konum**: `src/components/OutputPanel/OutputPanel.tsx`
- **Props**: value, error?, language?, theme?, label?, isProcessing?, downloadFilename?
- **Features**: CopyButton, Download (Blob), Processing pulse, Error display, **Fullscreen toggle**

### Header
- **Konum**: `src/components/Layout/Header.tsx`
- **Props**: onSearchOpen, theme, onToggleTheme
- **İçerik**: Logo "DevKit" + "100% Client-Side" badge, Search (⌘K), Theme toggle

### Sidebar — Navigation
- **Konum**: `src/components/Sidebar/Sidebar.tsx`
- **Props**: favoriteIds, onSelectTool, onToggleFavorite, isOpen, onClose
- **Bölümler**: Favorites (Star), All Categories (expandable tree)
- **Responsive**: Mobile=fixed overlay, Desktop=static aside

### ToolSearch — Command Palette (⌘K)
- **Konum**: `src/components/ToolSearch/ToolSearch.tsx`
- **Props**: isOpen, onClose, onSelectTool
- **Features**: Scored search, max 8 sonuç, keyboard nav (↑↓ Enter Esc), auto-focus

### ToolOptions — Dynamic Form
- **Konum**: `src/components/ToolOptions/ToolOptions.tsx`
- **Props**: options (ToolOption[]), values, onChange
- **Render**: select→dropdown, boolean→toggle, number→number input, text→text input

### CategorySelector / ToolSelector — Select Dropdowns
- **Konumlar**: `CategorySelector/CategorySelector.tsx`, `ToolSelector/ToolSelector.tsx`
- **CSS**: `.select-field` class

### CopyButton
- **Konum**: `src/components/CopyButton/CopyButton.tsx`
- **Props**: text, label?, className?
- **Davranış**: Copy → 2s "Copied ✓" → reset

### DiffView — Dual Editor
- **Konum**: `src/components/DiffView/DiffView.tsx`
- **Props**: originalValue, modifiedValue, onOriginalChange, onModifiedChange, theme?
- **UI**: İki yan yana CodeEditor ("ORIGINAL" + "MODIFIED")

---

## 7. Hook Referansı (4 hook)

| Hook | Dosya | Amaç | Storage Key |
|---|---|---|---|
| `useToolbox` | useToolbox.ts | ★ Merkezi state (tool seçimi, I/O, transform, 150ms debounce) | — |
| `useTheme` | useTheme.ts | Dark/light tema (toggleTheme, setTheme) | `devtoolbox_theme` |
| `useFavorites` | useFavorites.ts | Favori tool ID'leri (max 20) | `devtoolbox_favorites` |
| `useKeyboardShortcuts` | useKeyboardShortcuts.ts | Global kısayollar | — |

### Keyboard Shortcuts
| Kısayol | Aksiyon |
|---|---|
| `Ctrl/⌘ + K` | Arama aç |
| `Ctrl/⌘ + Enter` | Transform çalıştır |
| `Ctrl/⌘ + Shift + C` | Output'u kopyala |
| `Ctrl/⌘ + L` | Input'u temizle |

---

## 8. Servis Referansı

### clipboard (`services/clipboard/clipboard.ts`)
```typescript
copyToClipboard(text: string): Promise<boolean>  // navigator.clipboard + textarea fallback
readFromClipboard(): Promise<string | null>       // navigator.clipboard.readText
```

### storage (`services/storage/storage.ts`)
```typescript
// Prefix: 'devtoolbox_' — sadece preferences, ASLA user data değil
readStorage<T>(key: string, fallback: T): T
writeStorage<T>(key: string, value: T): void
removeStorage(key: string): void
loadPreferences(): UserPreferences
savePreferences(prefs: UserPreferences): void

// Default preferences:
{ theme: 'dark', favoriteToolIds: [],
  editorSettings: { tabSize: 2, wordWrap: true, fontSize: 14 } }
```

---

## 9. Stil Sistemi (`src/index.css` — tek dosya)

### Design Token'ları (@theme)

**Brand renkleri**: oklch, hue=240 (mavi), 50–600 arası 7 ton, primary=brand-500
**Surface renkleri**: oklch, hue=260 (mavi-gri), 50–900 arası 12 ton
**Semantic**: success (yeşil h145), warning (sarı h75), error (kırmızı h25), info (mavi h240)
**Fonts**: `--font-sans` (Inter), `--font-mono` (JetBrains Mono)
**Radius**: sm=6px, md=8px, lg=12px, xl=16px

### Tema Değişkenleri

| Değişken | Dark (varsayılan) | Light |
|---|---|---|
| `--bg-app` | surface-900 | near-white |
| `--bg-panel` | surface-850 | pure white |
| `--bg-input` | surface-800 | off-white |
| `--bg-elevated` | surface-750 | light gray |
| `--bg-hover` | surface-700 | lighter gray |
| `--border-default` | surface-700 | medium gray |
| `--border-subtle` | surface-750 | subtle gray |
| `--text-primary` | surface-50 | near-black |
| `--text-secondary` | surface-400 | mid-gray |
| `--text-tertiary` | surface-500 | light mid-gray |
| `--scrollbar-track` | oklch(0.22) | oklch(0.93) |
| `--scrollbar-thumb` | oklch(0.48) | oklch(0.70) |
| `--scrollbar-thumb-hover` | oklch(0.68) | oklch(0.52) |

### CSS Class'ları (@layer components)

| Class | Kullanım |
|---|---|
| `.select-field` | `<select>` dropdown (custom chevron SVG, focus ring) |
| `.text-input` | Text input (focus ring) |
| `.btn-primary` | Ana buton (brand-500, white text, scale active) |
| `.btn-ghost` | İkincil buton (transparent, bordered, hover fill) |
| `.panel` | Panel container (bg-panel, border, radius-lg, overflow:hidden) |
| `.panel-header` | Panel başlık (flex, uppercase 0.75rem, border-bottom) |
| `.toggle-switch` | Boolean toggle (data-checked attr, animated knob ::after) |
| `.field-label` | Form etiketi (0.75rem, semi-bold) |
| `.kbd` | Klavye kısayol badge (mono, elevated bg) |
| `.error-message` | Hata kutusu (kırmızı bg/border, mono, pre-wrap) |
| `::-webkit-scrollbar*` | 10px scrollbar, temaya duyarlı (`--scrollbar-track`, `--scrollbar-thumb`, `--scrollbar-thumb-hover`), Firefox için `html { scrollbar-color }` |

### CodeMirror Override'ları
```css
.editor-host        { display:flex; flex-direction:column; flex:1 1 0%; height:100%; min-height:0 }  /* ⚠️ uiw sarmalayıcısına kesin yükseklik */
.editor-host > .cm-editor { flex: 1 1 0%; min-height: 0 }
.cm-editor          { height: 100%; max-height: 100%; font: mono 0.8125rem }
.cm-editor .cm-scroller { overflow: auto !important; max-height: 100% }  /* ⚠️ Scrollbar için kritik! */
.cm-editor.cm-focused   { outline: none }
```

### Overlay & Animasyon

| Class | z-index | blur | Kullanım |
|---|---|---|---|
| `.search-overlay` | 50 | 4px | ⌘K arama modalı, padding-top: 15vh |
| `.fullscreen-backdrop` | 59 | 8px | Panel fullscreen arka plan (blur), tıklama ile çıkış |
| `.panel.is-fullscreen` | 60 | — | `position:fixed; inset:1.25rem`, shadow, border-radius-xl (panel yerinde kalır, remount yok) |

| Keyframe | Efekt |
|---|---|
| `fade-in` | opacity 0→1 |
| `slide-up` | opacity + translateY(8px→0) |

---

## 10. Kritik Layout Kuralları

> ⚠️ Bu kurallar scrollbar ve overflow sorunlarını önler.

| Kural | Neden |
|---|---|
| `<main>` = `overflow-hidden` | `overflow-y-auto` olursa editör sınırsız büyür, scrollbar çıkmaz |
| Controls = `shrink-0 overflow-y-auto` | Kendi içinde scroll'lanır, editör alanını sıkıştırmaz |
| Editor grid = `min-h-0` | `min-h-[300px]` editörü ekrandan iter |
| `.cm-scroller` = `overflow: auto !important` | CodeMirror scrollbar'ı bu olmadan çalışmaz |
| `.editor-host` (uiw sarmalayıcı div) = `flex-col + height:100% + min-height:0` | Sarmalayıcının yüksekliği auto kalırsa `.cm-editor` height:100% → auto olur, içerik taşmaz ve scrollbar hiç oluşmaz |
| Editör kapsayıcı div = `flex-1 min-h-0 flex flex-col overflow-hidden` | `.editor-host`'a kesin yükseklik aktarır |
| Fullscreen panel = `overflow:hidden + flex-col` | İç editör alanı constrainted olur |
| `.panel.is-fullscreen > .panel-header` = `flex-shrink: 0` | Header sıkıştırılmaz |
| Fullscreen'de panel ağaçta yerinde kalır, sadece `position:fixed` + CSS sınıfı değişir | CodeMirror remount olmaz → büyük doküman yeniden parse edilmez, Expand hızlı açılır |

---

## 11. Bağımlılıklar

### Production
| Paket | Amaç |
|---|---|
| react / react-dom 19 | UI framework |
| react-router-dom 7 | Client-side routing |
| @uiw/react-codemirror | CodeMirror wrapper |
| @uiw/codemirror-theme-tokyo-night | Dark tema |
| @uiw/codemirror-theme-github | Light tema |
| @codemirror/lang-* (9 paket) | js, ts, json, sql, html, css, xml, markdown, python, java |
| @codemirror/view | EditorView (line wrapping) |
| lucide-react | SVG ikonlar |
| diff | Diff tool lazy-load |
| sql-formatter | SQL tool lazy-load |

### Dev
| Paket | Amaç |
|---|---|
| vite 8 | Build & dev server |
| @vitejs/plugin-react | React HMR/JSX |
| tailwindcss 4 + @tailwindcss/vite | Utility CSS |
| typescript 6 | Type checking |
| oxlint | Linting |

### Scripts
```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run preview   # Production preview
npm run lint      # oxlint
```

---

## 12. Bilinen Sorunlar & Notlar

1. **Build uyarısı**: index chunk 500KB+. `import()` ile code-splitting önerilir.
2. **Lazy loading**: `diffCompare` ve `sqlFormatter` ağır kütüphaneleri `await import()` ile lazy-load eder — iyi pattern.
3. **Async process**: `ToolDefinition.process()` hem `string` hem `Promise<string>` dönebilir. `useToolbox` bunu handle eder.
4. **Dual-input**: `inputType: 'dual'` olan tool'lar `DiffView` bileşeni ile render edilir. `secondaryInput` ayrı state olarak tutulur.
5. **Auto-detection (pasif)**: `SmartDetection` bileşeni kaldırıldı (yanlış pozitif öneriler üretiyordu). `toolRegistry.detectTools()` ve tool'ların `detect()` fonksiyonları hâlâ duruyor ancak UI'da kullanılmıyor.
6. **Privacy**: Tüm data client-side kalır. localStorage sadece preferences için kullanılır, user data saklanmaz.
