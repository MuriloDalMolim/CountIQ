import { countItemService } from "../service/count_ItemService.js";
import type { Request, Response } from "express";
import { AppError } from "../utilities/AppError.js";

interface auth extends Request{
    companyId?: number,
    userId?: number,
    isAdmin?: boolean
}

export const countItemController = {
    async registerItemCount(req: auth, res: Response){
        try{
            const listCountId = Number(req.params.listCountId)
            const {productId, quantity, mode} = req.body 

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!productId || quantity === undefined || !mode){
                return res.status(400).json({ error: "Dados incompletos. Verifique!" })
            }

            const countItem = await countItemService.registerItemCount(
                listCountId,
                productId,
                quantity,
                req.companyId,
                mode,
            )

            res.status(200).json(countItem)
        } catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao registrar item." })
        }
    },

    async deleteItemCount(req: auth, res: Response){
        try{
            const listCountId = Number(req.params.listCountId)
            const {productId} = req.body

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!productId){
                return res.status(400).json({ error: "Nenhum produto foi selecionado para remover."})
            }

            const count_item = await countItemService.deleteItemCount(
                listCountId,
                productId,
                req.companyId
            )

            res.status(200).json(count_item)
        } catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao remover item." })
        }
    }
}