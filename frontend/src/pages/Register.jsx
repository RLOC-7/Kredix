import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Wallet, Calendar } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    birth: '',
    cadStatus: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // RequestDTO wants: name, lastname, email, password, birth, cadStatus
    const success = await register(formData);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen app-bg flex flex-col md:flex-row m-0 p-0 overflow-hidden">
      
      {/* Left: Form Area */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative z-10 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass-panel relative my-auto py-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Wallet className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Kredix</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Criar Conta</h1>
          <p className="text-muted-foreground mb-8">Junte-se à experiência bancária premium.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="glass-input w-full pl-9" 
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sobrenome</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="lastname"
                    required
                    value={formData.lastname}
                    onChange={handleChange}
                    className="glass-input w-full px-4" 
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input w-full pl-9" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Data de Nascimento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="date" 
                  name="birth"
                  required
                  value={formData.birth}
                  onChange={handleChange}
                  className="glass-input w-full pl-9 [&::-webkit-calendar-picker-indicator]:opacity-50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input w-full pl-9" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="glass-button-primary w-full py-3 flex items-center justify-center mt-6"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
              {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4 inline-block" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já possui uma conta?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-400 font-medium transition-colors">
              Entrar
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Visual Area */}
      <div className="hidden md:flex flex-1 relative bg-brand-950/20 items-center justify-center p-12 overflow-hidden border-l border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-[0_0_40px_rgba(22,163,74,0.4)]">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Seu Dinheiro,<br/>Evoluído.</h2>
          <p className="text-brand-200/70 text-lg mx-auto max-w-sm">Junte-se a milhares de usuários desfrutando de zero taxas ocultas e benefícios premium exclusivos desde o primeiro dia.</p>
        </motion.div>
      </div>

    </div>
  );
}
