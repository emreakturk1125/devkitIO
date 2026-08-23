# DevKit

Geliştiriciler için tarayıcı tabanlı araç kutusu. Formatlama, dönüştürme, metin işleme, kod üretimi ve hata ayıklama işlemlerini **sunucuya veri göndermeden** yerelde çalıştırır.

## Özellikler

- %100 istemci tarafı — girdi tarayıcıda kalır, backend yoktur
- Koyu / açık tema
- İngilizce ve Türkçe arayüz
- Favori araçlar ve son kullanılanlar (localStorage)
- `Ctrl/⌘ + K` ile araç arama
- CodeMirror tabanlı editör (JSON, SQL, HTML, CSS, XML, JavaScript, TypeScript ve diğer diller)

## Araç kategorileri

| Kategori | Örnekler |
|---|---|
| **SQL** | SQL formatlama, `IN (...)` üretimi, SQL → C# sınıfı |
| **Data** | JSON / YAML / XML formatlama, minify, JSON → sınıf / TypeScript / YAML / XML, JS/TS formatlama |
| **Text** | Satır sıralama, tekrar silme, büyük/küçük harf, kelime/karakter sayacı, sütun ↔ virgül |
| **Encoding** | Base64 encode / decode |
| **Generators** | UUID, GUID, parola, rastgele string |
| **Debugging** | Diff, JWT decode, regex tester, HTTP status lookup |
| **Code** | HTML ve CSS formatlama |

## Teknoloji

React 19, TypeScript, Vite, Tailwind CSS v4, CodeMirror 6, React Router.

## Kurulum

Node.js 20+ önerilir.

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak [http://localhost:5173](http://localhost:5173) adresinde açılır.

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Tip kontrolü + üretim derlemesi |
| `npm run preview` | Derlenen çıktıyı yerelde önizle |
| `npm run lint` | Oxlint |

## Yeni araç eklemek

1. `src/tools/<kategori>/` altına bir `.ts` dosyası oluştur.
2. `ToolDefinition` nesnesini `export default` ile dışa aktar.
3. Kayıt otomatiktir (`import.meta.glob`); registry dosyasını elle güncellemen gerekmez.

```ts
import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'ornekArac',
  name: 'Örnek Araç',
  description: 'Kısa açıklama',
  category: 'text',
  keywords: ['ornek'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  process: (input) => input,
};

export default tool;
```

## Gizlilik

Tema, dil ve favoriler `localStorage` içinde tutulur. Araç girdileri sunucuya yazılmaz; yalnızca tarayıcı belleğindedir.
