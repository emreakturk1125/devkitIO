import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { githubLight } from '@uiw/codemirror-theme-github';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { sql } from '@codemirror/lang-sql';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { xml } from '@codemirror/lang-xml';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export type EditorLanguage =
  | 'text'
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'sql'
  | 'html'
  | 'css'
  | 'xml'
  | 'markdown'
  | 'python'
  | 'java'
  | 'diff';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: EditorLanguage;
  readOnly?: boolean;
  theme?: 'dark' | 'light';
  placeholder?: string;
  height?: string;
  minHeight?: string;
}

function getLanguageExtension(lang: EditorLanguage): Extension | null {
  switch (lang) {
    case 'javascript':
      return javascript({ jsx: true });
    case 'typescript':
      return javascript({ jsx: true, typescript: true });
    case 'json':
      return json();
    case 'sql':
      return sql();
    case 'html':
      return html();
    case 'css':
      return css();
    case 'xml':
      return xml();
    case 'markdown':
      return markdown();
    case 'python':
      return python();
    case 'java':
      return java();
    default:
      return null;
  }
}

const wordWrapExtension = EditorView.lineWrapping;

export default function CodeEditor({
  value,
  onChange,
  language = 'text',
  readOnly = false,
  theme = 'dark',
  placeholder = '',
  height = '100%',
  minHeight = '0',
}: CodeEditorProps) {
  const extensions = useMemo(() => {
    const exts: Extension[] = [wordWrapExtension];
    const langExt = getLanguageExtension(language);
    if (langExt) exts.push(langExt);
    return exts;
  }, [language]);

  const editorTheme = theme === 'dark' ? tokyoNight : githubLight;

  return (
    <CodeMirror
      className="editor-host"
      value={value}
      onChange={onChange}
      theme={editorTheme}
      extensions={extensions}
      readOnly={readOnly}
      placeholder={placeholder}
      height={height}
      minHeight={minHeight}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        bracketMatching: true,
        closeBrackets: true,
        highlightActiveLine: !readOnly,
        highlightSelectionMatches: true,
        searchKeymap: true,
      }}
    />
  );
}
