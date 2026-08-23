import { useState, useCallback, useEffect, useRef } from 'react';
import type { ToolDefinition } from '@/types/tool';
import { getToolById, getToolsByCategory } from '@/registry/toolRegistry';

export interface ToolboxActions {
  selectCategory: (categoryId: string | null) => void;
  selectTool: (toolId: string | null) => void;
  selectCategoryAndTool: (categoryId: string, toolId: string) => void;
  setInput: (value: string) => void;
  setSecondaryInput: (value: string) => void;
  setOption: (key: string, value: unknown) => void;
  transform: () => Promise<void>;
  clearInput: () => void;
  clearAll: () => void;
}

export interface ToolboxState {
  selectedCategoryId: string | null;
  selectedToolId: string | null;
  selectedTool: ToolDefinition | null;
  availableTools: ToolDefinition[];
  toolOptions: Record<string, unknown>;
  input: string;
  secondaryInput: string;
  output: string;
  error: string | null;
  isProcessing: boolean;
}

export function useToolbox(): ToolboxState & ToolboxActions {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [toolOptions, setToolOptions] = useState<Record<string, unknown>>({});
  const [input, setInputState] = useState('');
  const [secondaryInput, setSecondaryInputState] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const autoTransformTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedTool = selectedToolId ? getToolById(selectedToolId) ?? null : null;
  const availableTools = selectedCategoryId ? getToolsByCategory(selectedCategoryId) : [];

  // Initialize default options when tool changes
  useEffect(() => {
    if (selectedTool?.options) {
      const defaults: Record<string, unknown> = {};
      for (const opt of selectedTool.options) {
        defaults[opt.id] = opt.defaultValue ?? '';
      }
      setToolOptions(defaults);
    } else {
      setToolOptions({});
    }
    setInputState('');
    setSecondaryInputState('');
    setOutput('');
    setError(null);
  }, [selectedToolId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-transform for lightweight tools, and for generators that need no input
  useEffect(() => {
    if (!selectedTool) return;

    const noInputNeeded = selectedTool.requiresInput === false;
    if (!noInputNeeded && (!selectedTool.autoTransform || !input.trim())) return;

    if (autoTransformTimer.current) {
      clearTimeout(autoTransformTimer.current);
    }

    autoTransformTimer.current = setTimeout(() => {
      runTransform(selectedTool, input, secondaryInput, toolOptions);
    }, 150);

    return () => {
      if (autoTransformTimer.current) {
        clearTimeout(autoTransformTimer.current);
      }
    };
  }, [input, secondaryInput, toolOptions, selectedToolId]); // eslint-disable-line react-hooks/exhaustive-deps

  const runTransform = useCallback(
    async (
      tool: ToolDefinition,
      inputVal: string,
      secInput: string,
      options: Record<string, unknown>
    ) => {
      if (!tool) return;
      setIsProcessing(true);
      setError(null);

      try {
        const opts = { ...options, secondaryInput: secInput };
        const result = await tool.process(inputVal, opts);
        setOutput(result);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        setOutput('');
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const selectCategory = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedToolId(null);
    setToolOptions({});
    setInputState('');
    setSecondaryInputState('');
    setOutput('');
    setError(null);
  }, []);

  const selectTool = useCallback(
    (toolId: string | null) => {
      if (toolId !== selectedToolId) {
        setInputState('');
        setSecondaryInputState('');
      }
      setSelectedToolId(toolId);
      if (toolId) {
        const tool = getToolById(toolId);
        if (tool && tool.category !== selectedCategoryId) {
          setSelectedCategoryId(tool.category);
        }
      }
    },
    [selectedCategoryId, selectedToolId]
  );

  const selectCategoryAndTool = useCallback((categoryId: string, toolId: string) => {
    const changed = categoryId !== selectedCategoryId || toolId !== selectedToolId;
    setSelectedCategoryId(categoryId);
    setSelectedToolId(toolId);
    if (changed) {
      setInputState('');
      setSecondaryInputState('');
      setOutput('');
      setError(null);
    }
  }, [selectedCategoryId, selectedToolId]);

  const setInput = useCallback((value: string) => {
    setInputState(value);
  }, []);

  const setSecondaryInput = useCallback((value: string) => {
    setSecondaryInputState(value);
  }, []);

  const setOption = useCallback((key: string, value: unknown) => {
    setToolOptions((prev) => ({ ...prev, [key]: value }));
  }, []);

  const transform = useCallback(async () => {
    if (!selectedTool) return;
    await runTransform(selectedTool, input, secondaryInput, toolOptions);
  }, [selectedTool, input, secondaryInput, toolOptions, runTransform]);

  const clearInput = useCallback(() => {
    setInputState('');
    setSecondaryInputState('');
    setOutput('');
    setError(null);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedCategoryId(null);
    setSelectedToolId(null);
    setToolOptions({});
    setInputState('');
    setSecondaryInputState('');
    setOutput('');
    setError(null);
  }, []);

  return {
    selectedCategoryId,
    selectedToolId,
    selectedTool,
    availableTools,
    toolOptions,
    input,
    secondaryInput,
    output,
    error,
    isProcessing,
    selectCategory,
    selectTool,
    selectCategoryAndTool,
    setInput,
    setSecondaryInput,
    setOption,
    transform,
    clearInput,
    clearAll,
  };
}
