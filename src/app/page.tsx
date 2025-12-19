'use client'
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, Plus, Trash2, FileText } from 'lucide-react'; // Make sure you have these icons

// Define what a "Project" looks like in our DB
type Project = {
  id: string;
  title: string;
  updated_at: string;
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Projects on Load
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false });

    if (error) console.error('Error fetching:', error);
    else setProjects(data || []);
    setLoading(false);
  }

  // 2. Create New Project Function
  async function createProject() {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ 
        title: 'Untitled Screenplay',
        content: [{ type: 'scene-heading', children: [{ text: 'INT. START HERE' }] }] 
      }])
      .select()
      .single();

    if (error) {
      alert("Failed to create project");
      console.error(error);
    } else if (data) {
      router.push(`/project/${data.id}`);
    }
  }

  // 3. Delete Project Function
  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Stop the link from clicking
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this script?")) return;

    await supabase.from('projects').delete().eq('id', id);
    fetchProjects(); // Refresh list
  };

  // 4. Import Project Function
  const handleImportProject = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Create a project using the FILE CONTENT
      const { data, error } = await supabase
        .from('projects')
        .insert([{ 
          title: file.name.replace('.screenplay', '').replace('.json', ''), // Use filename as title
          content: json 
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        router.push(`/project/${data.id}`);
      }

    } catch (err) {
      console.error(err);
      alert("Failed to import. Is this a valid script file?");
    } finally {
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">My Screenplays</h1>
            <p className="text-gray-400 mt-1 text-sm">Manage your scripts</p>
          </div>
          
          <div className="flex gap-3">
            {/* IMPORT BUTTON */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-all border border-gray-700"
            >
              <Upload size={18} />
              <span>Import</span>
            </button>

            {/* NEW PROJECT BUTTON */}
            <button 
              onClick={createProject}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg flex items-center gap-2"
            >
              <Plus size={18} />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Hidden Input for Import */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json,.screenplay" 
          onChange={handleImportProject}
        />

        {/* Project Grid */}
        {loading ? (
          <div className="text-gray-400 animate-pulse">Loading your work...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/project/${project.id}`}
                className="block group relative"
              >
                <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg hover:border-blue-500 hover:shadow-blue-900/20 transition-all h-full flex flex-col justify-between">
                  
                  {/* Top Row: Icon + Delete */}
                  <div className="flex justify-between items-start mb-4">
                     <div className="p-2 bg-gray-700/50 rounded text-blue-400">
                        <FileText size={20} />
                     </div>
                     <button
                        onClick={(e) => deleteProject(project.id, e)}
                        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                        title="Delete Script"
                      >
                        <Trash2 size={16} />
                      </button>
                  </div>

                  {/* Title & Date */}
                  <div>
                    {/* FONT FIX: We apply the font variable here to stop the warning */}
                    <h3 
                      className="text-xl font-semibold text-gray-200 group-hover:text-white truncate mb-2"
                      style={{ fontFamily: 'var(--font-courier), monospace' }} 
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Last edited: {new Date(project.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                </div>
              </Link>
            ))}
            
            {projects.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 border-2 border-dashed border-gray-800 rounded-lg">
                No scripts yet. Click "New Project" to start writing!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}