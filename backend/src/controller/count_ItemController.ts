import { countItemService } from "../service/count_ItemService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number,
    adminflag?: 'T' | 'F'
}

export const countItemController = {
    async registerItemCount(req: auth, res: Response){
        try{
            const listCountId = Number(req.params.listcountid)
            const {productId, quantity, mode} = req.body 

            if(!req.companyid || !req.userid){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const countItem = await countItemService.registerItemCount(
                listCountId,
                productId,
                quantity,
                req.companyid,
                mode,
            )

            res.status(200).json(countItem)
        } catch(error){
            console.log(error)
        }
    },

    async deleteItemCount(req: auth, res: Response){
        try{
            const listCountId = Number(req.params.listcountid)
            const {productId} = req.body

            if(!req.companyid || !req.userid){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!productId){
                return res.status(400).json({ error: "Nenhum produto foi selecionado para remover."})
            }

            const count_item = await countItemService.deleteItemCount(
                listCountId,
                productId,
                req.companyid
            )

            res.status(200).json(count_item)
        } catch(error){
            console.log(error)

            if (error instanceof Error){
                if (error.message === "Produto não localizado na contagem ou acesso negado.") {
                    return res.status(404).json({ error: error.message })
                }
                if (error.message === "Contagem não localizada ou acesso negado.") {
                    return res.status(404).json({ error: error.message })
                }
            }

            res.status(500).json({ error: "Erro ao remover produto" })
        }
    }
}