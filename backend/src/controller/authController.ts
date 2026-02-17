import { authService } from "../service/authService.js";
import type { Request, Response } from "express";
import { AppError } from "../utilities/AppError.js";

export const authController = {
    async login(req: Request, res: Response){
        try{
            const {email, password} = req.body
            if (!email || !password){
                return res.status(400).json({ error: "Email e senha são obrigatórios." })
            }

            const result = await authService.login({email, password})
            res.json(result)
        } catch (error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.error(error)
            res.status(500).json({ error: "Erro interno no login." })
        }
    },

    async signUp(req: Request, res: Response){
        try{
            const { companyName, companyCnpj, userName, userEmail, userPassword } = req.body

            if(!companyName || !companyCnpj || !userName || !userEmail || !userPassword) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios! Verifique." })
            }

            const result = await authService.signUp({
                companyName,
                companyCnpj,
                userName,
                userEmail,
                userPassword
            })
            res.status(201).json(result)
        }catch (error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }

            console.error(error)
            return res.status(500).json({ error: "Erro interno no cadastro." })
        }
    }
}