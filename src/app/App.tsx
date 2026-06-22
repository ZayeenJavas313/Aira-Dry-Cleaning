import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LandingPage } from '../pages/LandingPage';
import { Sidebar, TopNav } from '../components/Layout';
import { NotificationPanel } from '../components/NotificationPanel';
import { PembayaranPage } from '../pages/PembayaranPage';
import {
  DashboardPage, TransaksiPage, PelangganPage, LayananPage,
  StatusPage, LaporanPage, PenggunaPage, ProfilPage, PesanPage,
} from '../pages/DashboardPages';
import { api } from '../lib/api';
import type { Page } from '../lib/types';
import { LoadingSpinner } from '../components/ui-primitives';

function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem('aira_dark') === 'true');

  const toggle = () => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('aira_dark', String(next));
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  return { dark, toggle };
}

function MainApp() {
  const { user, logout, loading } = useAuth();
  const { dark, toggle: toggleDark } = useDarkMode();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.getUnreadCount().then(res => setUnreadCount(res.data.count)).catch(() => {});
    const interval = setInterval(() => {
      api.getUnreadCount().then(res => setUnreadCount(res.data.count)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} />;
      case 'pesan': return <PesanPage />;
      case 'transaksi': return <TransaksiPage role={user.role} />;
      case 'pelanggan': return <PelangganPage role={user.role} />;
      case 'layanan': return <LayananPage role={user.role} />;
      case 'status': return <StatusPage role={user.role} />;
      case 'pembayaran': return <PembayaranPage />;
      case 'laporan': return <LaporanPage />;
      case 'pengguna': return <PenggunaPage />;
      case 'profil': return <ProfilPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        role={user.role}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={logout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0">
        <TopNav
          currentPage={currentPage}
          userName={user.name}
          role={user.role}
          dark={dark}
          onToggleDark={toggleDark}
          onOpenSidebar={() => setSidebarOpen(true)}
          unreadCount={unreadCount}
          onToggleNotifications={() => setNotifOpen(!notifOpen)}
        />
        <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        <main className="flex-1 p-5 lg:p-7 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { dark, toggle } = useDarkMode();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage dark={dark} onToggleDark={toggle} /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage dark={dark} onToggleDark={toggle} /></PublicRoute>} />
      <Route path="/app/*" element={<MainApp />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}
