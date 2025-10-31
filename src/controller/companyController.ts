import { companyService } from "../service/companyService.js";
import type { Request, Response } from "express";


export const companyController = {
    
    async createCompany(req: Request,res: Response){
        try{
            const {name,cnpj} = req.body

            const company = await companyService.createCompany({name,cnpj})
            res.status(201).json(company)
        } catch (error){
            console.log(error)
            res.status(500).json({
                error: "Erro ao criar empresa"
            })
        }
    } ,

    async updateCompany(req: Request,res: Response){
        try{
            const companyid = Number(req.params.companyid)
            const {name,cnpj} = req.body

            const company = await companyService.updateCompany(companyid, {name,cnpj})
            res.json(company)
        } catch(error){
            console.log(error)
            res.status(500).json({
                error: "Erro ao editar empresa"
            })
        }
    },

    async deleteCompany(req: Request,res: Response){
        try{
            const companyid = Number(req.params.companyid)

            const company = await companyService.deleteCompany(companyid )
            res.json(company)
        }catch(error){
            console.log(error)
            res.status(500).json({
                error: "Erro ao deleter empresa"
            })
        }
    }
}