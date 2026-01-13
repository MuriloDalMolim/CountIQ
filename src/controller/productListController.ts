import { productListService } from "../service/productListService.js";
import { productService } from "../service/productService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number,
    adminflag?: 'T' | 'F'
}

export const productListController = {
    async getListProducts(req: auth, res: Response){
        try{

            const listid = Number(req.params.listid)

            if(!listid){
                return res.status(401).json({ error: "Por favor, informe a lista desejada"})
            }

            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const productList = await productListService.getListProducts(listid,req.companyid)
            res.json(productList)
        } catch (error){
            console.log(error)
        }
    },
    
    async insertIntoList(req: auth, res: Response){
        try{

            const listid = Number(req.params.listid)
            const {barcode} = req.body

            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const productList = await productListService.insertIntoList(
                listid,
                barcode,
                req.companyid
            )

            res.status(201).json(productList)
        } catch (error){
            console.log(error)
        }
    }
}