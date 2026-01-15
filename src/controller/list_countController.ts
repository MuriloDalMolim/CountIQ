import { listCountService } from "../service/list_countService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number,
    adminflag?: 'T' | 'F'
}

export const listCountController = {
    async startCount(req: auth, res: Response){
        try{
            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const listId = Number(req.params.listid)

            const listCount = await listCountService.startCount(
                listId,
                req.companyid,
                req.userid
            )

            res.status(201).json(listCount)
        } catch (error){
            console.log(error)

            if (error instanceof Error && error.message.includes("já possui uma contagem")) {
                return res.status(409).json({ error: error.message })
            }
            if (error instanceof Error && error.message === "Lista não encontrada") {
                return res.status(404).json({ error: error.message })
            }

            res.status(500).json({ error: "Erro ao iniciar contagem" })
        }
    },

    async closeCount(req: auth, res: Response){
        try{
            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const listId = Number(req.params.listid)
            const countId = Number(req.params.countid)

            const listCount = await listCountService.closeCount(
                listId,
                countId,
                req.companyid,
                req.userid
            )

            res.status(201).json(listCount)
        } catch(error){
            console.log(error)
            res.status(500).json({ error: "Erro ao encerrar contagem" })
        } 
    }
}