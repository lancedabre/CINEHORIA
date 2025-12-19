import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Descendant } from 'slate';

export function useCloudStorage(projectId: string) {
  const [content, setContent] = useState<Descendant[] | null>(null);
  const [title, setTitle] = useState(''); // New State for Title
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  // 1. LOAD: Fetch content AND title
  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('content, title') // <--- Now fetching title too
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error loading:', error);
      } else if (data) {
        setContent(data.content || [{ type: 'scene-heading', children: [{ text: 'INT. START HERE' }] }]);
        setTitle(data.title || 'Untitled Screenplay');
      }
      setLoading(false);
    }

    if (projectId) fetchProject();
  }, [projectId]);

  // 2. SAVE CONTENT
  const saveToCloud = async (newContent: Descendant[]) => {
    setSaveStatus('saving');
    const { error } = await supabase
      .from('projects')
      .update({ content: newContent, updated_at: new Date() })
      .eq('id', projectId);

    if (error) setSaveStatus('error');
    else setSaveStatus('saved');
  };

  // 3. SAVE TITLE (New Function)
  const updateTitle = async (newTitle: string) => {
    setTitle(newTitle); // Update UI immediately
    
    // Save to DB (No loading state needed for this usually)
    const { error } = await supabase
      .from('projects')
      .update({ title: newTitle, updated_at: new Date() })
      .eq('id', projectId);

    if (error) console.error("Error saving title:", error);
  };

  return { content, title, loading, saveToCloud, updateTitle, saveStatus };
}