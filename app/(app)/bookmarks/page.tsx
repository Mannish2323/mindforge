'use client';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const router = useRouter();
  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <EmptyState
        variant="empty"
        icon={<Bookmark className="w-10 h-10" />}
        title="No Bookmarks Yet"
        description="Bookmark vocabulary words, kanji, and grammar points for quick access. Look for the 🔖 icon on any card."
        action={<Button variant="primary" onClick={() => router.push('/vocabulary')}>Browse Vocabulary</Button>}
      />
    </div>
  );
}
