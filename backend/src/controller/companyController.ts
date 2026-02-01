import { companyService } from "../service/companyService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number,
    adminflag?: 'T' | 'F'
}

export const companyController = {

    async updateCompany(req: auth,res: Response){
        try{
            const companyidUpdate = Number(req.params.companyid)

            if(!req.companyid){
                return res.status(401).json({error: "Usuário não autenticado"})
            }

            if (req.adminflag !== 'T') {
                return res.status(403).json({ error: "Acesso negado. Apenas usuários ADMIN podem alterar esse campo" });
            }

            const company = await companyService.updateCompany(
                companyidUpdate, 
                req.body, 
                req.companyid
            )

            res.json(company)
        } catch(error){
            console.log(error)

            if (error instanceof Error) {
                if (error.message.includes("Acesso negado")) {
                    return res.status(403).json({ error: error.message })
                }
                if (error.message.includes("Este CNPJ já está cadastrado")) {
                    return res.status(409).json({ error: error.message })
                }
            }

            res.status(500).json({ error: "Erro ao editar empresa" })
        }
    }
}