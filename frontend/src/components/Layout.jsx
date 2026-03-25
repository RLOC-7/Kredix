import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  Settings, 
  LogOut, 
  CreditCard,
  TrendingUp,
  Bell,
  Search,
  Moon,
  Sun
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Cartões', path: '#' },
    { icon: ArrowRightLeft, label: 'Transferências', path: '/transfers' },
    { icon: TrendingUp, label: 'Investimentos', path: '/investments' },
  ];

  // SSE Real-Time Connection
  useEffect(() => {
    const token = localStorage.getItem('@Kredix:token');
    if (!token) return;

    // Use SSE EventSource via Vite Proxy on /api
    const sse = new EventSource(`/api/notifications/subscribe?token=${encodeURIComponent(token)}`);

    sse.addEventListener('ping', () => {
      // Just to keep connection alive, no action needed
    });

    sse.onopen = () => {
      console.log('SSE connection established for real-time notifications');
    };

    sse.addEventListener('connected', (event) => {
      console.log('SSE Handshake:', event.data);
    });

    sse.addEventListener('transfer', (event) => {
      console.log('Transfer notification received:', event.data);
      // Pop Notification
      toast.success('Você Recebeu um Pix!', { description: event.data });
      
      // Dispatch Global Refetch Event for active pages
      window.dispatchEvent(new Event('kredix:refresh_data'));
    });

    sse.onerror = (error) => {
      console.error('SSE connection lost or error.', error);
      sse.close();
    };

    return () => {
      console.log('Closing SSE connection');
      sse.close();
    };
  }, [toast]);

  return (
    <div className="app-bg flex h-screen text-foreground transition-colors duration-500 m-0 p-0 text-left">
      
      {/* Sidebar - Glassmorphism */}
      <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col p-6 z-10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Kredix</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-500/10 text-brand-500 font-medium' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-300">
            <Settings className="w-5 h-5" />
            Configurações
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-300 mt-1"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto z-0">
        
        {/* Header - Glass Navbar */}
        <header className="sticky top-0 z-20 glass border-b border-white/10 px-8 py-4 flex items-center justify-between">
          <div className="relative w-64 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="glass-input w-full pl-10"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-full border border-black/5 dark:border-white/10 hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            <button className="relative p-2.5 rounded-full border border-black/5 dark:border-white/10 hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-destructive animate-pulse-slow"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-brand-300 p-[2px]">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden border-2 border-background">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Felix'}&backgroundColor=b6e3f4`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content injected here */}
        <div className="flex-1">
          {children}
        </div>
        
      </main>
    </div>
  );
}
