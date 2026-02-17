import { prisma } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utilities/AppError.js";

interface loginData{
    email: string
    password: string
}
 
interface SignUpData {

  companyName: string
  companyCnpj: string

  userName: string
  userEmail: string
  userPassword: string
}

export const authService = {
    async login({email, password}: loginData){

        const user = await prisma.user.findFirst({
            where:{
                email: email,
            },
            include:{
                company: true
            }
        })
        if(!user){
            throw new AppError("Email ou senha inválidos.", 401)
        }

        if(user.isInactive){
            throw new AppError("Este usuário está inativo.", 403)
        }

        if (user.company.isInactive === true) {
            throw new AppError("A empresa desta conta está inativa.", 403)
        }

        const checkPassword = await bcrypt.compare(password, user.password)
            if (!checkPassword) {
                throw new AppError("Email ou senha inválidos.", 401)
            }

        const secret = process.env.JWT_SECRET
        if(!secret){
            throw new AppError("Erro interno de configuração.", 500)
        }

        const token = jwt.sign(
            {
                userId: user.userId,
                companyId: user.companyId,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: "1d" }
        )

        return {
            user: {
                userId: user.userId,
                email: user.email,
                name: user.name,
                isInactive: user.isInactive,
                isAdmin: user.isAdmin,
                companyId: user.companyId
            },
            token: token
        }
    },

    async signUp(data: SignUpData){
        try{
            const hash = await bcrypt.hash(data.userPassword,10)

            const cleanCnpj = data.companyCnpj.replace(/\D/g, '')

            if(cleanCnpj.length != 14){
                throw new AppError("Verifique o CNPJ e tente novamente.", 400)
            }

            const emailExists = await prisma.user.findFirst({
                where:{
                    email: data.userEmail
                }
            })
            if(emailExists){
                throw new AppError("Email indisponível.", 409)
            }

            const companyExists = await prisma.company.findUnique({
                where:{
                    cnpj: cleanCnpj
                }
            })
            if(companyExists){
                throw new AppError("CNPJ não disponível.", 409)
            }

            const result = await prisma.$transaction(async(tx)=>{

                const company = await tx.company.create({
                    data: {
                        name: data.companyName,
                        cnpj: cleanCnpj
                    }
                })
                const user = await tx.user.create({
                    data: {
                        name: data.userName,
                        email: data.userEmail,
                        password: hash,
                        isAdmin: true,
                        companyId: company.companyId,
                    },
                    select: { 
                        userId: true,
                        name: true,
                        email: true,
                        isAdmin: true,
                        isInactive: true,
                        companyId: true,
                    }
                })
                return {company,user}
            })

            const secret = process.env.JWT_SECRET
            if(!secret){
                throw new AppError("Erro interno de configuração.", 500)
            }

            const token = jwt.sign(
                {
                    userId: result.user.userId,
                    companyId: result.user.companyId,
                    isAdmin: result.user.isAdmin
                },
                secret,
                { expiresIn: "1d" }
            )

            return{
                user: result.user,
                company: result.company,
                token
            }
        } catch (error){
            throw error
        }
    }
}
