import { productListService } from "../service/product_listService.js";
import type { Request, Response } from "express";
import { AppError } from "../utilities/AppError.js";

interface auth extends Request{
    companyId?: number,
    userId?: number,
    isAdmin?: boolean
}

export const productListController = {
    async getListProducts(req: auth, res: Response){
        try{
            const listId = Number(req.params.listId)

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!listId){
                return res.status(401).json({ error: "Por favor, informe a lista desejada"})
            }

            const productList = await productListService.getListProducts(
                listId,
                req.companyId
            )

            res.json(productList)
        }catch(error){
            console.log(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: "Erro ao buscar produtos da lista." })
        }
    },
    
    async insertIntoList(req: auth, res: Response){
        try{

            const listId = Number(req.params.listId)
            const {barcode} = req.body

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado."})
            }

            if(!barcode){
                return res.status(400).json({ error: "Código de barras é obrigatório."})
            }

            const productList = await productListService.insertIntoList(
                listId,
                barcode,
                req.companyId
            )

            res.status(201).json(productList)
        } catch (error){
            console.log(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: "Erro ao adicionar produto na lista." })
        }
    },

    async deleteFromList(req: auth, res: Response){
        try{
            const listId = Number(req.params.listId)
            const {productId, forceDelete} = req.body

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado."})
            }
            if(!productId){
                return res.status(400).json({ error: "Nenhum produto foi selecionado para remover."})
            }

            const product_list = await productListService.deleteFromList(
                listId,
                productId,
                forceDelete === true,
                req.companyId,
                req.isAdmin || false
            )

            res.status(200).json(product_list)
        } catch(error){
            console.log(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: "Erro ao remover produto da lista." })
        }
    }
}