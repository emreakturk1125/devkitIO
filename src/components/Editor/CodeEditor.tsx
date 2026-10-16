import { useEffect, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
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

const languageLoaders: Partial<Record<EditorLanguage, () => Promise<Extension>>> = {
  javascript: () => import('@codemirror/lang-javascript').then((mod) => mod.javascript({ jsx: true })),
  typescript: () => import('@codemirror/lang-javascript').then((mod) => mod.javascript({ jsx: true, typescript: true })),
  json: () => import('@codemirror/lang-json').then((mod) => mod.json()),
  sql: () => import('@codemirror/lang-sql').then((mod) => mod.sql()),
  html: () => import('@codemirror/lang-html').then((mod) => mod.html()),
  css: () => import('@codemirror/lang-css').then((mod) => mod.css()),
  xml: () => import('@codemirror/lang-xml').then((mod) => mod.xml()),
  markdown: () => import('@codemirror/lang-markdown').then((mod) => mod.markdown()),
  python: () => import('@codemirror/lang-python').then((mod) => mod.python()),
  java: () => import('@codemirror/lang-java').then((mod) => mod.java()),
};

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
  const [langExt, setLangExt] = useState<Extension | null>(null);
  const [editorTheme, setEditorTheme] = useState<Extension | undefined>(undefined);

  useEffect(() => {
    const load = languageLoaders[language];
    if (!load) {
      setLangExt(null);
      return;
    }
    let cancelled = false;
    load().then((ext) => {
      if (!cancelled) setLangExt(ext);
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    let cancelled = false;
    const apply = (ext: Extension) => {
      if (!cancelled) setEditorTheme(ext);
    };
    if (theme === 'dark') {
      import('@uiw/codemirror-theme-tokyo-night').then((mod) => apply(mod.tokyoNight));
    } else {
      import('@uiw/codemirror-theme-github').then((mod) => apply(mod.githubLight));
    }
    return () => {
      cancelled = true;
    };
  }, [theme]);

  const extensions = useMemo(() => {
    const exts: Extension[] = [wordWrapExtension];
    if (langExt) exts.push(langExt);
    return exts;
  }, [langExt]);

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
