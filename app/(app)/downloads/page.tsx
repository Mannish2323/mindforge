'use client';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';

export default function DownloadsPage() {
  const router = useRouter();
  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <EmptyState
        variant="locked"
        icon={<Download className="w-10 h-10" />}
        title="Offline Downloads"
        description="Download lessons for offline use. Available on Pro plan. Upgrade to access this feature."
        action={<Button variant="primary" onClick={() => router.push('/billing')}>Upgrade to Pro</Button>}
      />
    </div>
  );
}
