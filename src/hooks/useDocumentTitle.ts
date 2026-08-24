import { useEffect } from 'react';
import type { ToolDefinition } from '@/types/tool';

const BASE_TITLE = 'DevKit — Free Online Developer Tools';
const BASE_DESCRIPTION =
  'Free online developer toolkit — JSON formatter, SQL formatter, Base64 encoder, GUID generator, diff compare & 20+ tools. 100% client-side, your data never leaves your browser.';

/**
 * Dynamically updates document.title and meta[name="description"]
 * based on the currently selected tool. This improves SEO for
 * SPA pages by giving each tool a unique title and description.
 */
export function useDocumentTitle(selectedTool: ToolDefinition | null) {
  useEffect(() => {
    if (selectedTool) {
      document.title = `${selectedTool.name} — DevKit | Free Online Developer Tools`;

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          `${selectedTool.description} — Free online tool, 100% client-side. Your data never leaves your browser. Try it on DevKit.`
        );
      }
    } else {
      document.title = BASE_TITLE;

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', BASE_DESCRIPTION);
      }
    }
  }, [selectedTool]);
}
