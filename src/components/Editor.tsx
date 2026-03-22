"use client";
import React, {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import { createEditor, Descendant, Transforms, Editor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  ReactEditor,
  RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";
import { withScreenplayLogic, handleTabKey } from "@/hooks/useScreenplayLogic";
import { saveToDisk } from "@/utils/fileSystem";
import { exportToPdf } from "@/utils/pdfExporter";
import { ScreenplayType } from "@/types/screenplay";
import { useCloudStorage } from "@/hooks/useCloudStorage";
import { useRouter } from "next/navigation";
import {
  Save,
  FileText,
  FolderOpen,
  FileJson,
  Bold,
  Italic,
  Underline,
  Bookmark,   // Added
  Plus,       // Added
  FileInput,  // Added
  FileOutput, // Added
} from "lucide-react";
import Link from "next/link";

interface EditorProps {
  projectId: string;
  setLoading: (loading: boolean) => void;
}

export default function ScreenplayEditor({
  projectId,
}: EditorProps) {
  const router = useRouter();
  const { content, title, updateTitle, loading, saveToCloud, saveStatus } =
    useCloudStorage(projectId);
  const INITIAL_EMPTY_STATE = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    } as any,
  ];

  const [value, setValue] = useState<Descendant[]>(INITIAL_EMPTY_STATE);
  const [editorKey, setEditorKey] = useState("initial-load");
  const [projectTitle, setProjectTitle] = useState("Untitled");



  const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor);
    // @ts-ignore
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };
  const handleEditorChange = (newValue: Descendant[]) => {
    setValue(newValue);
    saveToCloud(newValue);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setProjectTitle(newTitle); // Update Local (Screen)
    updateTitle(newTitle);     // Update Database (Cloud)
  };



  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { children, attributes, leaf } = props;
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    return <span {...attributes}>{children}</span>;
  }, []);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const editor = useMemo(
    () => withScreenplayLogic(withHistory(withReact(createEditor()))),
    []
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadLocalFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!Array.isArray(json)) throw new Error("Invalid file format");
      setValue(json);
      setEditorKey(Date.now().toString());
      saveToCloud(json);
      alert("Script loaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to load file. Is it a valid JSON?");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  useEffect(() => {
    if (loading) return;

    //Validation
    const isIncomingDataValid =
      content && Array.isArray(content) && content.length > 0;

    //Check if editor is empty (Safe to overwrite?)
    const isEditorEmpty =
      !value ||
      value.length === 0 ||
      (value.length === 1 &&
        (value[0] as any).type === "paragraph" &&
        !(value[0] as any).children[0].text);

    //SCENARIOS

    // Scenario 1: First Real Load -> Load & Force Refresh
    if (!hasLoaded && isIncomingDataValid) {
      console.log("Loaded Script from Cloud");
      setValue(content);
      setHasLoaded(true);
      setEditorKey(Date.now().toString());
    }

    // Scenario 2: Late Data Arrival -> Load & Force Refresh (Only if safe)
    else if (hasLoaded && isEditorEmpty && isIncomingDataValid) {
      console.log("Late Data Arrival - Updating Empty Editor");
      setValue(content);
      setEditorKey(Date.now().toString());
    }

    // Scenario 3: Fallback (No data found)
    else if (!hasLoaded && !isIncomingDataValid) {
      setValue(INITIAL_EMPTY_STATE);
      setHasLoaded(true);
    }

    if (title && !hasLoaded) setProjectTitle(title);
  }, [loading, content, title, hasLoaded, value]);
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;
    if (!element) return <p {...attributes}>{children}</p>;

    switch (element.type) {
      case "scene-heading":
        return (
          <h3
            {...attributes}
            className="mt-8 mb-3 text-left w-full"
            style={{ textTransform: "uppercase" }}
          >
            {children}
          </h3>
        );
      case "action":
        return (
          <p {...attributes} className="mb-3 text-left">
            {children}
          </p>
        );
      case "character":
        return (
          <p
            {...attributes}
            className="mt-3 mb-0"
            style={{ marginLeft: "2.2in", textTransform: "uppercase" }}
          >
            {children}
          </p>
        );
      case "dialogue":
        return (
          <div
            {...attributes}
            className="mb-0"
            style={{ marginLeft: "1.0in", maxWidth: "35ch" }}
          >
            {children}
          </div>
        );
      case "parenthetical":
        return (
          <p
            {...attributes}
            className="mb-0 text-sm text-black"
            style={{ marginLeft: "2.0in", maxWidth: "15ch" }}
          >
            {/* 2. The Opening Bracket (Undeletable) */}
            <span contentEditable={false} className="select-none mr-1px">
              (
            </span>

            {/*The Actual Text */}
            {children}

            {/* 3. The Closing Bracket (Undeletable) */}
            <span contentEditable={false} className="select-none ml-1px">
              )
            </span>
          </p>
        );
      case "transition":
        return (
          <p
            {...attributes}
            className="text-right mt-3 mb-3"
            style={{ textTransform: "uppercase" }}
          >
            {children}
          </p>
        );
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  const toggleBlock = useCallback(
    (format: ScreenplayType) => {
      Transforms.setNodes(editor, { type: format });
      ReactEditor.focus(editor);
    },
    [editor]
  );

  if (loading || value.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading Script...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans">
      {/* --- LEFT SIDEBAR/The Taskbar --- */}
      <aside className="w-24 bg-black border-r border-gray-900 flex flex-col items-center py-3 gap-3 z-50 shadow-xl overflow-y-auto custom-scrollbar">
        {/* Cloud Status */}
        <div
          title={saveStatus === "saving" ? "Saving..." : "Saved"}
          className="mb-2"
        >
          <span className="text-xs">
            {saveStatus === "saving" ? "☁️" : "saved"}
          </span>
        </div>

        {/* File Menu*/}
        <div className="relative w-full px-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full aspect-square hover:bg-gray-600/60 rounded-4xl flex flex-col items-center justify-center text-white transition-colors gap-1"
          >
            <FolderOpen size={20} />
          </button>

          {/* POPUP MENU */}
          {isMenuOpen && (
            <>
              {/* BLURRED BACKDROP */}
              <div
                className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* IMAGE MENU CARD */}
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-[2rem] z-[100] shadow-[0_20px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Background Image (Make sure to add your image to the /public folder!) */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/save-bg.jpg')" }} // Change this to your actual image file name
                />

                {/* Optional: Subtle dark gradient at the bottom so the menu pill pops against light grass */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* SLEEK HORIZONTAL PILL MENU (Positioned at bottom center) */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black px-8 py-3.5 rounded-full flex items-center gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/5">

                  {/* Save */}
                  <button
                    onClick={() => {
                      saveToCloud(value);
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-gray-400 hover:scale-110 transition-all duration-200"
                    title="Save to Cloud"
                  >
                    <Bookmark size={20} strokeWidth={2.5} />
                  </button>

                  {/* Open */}
                  <button
                    onClick={() => router.push("/")}
                    className="text-white hover:text-gray-400 hover:scale-110 transition-all duration-200"
                    title="Open Project"
                  >
                    <Plus size={22} strokeWidth={2.5} />
                  </button>

                  {/* Import */}
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-gray-400 hover:scale-110 transition-all duration-200"
                    title="Import Script"
                  >
                    <FileInput size={20} strokeWidth={2.5} />
                  </button>

                  {/* Export .cinehoria */}
                  <button
                    onClick={() => {
                      saveToDisk(value, projectTitle);
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-gray-400 hover:scale-110 transition-all duration-200"
                    title="Export .cinehoria"
                  >
                    <FileOutput size={20} strokeWidth={2.5} />
                  </button>

                  {/* Export PDF */}
                  <button
                    onClick={() => {
                      exportToPdf(value);
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-gray-400 hover:scale-110 transition-all duration-200 relative"
                    title="Export PDF"
                  >
                    <FileText size={20} strokeWidth={2.5} />
                    <span className="absolute -bottom-2 -right-2 text-[8px] font-bold bg-white text-black px-1 rounded-sm">

                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-10 h-px bg-gray-700"></div>

        {/* Format Buttons*/}
        <div className="flex flex-col items-center justify-center align-left w-full px-2 gap-2">
          <FormatButton
            label="HEAD"
            format="scene-heading"
            onToggle={toggleBlock}
          />
          <FormatButton label="ACTION" format="action" onToggle={toggleBlock} />
          <FormatButton
            label="CHAR"
            format="character"
            onToggle={toggleBlock}
          />
          <FormatButton
            label="DIALOGUE"
            format="dialogue"
            onToggle={toggleBlock}
          />
          <FormatButton
            label="PARENS"
            format="parenthetical"
            onToggle={toggleBlock}
          />
          <FormatButton
            label="TRANS"
            format="transition"
            onToggle={toggleBlock}
          />
        </div>

        <div className="w-10 h-px bg-gray-700"></div>

        {/* Style Icons*/}
        <div className="flex flex-col gap-2 w-full px-3">
          <FormatIconButton
            icon={<Bold size={16} />}
            isActive={isMarkActive(editor, "bold")}
            onToggle={() => toggleMark(editor, "bold")}
          />
          <FormatIconButton
            icon={<Italic size={16} />}
            isActive={isMarkActive(editor, "italic")}
            onToggle={() => toggleMark(editor, "italic")}
          />
          <FormatIconButton
            icon={<Underline size={16} />}
            isActive={isMarkActive(editor, "underline")}
            onToggle={() => toggleMark(editor, "underline")}
          />
        </div>
      </aside>

      {/*RIGHT CONTENT AREA*/}
      <main className="flex-1 flex flex-col h-full relative">
        <div className="absolute top-6 right-10 flex flex-col items-end z-40">
          {/*Logo*/}
          <Link
            href="/"
            className="flex items-center gap-2 mb-1 opacity-50 hover:opacity-100 transition-opacity select-none cursor-pointer"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#ff99cc]">
              CINEHORIA
            </span>
            <div
              className="h-3 w-3 mb-0 bg-contain bg-no-repeat bg-left"
              style={{ backgroundImage: "url('/logo5.png')" }}
            ></div>
          </Link>
          <div className="w-50 h-px bg-gray-700 my-2"></div>
          <input
            type="text"
            value={projectTitle}
            onChange={handleTitleChange}
            className="w-[400px] bg-transparent text-right text-1xl font-bold text-white placeholder-gray-700 outline-none"
            placeholder="Untitled Screenplay"
          />
        </div>

        {/*CENTERED PAPER*/}
        <div className="flex-1 h-full w-full overflow-y-auto p-8 pb-96 scroll-smooth relative">
          <div
            className="screenplay-page mx-auto my-10 font-courier text-[12pt] leading-tight text-black selection:bg-gray-200 shadow-2xl bg-white min-h-[11in] w-[8.5in]"
            style={{
              paddingLeft: "1.5in",
              paddingRight: "0.8in", // <-- This is the magic adjustment
              paddingTop: "1in",
              paddingBottom: "1in"
            }}
          >            <Slate
            key={editorKey}
            editor={editor}
            initialValue={value}
            onChange={handleEditorChange}
          >
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                className="outline-none focus:outline-none focus:ring-0 min-h-[10in]"
                placeholder="INT. SCENE HEADING - DAY"
                spellCheck={false}
                onKeyDown={(e) => {
                  //SAFETY CHECK: If editor is empty or invalid, stop immediately.
                  if (!editor.children || editor.children.length === 0) return;

                  if ((e.ctrlKey || e.metaKey) && e.key === "1") {
                    e.preventDefault();
                    toggleBlock("scene-heading");
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === "2") {
                    e.preventDefault();
                    toggleBlock("action");
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === "3") {
                    e.preventDefault();
                    toggleBlock("character");
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === "4") {
                    e.preventDefault();
                    toggleBlock("dialogue");
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === "5") {
                    e.preventDefault();
                    toggleBlock("parenthetical");
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === "6") {
                    e.preventDefault();
                    toggleBlock("transition");
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === "b") {
                    e.preventDefault();
                    toggleMark(editor, "bold");
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === "i") {
                    e.preventDefault();
                    toggleMark(editor, "italic");
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === "u") {
                    e.preventDefault();
                    toggleMark(editor, "underline");
                  }
                  handleTabKey(editor, e);
                }}
              />
            </Slate>
          </div>
        </div>
      </main>

      {/* Hidden Input for loading files */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json,.screenplay,.cinehoria"
        onChange={handleLoadLocalFile}
      />
    </div>
  );
}

// Helper Component: FormatButton
interface FormatButtonProps {
  label: string;
  format: ScreenplayType;
  onToggle: (format: ScreenplayType) => void;
}

const FormatButton = ({ label, format, onToggle }: FormatButtonProps) => {
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        onToggle(format);
      }}
      className="
        w-full py-2 pl-3 text-left
        text-[9px] font-bold uppercase tracking-wider 
        text-gray-400 
        hover:bg-gray-600 hover:text-white 
        rounded-2xl transition-colors
      "
    >
      {label}
    </button>
  );
};

// Helper Component: FormatIconButton
interface IconBtnProps {
  icon: React.ReactNode;
  isActive: boolean;
  onToggle: () => void;
}

const FormatIconButton = ({ icon, isActive, onToggle }: IconBtnProps) => (
  <button
    onMouseDown={(e) => {
      e.preventDefault();
      onToggle();
    }}
    className={`
      p-2 w-full flex justify-center rounded transition-colors
      ${isActive
        ? "bg-white text-black shadow-sm"
        : "text-gray-400 hover:text-white hover:bg-gray-700"
      }
    `}
  >
    {icon}
  </button>
);
