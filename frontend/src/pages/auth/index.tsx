import { Package } from 'lucide-react';
import { useState } from 'react';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { RegisterForm } from '../../features/auth/components/RegisterForm';

export function Auth() {
    const [authMode, setAuthMode] = useState<'login' | 'cadastro'>('login');

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-50 py-10 px-4">
            
            <header className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                    <Package size={32} strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">CountIq</h1>
                <p className="text-gray-500">Gestão e contagem inteligente</p>
            </header>

            <main className="w-full max-w-[450px] rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                
                <div className="mb-8 flex rounded-xl bg-brand-50 p-1.5">
                    <button
                        onClick={() => setAuthMode('login')}
                        className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                            authMode === 'login' 
                                ? 'bg-white text-brand-500 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setAuthMode('cadastro')}
                        className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                            authMode === 'cadastro' 
                                ? 'bg-white text-brand-500 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Cadastro
                    </button>
                </div>

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {authMode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {authMode === 'login' 
                            ? 'Faça login para acessar o sistema' 
                            : 'Preencha os dados para começar'}
                    </p>
                </div>

                {authMode === 'login' ? <LoginForm /> : <RegisterForm />}

            </main>
        </div>
    );
}