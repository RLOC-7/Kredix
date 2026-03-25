import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowDownToLine, ArrowUpFromLine, Info, History } from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../services/api';

export default function Investments() {
  const toast = useToast();
  const [bankData, setBankData] = useState({
    bankBalance: 0,
    investmentBalance: 0,
    loading: true
  });
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const data = await api.get('/user/extract');
      setBankData({ ...data, loading: false });

      const histData = await api.get('/transaction/history');
      // Filter only investment related transactions if we want, or show all
      setHistory(histData || []);
    } catch (error) {
      console.error("Failed to load investment data:", error);
      setBankData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for SSE refresh
    const handleRefresh = () => fetchData();
    window.addEventListener('kredix:refresh_data', handleRefresh);
    return () => window.removeEventListener('kredix:refresh_data', handleRefresh);
  }, []);

  const handleAction = async (type) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Valor Inválido', { description: 'Por favor, insira um valor positivo.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = type === 'investir' ? '/transaction/invest' : '/transaction/redeem';
      const response = await api.post(endpoint, { amount: parseFloat(amount) });
      
      setBankData({ ...response, loading: false });
      setAmount('');
      toast.success(type === 'investir' ? 'Aplicação Realizada!' : 'Resgate Realizado!', { 
        description: `R$ ${parseFloat(amount).toLocaleString('pt-BR')} movimentados com sucesso.` 
      });
      
      // Refresh history
      const histData = await api.get('/transaction/history');
      setHistory(histData || []);
    } catch (error) {
      toast.error('Ocorreu um Erro', { description: error.message || 'Não foi possível completar a operação.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-foreground">Investimentos Premium ✦</h1>
          <p className="text-muted-foreground">Faça seu dinheiro trabalhar para você com rendimentos exclusivos.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Card */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel bg-gradient-to-br from-brand-900/40 to-brand-600/10 border-brand-500/20"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-brand-300 font-medium mb-1">Saldo Total Investido</p>
                  <h2 className="text-5xl font-bold tracking-tight text-white mb-2">
                    {bankData.loading ? '...' : `R$ ${(bankData.investmentBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-sm border border-brand-500/30">
                    <TrendingUp className="w-4 h-4" />
                    +50% ao dia
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground mb-1">Disponível para Investir</p>
                  <p className="text-xl font-bold text-white">
                    {bankData.loading ? '...' : `R$ ${(bankData.bankBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </p>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0,00"
                      className="glass-input w-full pl-12 text-lg font-bold"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleAction('investir')}
                      disabled={isSubmitting}
                      className="glass-button-primary flex-1 py-4 flex items-center justify-center gap-2"
                    >
                      <ArrowUpFromLine className="w-5 h-5" />
                      Investir
                    </button>
                    <button 
                      onClick={() => handleAction('resgatar')}
                      disabled={isSubmitting}
                      className="glass-button-secondary flex-1 py-4 flex items-center justify-center gap-2"
                    >
                      <ArrowDownToLine className="w-5 h-5" />
                      Resgatar
                    </button>
                  </div>
                </div>
                
                <div className="glass card p-4 border-white/5 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-2 text-brand-400 mb-2">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Como Funciona?</span>
                  </div>
                  <p className="text-sm text-brand-100/70 leading-relaxed">
                    Todo saldo que você move para investimentos rende automaticamente 50% todos os dias à meia-noite. O resgate é instantâneo e sem taxas.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* History Table */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-brand-500" />
                <h3 className="text-xl font-bold">Histórico de Aplicações</h3>
              </div>
              
              <div className="space-y-3">
                {history.filter(t => ['INVEST', 'REDEEM', 'YIELD'].includes(t.type)).length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">Nenhuma movimentação de investimento encontrada.</p>
                ) : (
                  history.filter(t => ['INVEST', 'REDEEM', 'YIELD'].includes(t.type)).map((tr, i) => (
                    <div key={tr.id || i} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tr.type === 'INVEST' ? 'bg-orange-500/20 text-orange-500' : 
                          tr.type === 'YIELD' ? 'bg-brand-500/20 text-brand-500' : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {tr.type === 'INVEST' ? <ArrowUpFromLine className="w-5 h-5" /> : 
                           tr.type === 'YIELD' ? <TrendingUp className="w-5 h-5" /> : <ArrowDownToLine className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold">{tr.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tr.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tr.type === 'REDEEM' ? 'text-white' : 'text-brand-400'}`}>
                          {tr.type === 'REDEEM' ? '- ' : '+ '} R$ {(tr.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Confirmado</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Side Panel: Insights */}
          <div className="space-y-6">
            <div className="glass-panel bg-white/5 border-white/10">
              <h3 className="font-bold text-lg mb-4">Projeção de Ganhos</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-black/20">
                  <p className="text-xs text-muted-foreground mb-1">Em 1 dia (50%)</p>
                  <p className="text-lg font-bold text-brand-400">
                    + R$ {((bankData.investmentBalance || 0) * 0.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/20">
                  <p className="text-xs text-muted-foreground mb-1">Em 7 dias (Acumulado)</p>
                  <p className="text-lg font-bold text-brand-500">
                    + R$ {((bankData.investmentBalance || 0) * (Math.pow(1.5, 7) - 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 leading-tight italic">
                * Projeções baseadas em juros compostos diários. Rendimentos passados não garantem lucros futuros.
              </p>
            </div>

            <div className="glass-card p-6 border-brand-500/20 bg-brand-500/5">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="font-bold mb-2">Clube de Investidores</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Alcance R$ 100.000 investidos e desbloqueie o cartão **Kredix Carbon Black**.
              </p>
              <button className="text-xs font-bold text-brand-500 hover:text-brand-400 transition-colors uppercase tracking-widest">
                Saiba Mais →
              </button>
            </div>
          </div>

        </div>

      </div>
  );
}
