import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import { Download, Upload, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Transfers() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('deposit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [amount, setAmount] = useState('');
  const [targetAccount, setTargetAccount] = useState('');

  const [bankData, setBankData] = useState({
    bankBalance: 0,
    cashBalance: 0,
    loading: true
  });

  const fetchExtract = async () => {
    try {
      const data = await api.get('/user/extract');
      setBankData({ ...data, loading: false });
    } catch (error) {
      console.error("Failed to load bank data:", error);
      setBankData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchExtract();

    const handleRefresh = () => fetchExtract();
    window.addEventListener('kredix:refresh_data', handleRefresh);

    return () => {
      window.removeEventListener('kredix:refresh_data', handleRefresh);
    };
  }, []);

  const handleTransaction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert string amount to Double format
    const numericAmount = parseFloat(amount.replace(',', '.'));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Valor Inválido', { description: 'Por favor, insira um valor positivo.' });
      setIsSubmitting(false);
      return;
    }

    try {
      if (activeTab === 'deposit') {
        await api.post('/transaction/deposit', { amount: numericAmount });
        toast.success('Depósito Concluído', { description: `R$ ${numericAmount.toFixed(2)} enviado para sua conta bancária.` });
      } else if (activeTab === 'withdraw') {
        await api.post('/transaction/withdraw', { amount: numericAmount });
        toast.success('Saque Concluído', { description: `R$ ${numericAmount.toFixed(2)} retirado para seu saldo em espécie.` });
      } else if (activeTab === 'transfer') {
        await api.post('/transaction/transfer', { amount: numericAmount, targetAccount: parseInt(targetAccount, 10) });
        toast.success('Transferência Concluída', { description: `R$ ${numericAmount.toFixed(2)} enviado para a conta #${targetAccount}.` });
      }

      // Reset form on success
      setAmount('');
      setTargetAccount('');

      // Immediately refresh extract
      await fetchExtract();

    } catch (error) {
      toast.error('Operação Falhou', { description: error.message || 'O servidor recusou a transação.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'deposit', label: 'Depositar', icon: Download },
    { id: 'withdraw', label: 'Sacar', icon: Upload },
    { id: 'transfer', label: 'Transferir', icon: ArrowRightLeft },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Mova seu dinheiro</h1>
        <p className="text-muted-foreground">Deposite, saque ou transfira fundos instantaneamente via Kredix.</p>
      </div>

      {/* Balances Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
        >
          <h3 className="text-muted-foreground font-medium mb-1">Saldo Bancário Disponível</h3>
          <span className="text-3xl font-bold tracking-tight text-brand-500">
            {bankData.loading ? '...' : `R$ ${bankData.bankBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel"
        >
          <h3 className="text-muted-foreground font-medium mb-1">Saldo em Espécie Disponível</h3>
          <span className="text-3xl font-bold tracking-tight text-emerald-400">
            {bankData.loading ? '...' : `R$ ${bankData.cashBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </span>
        </motion.div>
      </div>

      {/* Transaction Area (Glass card with Tabs) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden border border-white/10"
      >
        {/* Tabs header */}
        <div className="flex border-b border-white/10 bg-black/5 dark:bg-white/5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setAmount(''); setTargetAccount(''); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors border-b-2",
                  isActive ? "border-brand-500 text-brand-500 bg-brand-500/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="p-8">
          <form onSubmit={handleTransaction} className="max-w-md space-y-6">

            <div className="space-y-4">
              {activeTab === 'transfer' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Número da Conta Destino</label>
                  <input
                    type="number"
                    required
                    value={targetAccount}
                    onChange={(e) => setTargetAccount(e.target.value)}
                    className="glass-input w-full"
                    placeholder="Ex: 53214"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Valor da Ação em Real (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="glass-input w-full pl-12 font-medium text-lg"
                    placeholder="0,00"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 inline-flex items-center">
                  {activeTab === 'deposit' && 'Mova fundos do seu Saldo em Espécie para o Banco.'}
                  {activeTab === 'withdraw' && 'Mova fundos do Banco para Espécie.'}
                  {activeTab === 'transfer' && 'Transfira fundos do seu Banco para outra Conta.'}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-button-primary w-full py-3.5 flex items-center justify-center"
              >
                {isSubmitting ? 'Processando...' : `Confirmar ${tabs.find(t => t.id === activeTab)?.label}`}
              </button>
            </div>

          </form>
        </div>
      </motion.div>

    </div>
  );
}
