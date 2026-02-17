import { companyService } from "../service/companyService.js";
import type { Request, Response } from "express";
import { AppError } from "../utilities/AppError.js";

interface auth extends Request{
    companyId?: number
    userId?: number
    isAdmin?: boolean
}

export const companyController = {
    async getCompany(req: auth, res: Response){
        try{
            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const company = await companyService.getCompany(
                req.companyId
            )
            
            return res.json(company) 
        } catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.error(error)
            return res.status(500).json({ error: "Erro ao buscar empresa." })
        }
    },
    async updateCompany(req: auth,res: Response){
        try{
            const companyIdUpdate = Number(req.params.companyId)

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if (!req.isAdmin) {
                return res.status(403).json({ error: "Acesso negado. Apenas usuários ADMIN podem alterar esse campo" })
            }

            const company = await companyService.updateCompany(
                companyIdUpdate, 
                req.body, 
                req.companyId
            )

            res.json(company)
        } catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }

            console.error(error)
            res.status(500).json({ error: "Erro interno na edição de empresa" })
        }
    }
}