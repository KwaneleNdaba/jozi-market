"use client"
import { ConfigurationEditor } from '@/app/components/admin/points/ConfigurationEditor';
import { Suspense } from 'react';

interface PageProps {
  params: {
    configId: string;
  };
}

export default function ConfigurationEditorPage({ params }: PageProps) {
  return <Suspense><ConfigurationEditor configId={params.configId} /></Suspense>;
}
