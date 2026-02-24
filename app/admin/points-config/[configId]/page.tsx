import { ConfigurationEditor } from '@/app/components/admin/points/ConfigurationEditor';

interface PageProps {
  params: {
    configId: string;
  };
}

export default function ConfigurationEditorPage({ params }: PageProps) {
  return <ConfigurationEditor configId={params.configId} />;
}
