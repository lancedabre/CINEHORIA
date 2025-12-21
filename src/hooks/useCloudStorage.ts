import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Descendant } from 'slate';

const INITIAL_STATE = [{ type: 'paragraph', children: [{ text: '' }] }] as unknown as Descendant[];

export const useCloudStorage = (projectId: string) => {
  const supabase = createClient();
  const [content, setContent] = useState<Descendant[]>(INITIAL_STATE);
  const [title, setTitle] = useState('Untitled Screenplay');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // 1. Fetch Data
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
      
      if (data) {
        if (data.content && Array.isArray(data.content) && data.content.length > 0) {
            setContent(data.content);
        }
        setTitle(data.title || 'Untitled Screenplay');
      }
      setLoading(false);
    };
    if (projectId) fetchProject();
  }, [projectId]);

  // 2. Save Function (Debounced)
  const saveToCloud = useCallback(async (newContent: Descendant[]) => {
    setSaveStatus('saving');
    // Note: In a real app, you'd use a debounce function (like lodash.debounce) here
    // to avoid hitting the DB on every keystroke.
    const { error } = await supabase
        .from('projects')
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq('id', projectId);
    
    if (error) console.error(error);
    setSaveStatus(error ? 'error' : 'saved');
  }, [projectId]);

  // 3. Title Update Function
  const updateTitle = async (newTitle: string) => {
    setTitle(newTitle);
    await supabase.from('projects').update({ title: newTitle }).eq('id', projectId);
  };

  return { content, title, updateTitle, loading, saveToCloud, saveStatus };
};