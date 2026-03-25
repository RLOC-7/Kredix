import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Wallet } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen app-bg flex flex-col md:flex-row m-0 p-0 overflow-hidden">

      {/* Left: Form Area */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass-panel relative"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Wallet className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Kredix</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Bem-vindo de volta</h1>
          <p className="text-muted-foreground mb-8">Insira suas credenciais para acessar sua conta.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Senha</label>
                <a href="#" className="text-sm text-brand-500 hover:text-brand-400 transition-colors">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="glass-button-primary w-full py-3 flex items-center justify-center mt-6"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
              {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4 inline-block" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Não possui uma conta?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-400 font-medium transition-colors">
              Cadastre-se
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Visual Area */}
      <div className="hidden md:flex flex-1 relative bg-brand-950/20 items-center justify-center p-12 overflow-hidden border-l border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 w-full max-w-lg glass-card border-white/10 p-8"
        >
          <div className="flex gap-4 items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
              <Wallet className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Banco Premium</h3>
              <p className="text-brand-200/70 text-sm">Experimente o futuro das finanças.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-2 rounded-full w-full bg-white/5 overflow-hidden">
              <div className="h-full bg-brand-500 w-3/4 rounded-full"></div>
            </div>
            <div className="h-2 rounded-full w-4/5 bg-white/5 overflow-hidden">
              <div className="h-full bg-emerald-400 w-1/2 rounded-full"></div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-brand-200/60 text-sm mb-1">Saldo Atual</p>
              <p className="text-3xl font-bold tracking-tight text-white">R$ 24.500<span className="text-brand-500 text-lg">,00</span></p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-medium border border-brand-500/30">
              +50% Dia
            </div>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
