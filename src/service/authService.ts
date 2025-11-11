import { prisma } from "../db.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface login{
    email: string,
    password: string
}

interface SignUpData {

  companyName: string;
  companyCnpj: string;

  userName: string;
  userEmail: string;
  userPassword: string;
}

export const authService = {
    async login({email, password}: login){
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            throw new Error("Email ou senha inválidos")
        }

        const checkPassword = await bcrypt.compare(password, user.password)
            if (!checkPassword) {
                throw new Error("Email ou senha inválidos.");
            }

        const secret = process.env.JWT_SECRET
        if(!secret){
            throw new Error("Chave secreta não configurada")
        }

        const tokenData ={
            userid: user.userid,
            companyid: user.companyid
        }

        const token = jwt.sign(tokenData, secret,{
            expiresIn: "1d"
        })

        return {
            user: {
                userid: user.userid,
                email: user.email,
                name: user.name,
                companyid: user.companyid
            },
            token: token
        };
    },

    async signUp(data: SignUpData){
        const hash = await bcrypt.hash(data.userPassword,10)

        try{
            const result = await prisma.$transaction(async(tx)=>{

                const company = await tx.company.create({
                    data: {
                        name: data.companyName,
                        cnpj: data.companyCnpj
                    }
                })
                const user = await tx.user.create({
                    data: {
                        name: data.userName,
                        email: data.userEmail,
                        password: hash,
                        companyid: company.companyid
                    },
                    select: { 
                        userid: true,
                        email: true,
                        name: true,
                        companyid: true
                    }
                })
                return {company,user}
            })

            const secret = process.env.JWT_SECRET
            if(!secret){
              throw new Error("Chave secreta não configurada")  
            }
            
            const tokenData = {
                userid: result.user.userid,
                companyid: result.user.companyid
            }

            const token = jwt.sign(tokenData, secret, { expiresIn: "1d" });
            return {
                user: result.user,
                company: result.company,
                token: token
            };
        } catch (error){
            throw error
        }
    }
}
