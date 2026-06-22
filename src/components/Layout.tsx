import {
  LayoutDashboard, Users, Receipt, Package, BarChart3, LogOut,
  X, Shirt, DollarSign, UserCheck, User, ShoppingCart,
} from 'lucide-react';
import {
  type Role, type Page, ROLE_LABELS, ROLE_BG, PAGE_TITLES, getNavItems,
} from '../lib/types';
import { Logo } from './landing/Logo';

const ICONS: Record<Page, React.ReactNode> = {
  dashboard: <LayoutDashboard size={17} />,
  pesan: <ShoppingCart size={17} />,
  pelanggan: <Users size={17} />,
  layanan: <Shirt size={17} />,
  transaksi: <Receipt size={17} />,
  status: <Package size={17} />,
  pembayaran: <DollarSign size={17} />,
  laporan: <BarChart3 size={17} />,
  pengguna: <UserCheck size={17} />,
  profil: <User size={17} />,
};

interface SidebarProps {
  role: Role;
  currentPage: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ role, currentPage, onNavigate, onLogout, open, onClose }: SidebarProps) {
  const navItems = getNavItems(role);

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full z-30 flex flex-col w-64 bg-sidebar transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 bg-sidebar-primary rounded-xl flex items-center justify-center">
            <Logo className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-sidebar-foreground text-sm leading-tight">Aira Laundry</div>
            <div className="text-sidebar-foreground/60 text-[11px]">Management System</div>
          </div>
          <button className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-2 bg-sidebar-accent rounded-lg px-3 py-2 border border-sidebar-border">
            <div className={`w-2 h-2 rounded-full ${ROLE_BG[role]}`} />
            <span className="text-xs text-sidebar-foreground/80 font-medium">{ROLE_LABELS[role]}</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-sidebar-primary/15 text-sidebar-primary font-semibold'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}>
              {ICONS[item.id]}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border">
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all">
            <LogOut size={17} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}

interface TopNavProps {
  currentPage: Page;
  userName: string;
  role: Role;
  dark: boolean;
  onToggleDark: () => void;
  onOpenSidebar: () => void;
  unreadCount: number;
  onToggleNotifications: () => void;
}

export function TopNav({ currentPage, userName, role, dark, onToggleDark, onOpenSidebar, unreadCount, onToggleNotifications }: TopNavProps) {
  return (
    <header className="sticky top-0 z-10 h-16 bg-background/80 backdrop-blur-sm border-b border-border flex items-center gap-4 px-5 lg:px-7">
      <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={onOpenSidebar}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold text-foreground truncate">{PAGE_TITLES[currentPage]}</h1>
        <p className="text-[11px] text-muted-foreground hidden sm:block">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <button onClick={onToggleNotifications} className="relative p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-card transition-colors">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-violet-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <button onClick={onToggleDark} className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-card transition-colors">
        {dark ? (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>

      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold ${ROLE_BG[role]}`}>
          {userName[0]}
        </div>
        <div className="hidden md:block">
          <div className="text-xs font-semibold text-foreground leading-tight">{userName}</div>
          <div className="text-[11px] text-muted-foreground">{ROLE_LABELS[role]}</div>
        </div>
      </div>
    </header>
  );
}
