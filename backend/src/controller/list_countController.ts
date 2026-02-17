import { listCountService } from "../service/list_countService.js";
import type { Request, Response } from "express";
import { AppError } from "../utilities/AppError.js";

interface auth extends Request{
    companyId?: number,
    userId?: number,
    isAdmin?: boolean
}

export const listCountController = {
    async startCount(req: auth, res: Response){
        try{
            const listId = Number(req.params.listId)

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const listCount = await listCountService.startCount(
                listId,
                req.companyId,
                req.userId
            )

            res.status(201).json(listCount)
        }catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao iniciar contagem." })
        }
    },

    async closeCount(req: auth, res: Response){
        try{
            const listCountId = Number(req.params.listCountId)

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const listCount = await listCountService.closeCount(
                listCountId,
                req.companyId,
                req.userId
            )

            res.status(200).json(listCount)
        } catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao encerrar contagem." })
        }
    },

    async deleteCount(req: auth, res: Response){
        try{
            const listCountId = Number(req.params.listCountId)

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const listCount = await listCountService.deleteCount(
                listCountId,
                req.companyId
            )

            return res.json(204).send(listCount)
        }catch(error){
            if(error instanceof AppError){
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao excluir contagem." })
        }
    }
}