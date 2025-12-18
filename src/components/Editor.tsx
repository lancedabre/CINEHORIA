'use client'
import React, { useMemo, useCallback, useState, useRef } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { withScreenplayLogic, handleTabKey } from '@/hooks/useScreenplayLogic';
import { saveToDisk, loadFromDisk } from '@/utils/fileSystem';
import { exportToPdf } from '@/utils/pdfExporter';

const initialValue: Descendant[] = [{ type: 'scene-heading', children: [{ text: 'INT. START HERE' }] }];

export default function ScreenplayEditor() {
  const editor = useMemo(() => withScreenplayLogic(withHistory(withReact(createEditor()))), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorKey, setEditorKey] = useState(0);
  // The CSS Renderer
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case 'scene-heading': return <h3 {...attributes} className="font-bold uppercase mt-8 mb-4">{children}</h3>;
      case 'action':        return <p {...attributes} className="mb-4">{children}</p>;
      case 'character':     return <p {...attributes} className="mt-4 mb-0 ml-character-indent font-bold uppercase">{children}</p>;
      case 'dialogue':      return <div {...attributes} className="ml-dialogue-indent max-w-dialogue mb-0">{children}</div>;
      case 'parenthetical': return <p {...attributes} className="ml-parenthetical-indent max-w-parenthetical italic text-sm mb-0">{children}</p>;
      case 'transition':    return <p {...attributes} className="text-right uppercase font-bold mt-4 mb-4">{children}</p>;
      default:              return <p {...attributes}>{children}</p>;
    }
  }, []);
  const handleLoadProject = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const newContent = await loadFromDisk(file);
      
      setValue(newContent);
      
      // NEW: Force the Slate component to re-mount
      setEditorKey(prev => prev + 1);
      
      // Clear history so you can't "Undo" the file load
      editor.history.undos = [];
      editor.history.redos = [];

    } catch (error) {
      console.error(error);
      alert("Error loading file");
    } finally {
      if (event.target) event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-8">
      
      {/* --- UNIFIED TOOLBAR --- */}
      <div className="fixed top-4 bg-gray-800 text-white p-2 rounded shadow-lg flex gap-4 z-50 items-center border border-gray-700">
        
        {/* 1. SAVE BUTTON */}
        <button 
          onClick={() => saveToDisk(value)} 
          className="hover:text-green-400 font-medium transition-colors"
        >
          Save Project
        </button>

        <div className="w-px h-6 bg-gray-600"></div>

        {/* 2. LOAD BUTTON (Connected to the hidden input) */}
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="hover:text-blue-400 font-medium transition-colors"
        >
          Load Project
        </button>

        <div className="w-px h-6 bg-gray-600"></div>

        {/* 3. EXPORT BUTTON */}
        <button 
          onClick={() => exportToPdf(value)} 
          className="hover:text-red-400 font-bold transition-colors"
        >
          Export PDF
        </button>
      </div>

      {/* --- HIDDEN INPUT (The Engine Room) --- */}
      {/* This must stay in the DOM to make the Load button work, but it remains invisible */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept=".screenplay,.json" 
        onChange={handleLoadProject}
      />

      {/* --- THE PAPER (Editor) --- */}
      <div className="screenplay-page mt-16 font-courier text-[12pt] leading-tight text-black selection:bg-yellow-200 shadow-2xl">
        <Slate 
          key={editorKey} 
          editor={editor} 
          initialValue={value} 
          onChange={setValue}
        >
          <Editable 
            renderElement={renderElement}
            onKeyDown={(e) => handleTabKey(editor, e)}
            spellCheck={false}
            className="outline-none min-h-[10in]"
            placeholder="INT. SCENE HEADING - DAY"
          />
        </Slate>
      </div>

    </div>
  );
}