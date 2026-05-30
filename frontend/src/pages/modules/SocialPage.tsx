import { useState } from 'react';
import { Share2, Calendar, Plus } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

const platforms = ['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'X (Twitter)'];

const scheduledPosts = [
  { id: '1', platform: 'Instagram', content: 'New product launch teaser 🚀', date: '2026-05-31 10:00', status: 'scheduled' },
  { id: '2', platform: 'LinkedIn', content: 'Industry insights: The future of AI marketing', date: '2026-06-01 09:00', status: 'scheduled' },
  { id: '3', platform: 'TikTok', content: 'Behind the scenes of our latest campaign', date: '2026-06-01 18:00', status: 'draft' },
  { id: '4', platform: 'X (Twitter)', content: 'Thread: 10 marketing hacks that actually work 🧵', date: '2026-06-02 12:00', status: 'scheduled' },
];

export default function SocialPage() {
  const [newPost, setNewPost] = useState({ platform: 'instagram', content: '', scheduleDate: '' });

  return (
    <ModuleLayout title="Social Media Manager" description="Schedule posts, manage content calendar, and generate captions"
      actions={<Button><Plus size={18} /> New Post</Button>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-4">Create Post</h3>
          <div className="space-y-4">
            <Select label="Platform" options={platforms.map((p) => ({ value: p.toLowerCase(), label: p }))}
              value={newPost.platform} onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })} />
            <Textarea label="Content" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Write your post or let AI generate..." />
            <input type="datetime-local" className="input-glass" value={newPost.scheduleDate}
              onChange={(e) => setNewPost({ ...newPost, scheduleDate: e.target.value })} />
            <div className="flex gap-2">
              <Button className="flex-1">Schedule</Button>
              <Button variant="secondary" className="flex-1">AI Generate</Button>
            </div>
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} style={{ color: 'var(--primary-color)' }} />
              <h3 className="font-semibold">Content Calendar</h3>
            </div>
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <Share2 size={18} style={{ color: 'var(--primary-color)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary">{post.platform}</span>
                      <span className={`badge ${post.status === 'scheduled' ? 'badge-success' : 'badge-warning'}`}>{post.status}</span>
                    </div>
                    <p className="text-sm mt-1 truncate">{post.content}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-5 gap-3">
            {platforms.map((p) => (
              <GlassCard key={p} className="text-center !p-4">
                <Share2 size={20} className="mx-auto mb-2" style={{ color: 'var(--primary-color)' }} />
                <p className="text-xs font-medium">{p}</p>
                <p className="text-lg font-bold mt-1">{Math.floor(Math.random() * 20 + 5)}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>scheduled</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
