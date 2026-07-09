import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

export function LoginForm() {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErrorMessage(null);

        try {
            setIsLoading(true);
            await signIn({ email, password });
            navigate('/home');
        } catch (error) {
            const message =
                error instanceof AxiosError
                    ? error.response?.data?.error
                    : undefined;
            setErrorMessage(
                message ?? 'Erro de conexão. Verifique o servidor.',
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleLogin}>
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {errorMessage}
                </div>
            )}

            <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
            />

            <div className="space-y-1">
                <Input
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                <div className="flex justify-end pt-1">
                    <a
                        href="#"
                        className="text-xs font-medium text-brand-500 hover:underline"
                    >
                        Esqueci minha senha
                    </a>
                </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
        </form>
    );
}
