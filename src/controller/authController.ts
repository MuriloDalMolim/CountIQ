import { authService } from "../service/authService.js";
import type { Request, Response } from "express";

    export const authController = {
        async login(req: Request, res: Response){
            try{
                const {email, password} = req.body
                if (!email || !password){
                    return res.status(400).json({ error: "Email e senha são obrigatórios." });
                }

                const result = await authService.login({email, password})
                res.json(result)
            } catch (error){
                if (error instanceof Error) {
                    if (error.message.includes("inválidos") || error.message.includes("inativa") || error.message.includes("inativo")) {
                        return res.status(401).json({ error: error.message }); 
                    }
                }

                console.log(error);
                res.status(500).json({ error: "Erro no servidor." });
            }
        },

        async signUp(req: Request, res: Response){
            try{
                const { companyName, companyCnpj, userName, userEmail, userPassword } = req.body;

                if(!companyName || !companyCnpj || !userName || !userEmail || !userPassword) {
                    return res.status(400).json({ error: "Todos os campos são obrigatórios! Verifique." });
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
                console.log(error);
                res.status(500).json({ error: "Erro no servidor." });
            }
        }
    }