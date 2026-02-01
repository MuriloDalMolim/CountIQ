import { listService } from "../service/listService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number,
    adminflag?: 'T' | 'F'
}

export const listController = {
    async getAllList(req: auth, res: Response){
        try{
            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const list = await listService.getAllList(req.companyid)
            res.json(list)
        } catch (error){
            console.log(error)
        }
    },

    async createList(req: auth, res:Response){
        try{
            const {description, inactiveflag} = req.body

            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!description){
                return res.status(401).json({ error: "Descrição é obrigatório para o cadastro"})
            }

            const list = await listService.createList({
                description,
                inactiveflag,
                companyid: req.companyid
            })

            res.status(201).json(list)
        }catch(error){
            console.log(error )
        }
    },

    async updateList(req: auth, res:Response){
        try{
            const listIdUpdate = Number(req.params.listid)
            const listToUpdate = req.body

            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const list = await listService.updateList(
                listIdUpdate,
                listToUpdate,
                req.companyid
            )
            res.status(200).json(list)
        } catch (error){
            console.log(error)

            if (error instanceof Error) {
                if (error.message === "Lista não encontrada") {
                    return res.status(404).json({ error: error.message })
                }
            }
            
            res.status(500).json({ error: "Erro ao atualizar lista" })
        }
    }
}