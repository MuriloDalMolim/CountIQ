import { listService } from "../service/listService.js";
import type { Request, Response } from "express";
import { AppError } from "../utilities/AppError.js";

interface auth extends Request{
    companyId?: number,
    userId?: number,
    isAdmin?: boolean
}

export const listController = {

    async getListById(req: auth, res: Response){
        try {
            const listIdTarget = Number(req.params.listId) //

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const list = await listService.getListById(listIdTarget, req.companyId)

            return res.json(list)
        }catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao buscar lista." })
        }
    },

    async getAllList(req: auth, res: Response){
        try{
            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const list = await listService.getAllList(req.companyId)

            res.json(list)
        } catch (error){
            console.log(error)
            return res.status(500).json({ error: "Erro ao buscar listas." })
        }
    },

    async createList(req: auth, res:Response){
        try{
            const {description, isInactive} = req.body

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!description){
                return res.status(400).json({ error: "Descrição é obrigatória para o cadastro." })
            }

            const list = await listService.createList({
                description,
                isInactive,
                companyId: req.companyId
            })

            res.status(201).json(list)
        } catch (error) {
            console.log(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: "Erro ao criar lista." })
        }
    },

    async updateList(req: auth, res:Response){
        try{
            const listIdUpdate = Number(req.params.listId)
            const { description, isInactive } = req.body

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const list = await listService.updateList(
                listIdUpdate,
                { description, isInactive },
                req.companyId
            )
            
            res.status(200).json(list)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao atualizar lista." })
        }
    }
}