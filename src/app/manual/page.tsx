import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ManualPage() {
  return (
    <div className="bg-[#050505] text-white/80 min-h-screen font-sans selection:bg-white selection:text-black flex">
      
      {/* SIDEBAR NAVIGATION (Sticky) */}
      <aside className="w-64 fixed h-screen border-r border-white/10 p-8 hidden md:flex flex-col gap-8 overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors uppercase tracking-widest text-sm font-medium">
          <ChevronLeft size={16} />
          Back to Home
        </Link>

        <nav className="flex flex-col gap-4 text-sm tracking-wide mt-8">
          <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">Docs</h3>
          <a href="#features" className="hover:text-white transition-colors">Key Features</a>
          <a href="#dashboard" className="hover:text-white transition-colors">The Dashboard</a>
          <a href="#editor" className="hover:text-white transition-colors">The Editor</a>
          <a href="#file-menu" className="hover:text-white transition-colors">File Management</a>
          <a href="#shortcuts" className="hover:text-white transition-colors">Keyboard Shortcuts</a>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-8 md:p-16 lg:p-24 overflow-y-auto scroll-smooth">
        <div className="max-w-3xl space-y-24">
          
          <div>
            <h1 className="text-4xl font-light text-white mb-4">Manual</h1>
            <p className="text-lg font-light leading-relaxed">
              Welcome to Cinehoria. This guide covers everything you need to know to navigate the studio, format your screenplays, and manage your files.
            </p>
          </div>

          <hr className="border-white/10" />

          {/* SECTION: KEY FEATURES */}
          <section id="features" className="scroll-mt-24">
            <h2 className="text-2xl text-white font-medium mb-6 flex items-center gap-2">Key Features</h2>
            <ul className="space-y-4 font-light leading-relaxed">
              <li><strong className="text-white font-medium">Standardized Formatting:</strong> Automatically handles margins and styling for Scene Headings, Action, Characters, Dialogue, Parentheticals, and Transitions.</li>
              <li><strong className="text-white font-medium">Real-Time Cloud Save:</strong> Never lose a word. Typing syncs instantly to Supabase with smart debouncing.</li>
              <li><strong className="text-white font-medium">Race-Condition Proof:</strong> Advanced "One-Time Load" logic ensures your cursor never jumps and your data never gets wiped while typing.</li>
              <li><strong className="text-white font-medium">PDF Export:</strong> Professional industry-standard PDF generation with proper fonts (Courier Prime) and layout.</li>
              <li><strong className="text-white font-medium">Keyboard Shortcuts:</strong> Navigate and format without touching the mouse.</li>
              <li><strong className="text-white font-medium">Local Import/Export:</strong> Save backups as JSON (<code className="bg-white/10 px-1 rounded text-sm">.cinehoria</code>) and load them back anytime.</li>
            </ul>
          </section>

          {/* SECTION: DASHBOARD */}
          <section id="dashboard" className="scroll-mt-24">
            <h2 className="text-2xl text-white font-medium mb-6">The Dashboard</h2>
            <p className="font-light leading-relaxed mb-4">
              Your studio dashboard is where your screenplay collection lives. From the top navigation bar, you can quickly <strong>Import</strong> an existing <code className="bg-white/10 px-1 rounded text-sm">.cinehoria</code> file or start a <strong>New Project</strong>.
            </p>
            <p className="font-light leading-relaxed">
              Each project appears as a card displaying the screenplay's title and the date it was last edited. Click on any card to open the editor and pick up right where you left off.
            </p>
          </section>

          {/* SECTION: EDITOR */}
          <section id="editor" className="scroll-mt-24">
            <h2 className="text-2xl text-white font-medium mb-6">The Editor Interface</h2>
            <p className="font-light leading-relaxed mb-4">
              Cinehoria is designed for an ultra-focused environment. The central white page is your canvas. 
            </p>
            <p className="font-light leading-relaxed mb-4">
              <strong className="font-black">Element Sidebar:</strong> On the far left, you will find quick-access buttons to force a specific screenplay element formatting:<br></br>HEAD: scene heading,<br></br>ACTION: action,<br></br>CHAR: character name,<br></br>DIALOGUE: dialogue,<br></br>PARENS: Parentheticals,<br></br>TRANS: transition<br></br>as well as text styling (Bold, Italic, Underline).
            </p>
            <p className="font-light leading-relaxed">
              <strong className="font-black">Project Title:</strong> Look to the top right of the editor to see your project name (e.g., "Untitled Screenplay"). You can click directly on this text at any time to edit the name of your movie.
            </p>
          </section>

          {/* SECTION: FILE MENU */}
          <section id="file-menu" className="scroll-mt-24">
            <h2 className="text-2xl text-white font-medium mb-6">File Management & Export</h2>
            <p className="font-light leading-relaxed mb-4">
              To access file options, click the <strong>Folder Icon</strong> located in the left sidebar above the formatting tools.
            </p>
            <p className="font-light leading-relaxed">
              This triggers the file menu popup. From this window, you can use the icon dock to save your progress, open script from dashboard, import .cinehoria from device, export .cinehoria, and generate PDF.
            </p>
          </section>

          {/* SECTION: SHORTCUTS */}
          <section id="shortcuts" className="scroll-mt-24">
            <h2 className="text-2xl text-white font-medium mb-6">Keyboard Shortcuts</h2>
            <div className="overflow-x-auto border border-white/10 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-br border-white/10 bg-white/5 text-white uppercase text-sm tracking-wider">
                    <th className="py-4 px-6 font-medium">Action</th>
                    <th className="py-4 px-6 font-medium">Shortcut (Windows)</th>
                    <th className="py-4 px-6 font-medium">Shortcut (MacOS)</th>
                  </tr>
                </thead>
                <tbody className="font-light divide-y divide-white/10">
                  {[
                    ['Scene Heading', 'Ctrl + 1', 'Cmd + 1'],
                    ['Action', 'Ctrl + 2', 'Cmd + 2'],
                    ['Character', 'Ctrl + 3', 'Cmd + 3'],
                    ['Dialogue', 'Ctrl + 4', 'Cmd + 4'],
                    ['Parenthetical', 'Ctrl + 5', 'Cmd + 5'],
                    ['Transition', 'Ctrl + 6', 'Cmd + 6'],
                    ['Bold', 'Ctrl + B', 'Cmd + B'],
                    ['Italic', 'Ctrl + I', 'Cmd + I'],
                    ['Underline', 'Ctrl + U', 'Cmd + U'],
                  ].map(([action, win, mac]) => (
                    <tr key={action} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 text-white font-medium">{action}</td>
                      <td className="py-4 px-6"><kbd className="bg-white/10 px-2 py-1 rounded text-sm font-mono tracking-widest">{win}</kbd></td>
                      <td className="py-4 px-6"><kbd className="bg-white/10 px-2 py-1 rounded text-sm font-mono tracking-widest">{mac}</kbd></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="pb-32"></div> {/* Bottom padding for smooth scrolling clearance */}
        </div>
      </main>
    </div>
  );
}