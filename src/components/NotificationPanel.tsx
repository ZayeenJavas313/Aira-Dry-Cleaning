import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Notification } from '../lib/types';
import { X, CheckCheck } from 'lucide-react';

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    api.getNotifications()
      .then(res => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [open]);

  const markAllRead = async () => {
    await api.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const typeIcon: Record<string, string> = {
    laundry_diterima: '📥',
    laundry_proses: '⚙️',
    laundry_selesai: '✅',
    pembayaran: '💰',
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-16 right-4 z-50 w-80 max-h-[70vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-bold text-sm text-foreground">Notifikasi</h3>
          <div className="flex items-center gap-1">
            <button onClick={markAllRead} className="p-1.5 text-muted-foreground hover:text-violet-600 rounded-lg" title="Tandai semua dibaca">
              <CheckCheck size={15} />
            </button>
            <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg">
              <X size={15} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(70vh-48px)]">
          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Memuat...</div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Tidak ada notifikasi</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`px-4 py-3 border-b border-border last:border-0 ${!n.is_read ? 'bg-violet-50/50 dark:bg-violet-950/20' : ''}`}>
                <div className="flex gap-2">
                  <span className="text-base">{typeIcon[n.type] || '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(n.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
