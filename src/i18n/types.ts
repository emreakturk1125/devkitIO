export type Locale = 'en' | 'tr';

export interface ToolLocale {
  name: string;
  description: string;
}

export interface Messages {
  ui: {
    clientSide: string;
    searchTools: string;
    searchPlaceholder: string;
    noToolsFound: string;
    toggleTheme: string;
    language: string;
    loadingTools: string;
    menu: string;
    favorites: string;
    allCategories: string;
    none: string;
    category: string;
    tool: string;
    options: string;
    selectCategory: string;
    selectTool: string;
    addFavorite: string;
    removeFavorite: string;
    transform: string;
    generate: string;
    processing: string;
    input: string;
    output: string;
    diffResult: string;
    paste: string;
    clear: string;
    expand: string;
    exit: string;
    exitFullscreen: string;
    fullscreen: string;
    pasteFromClipboard: string;
    clearInput: string;
    copy: string;
    copied: string;
    download: string;
    downloadOutput: string;
    linesChars: string;
    original: string;
    modified: string;
    pasteOriginal: string;
    pasteModified: string;
    resultPlaceholder: string;
    pasteData: string;
    inputNotRequired: string;
    faq: string;
    privacyNote: string;
    faqFree: string;
    faqFreeAnswer: string;
    faqPrivacy: string;
    faqPrivacyAnswer: string;
    faqInstall: string;
    faqInstallAnswer: string;
    pageNotFound: string;
    pageNotFoundHint: string;
    goHome: string;
    homeHeading: string;
    homeIntro: string;
  };
  categories: Record<string, { name: string; description: string }>;
  tools: Record<string, ToolLocale>;
  /** English source label → localized label (option labels & select values) */
  labels: Record<string, string>;
}
