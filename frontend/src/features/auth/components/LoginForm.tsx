import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../contexts/AuthContext";

export function LoginForm() {
    const navigate = useNavigate()
    const { signIn } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()

        try {
            setIsLoading(true)
            await signIn({ email, password })
            navigate("/home")

        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (error.response && error.response.data) {
                alert(error.response.data.error)
            } else {
                    alert("Erro de conexão. Verifique o servidor.")
                }
            console.log(error)

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleLogin}>
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
            <a href="#" className="text-xs font-medium text-brand-500 hover:underline">
                Esqueci minha senha
            </a>
            </div>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
        </form>
    )
}