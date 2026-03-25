import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

export default function Dashboard() {
  const toast = useToast();
  const { user } = useAuth();
  const [bankData, setBankData] = useState({
    bankBalance: 0,
    cashBalance: 0,
    agency: '',
    account: '',
    loading: true
  });
  const [history, setHistory] = useState([]);

  // Load backend data
  useEffect(() => {
    async function fetchData() {
      try {
        const { api } = await import('../services/api');

        // Fetch Extract
        const data = await api.get('/user/extract');
        setBankData({ ...data, loading: false });

        // Fetch History
        const histData = await api.get('/transaction/history');
        setHistory(histData || []);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setBankData(prev => ({ ...prev, loading: false }));
        toast.error('Erro de Sincronização', { description: 'Não foi possível buscar seus dados financeiros mais recentes.' });
      }
    }
    fetchData();

    // Listen for SSE invalidation requests
    const handleRefresh = () => fetchData();
    window.addEventListener('kredix:refresh_data', handleRefresh);

    return () => {
      window.removeEventListener('kredix:refresh_data', handleRefresh);
    };
  }, [toast]);

  const getTransactionStyle = (type) => {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_IN':
        return { color: 'from-brand-500 to-brand-400', pos: true, icon: <ArrowDownToLine className="w-5 h-5 text-white" /> };
      case 'WITHDRAW':
        return { color: 'from-emerald-500 to-teal-400', pos: false, icon: <ArrowUpFromLine className="w-5 h-5 text-white" /> };
      case 'TRANSFER_OUT':
      default:
        return { color: 'from-gray-700 to-gray-900', pos: false, icon: <ArrowRightLeft className="w-5 h-5 text-white" /> };
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-foreground">Bem-vindo de volta, {user?.name || 'Usuário'} ✌️</h1>
            <p className="text-muted-foreground">Aqui está o que está acontecendo com suas finanças hoje.</p>
          </div>
        </div>

        {/* Feature Cards / Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <h3 className="text-muted-foreground font-medium mb-1 relative z-10">Saldo Bancário</h3>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {bankData.loading ? '...' : `R$ ${bankData.bankBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-500 text-sm font-medium">
              <TrendingUp className="w-3 h-3" />
              Atualizado agora
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-panel"
          >
            <h3 className="text-muted-foreground font-medium mb-1">Saldo em Espécie</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {bankData.loading ? '...' : `R$ ${bankData.cashBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-sm text-foreground">Agência: <span className="text-muted-foreground">{bankData.loading ? '-' : bankData.agency}</span></span>
              <span className="text-sm text-foreground">Conta: <span className="text-muted-foreground">{bankData.loading ? '-' : bankData.account}</span></span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-panel flex flex-col justify-between items-start"
          >
            <div>
              <h3 className="text-foreground font-bold text-lg mb-2">Seja Premium ✦</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">Ganhe limites maiores, cashback e um cartão de metal exclusivo.</p>
            </div>
            <button className="glass-button-secondary text-sm px-5 py-2 mt-4 ml-auto font-medium">
              Explorar Plano
            </button>
          </motion.div>
        </div>

        {/* Recent Transactions List (Glassmorphism design) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Transações Recentes</h2>
            <button className="text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors">Ver Todas</button>
          </div>

          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma transação encontrada.</p>
            ) : (
              history.slice(0, 10).map((tr, i) => {
                const style = getTransactionStyle(tr.type);
                const dateObj = new Date(tr.createdAt);

                return (
                  <div key={tr.id || i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-linear-to-br ${style.color} flex items-center justify-center text-white font-bold shadow-sm`}>
                        {style.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-brand-500 transition-colors">{tr.description || tr.type}</p>
                        <p className="text-xs text-muted-foreground">{tr.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${style.pos ? 'text-brand-500' : 'text-foreground'}`}>
                        {style.pos ? '+ ' : '- '} R$ {tr.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

      </div>
  );
}
