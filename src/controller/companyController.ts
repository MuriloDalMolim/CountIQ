import { companyService } from "../service/companyService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number
}

export const companyController = {

    async updateCompany(req: auth,res: Response){
        try{
            const companyidUpdate = Number(req.params.companyid)
            if(!req.companyid){
                return res.status(401).json({error: "Usuário não autenticado"})
            }

            const company = await companyService.updateCompany(companyidUpdate, req.body, req.companyid)
            res.json(company)
        } catch(error){
            console.log(error)
            res.status(500).json({ error: "Erro ao editar empresa" })
        }
    },

    async deleteCompany(req: auth,res: Response){
        try{
            const companyidInactive = Number(req.params.companyid)
            if (!req.companyid){
                return res.status(401).json({error: "Usuário não autenticado"})
            }

            const company = await companyService.deleteCompany(companyidInactive, req.body, req.companyid )
            res.json(company)
        }catch(error){
            console.log(error)
            res.status(500).json({ error: "Erro ao deleter empresa" })
        }
    }
}