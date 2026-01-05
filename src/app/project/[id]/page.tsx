'use client'
import { useParams } from 'next/navigation';
import ScreenplayEditor from '@/components/Editor';
import { useState } from 'react';

export default function ProjectPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  
  if (!params?.id) {
    return <div className="text-white p-8">Loading Project...</div>;
  }

  return (
    <ScreenplayEditor 
    projectId={params.id as string} 
    setLoading={setLoading}
/>
  );
}