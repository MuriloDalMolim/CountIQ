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
    }
}