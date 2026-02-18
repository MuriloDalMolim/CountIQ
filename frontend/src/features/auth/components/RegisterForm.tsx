import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../contexts/AuthContext";


function formatCNPJ(value: string) {
  return value
    .replace(/\D/g, '') 
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18)
}

export function RegisterForm() {

    const navigate = useNavigate()
    const {signUp} = useAuth()

    const [companyName, setCompanyName] = useState("")
    const [companyCnpj, setCompanyCnpj] = useState("")

    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault()

        const cleanCNPJ = companyCnpj.replace(/\D/g, '')
        if (cleanCNPJ.length !== 14) {
            alert("O CNPJ está incompleto.")
            return
        }

        try {
            setIsLoading(true)
            await signUp({
                companyName,
                companyCnpj,
                userName,
                userEmail,
                userPassword,
            })
            navigate("/home")

        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (error.response && error.response.data) {
                alert(error.response.data.error)
            } else {
                alert("Erro ao criar conta. Tente novamente.")
            }
            console.log(error)

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleRegister}>
            <Input 
                label="Nome da Empresa" 
                placeholder="Nome da sua empresa" 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                required
            />
            <Input 
                label="CNPJ" 
                placeholder="00.000.000/0000-00" 
                value={companyCnpj}
                onChange={e => setCompanyCnpj(formatCNPJ(e.target.value))}
                required
                maxLength={18}
                minLength={18}
            />

            <Input 
                label="Nome do Administrador" 
                placeholder="Seu nome de usuário" 
                value={userName}
                onChange={e => setUserName(e.target.value)}
                required   
            />
            <Input 
                label="Email" 
                type="email" 
                placeholder="seu@email.com" 
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                required
            />
            <Input 
                label="Senha" 
                type="password" 
                placeholder="••••••••" 
                value={userPassword}
                onChange={e => setUserPassword(e.target.value)}
                required
            />

            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Começar Agora'}
            </Button>
        </form>
    )
}