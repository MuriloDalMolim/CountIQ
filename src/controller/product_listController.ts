import { productListService } from "../service/product_listService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number,
    adminflag?: 'T' | 'F'
}

export const productListController = {
    async getListProducts(req: auth, res: Response){
        try{
            if(!req.companyid || !req.userid){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }
            const listId = Number(req.params.listid)

            if(!listId){
                return res.status(401).json({ error: "Por favor, informe a lista desejada"})
            }

            const productList = await productListService.getListProducts(
                listId,
                req.companyid
            )

            res.json(productList)
        } catch (error){
            console.log(error)

            if (error instanceof Error) {
                if (error.message === "Lista não encontrada") {
                    return res.status(404).json({ error: error.message })
                }
            }

            res.status(500).json({ error: "Erro ao buscar produtos da lista" })
        }
    },
    
    async insertIntoList(req: auth, res: Response){
        try{

            const listid = Number(req.params.listid)
            const {barcode} = req.body

            if(!req.companyid || !req.userid){
                return res.status(401).json({ error: "Usuário não autenticado."})
            }

            if(!barcode){
                return res.status(400).json({ error: "Código de barras é obrigatório."})
            }

            const productList = await productListService.insertIntoList(
                listid,
                barcode,
                req.companyid
            )

            res.status(201).json(productList)
        } catch (error){
            console.log(error)

            if (error instanceof Error) {
                if (error.message === "Lista não encontrada" || error.message === "Produto não encontrado") {
                    return res.status(404).json({ error: error.message })
                }
                if (error.message === "Este produto já foi adicionado a esta lista.") {
                    return res.status(409).json({ error: error.message })
                }
            }

            res.status(500).json({ error: "Erro ao adicionar produto na lista "})
        }
    },

    async deleteFromList(req: auth, res: Response){
        try{
            const listId = Number(req.params.listid)
            const {productId, forceDelete} = req.body

            if(!req.companyid || !req.userid){
                return res.status(401).json({ error: "Usuário não autenticado."})
            }
            if(!productId){
                return res.status(400).json({ error: "Nenhum produto foi selecionado para remover."})
            }

            const product_list = await productListService.deleteFromList(
                listId,
                productId,
                forceDelete,
                req.companyid
            )

            res.status(200).json(product_list)
        } catch(error){
            console.log(error)

            if (error instanceof Error) {
                if (error.message === "Este produto não esta inserido nesta lista.") {
                    return res.status(409).json({ error: error.message })
                }
                if (error.message === "Lista não encontrada ou sem permissão.") {
                    return res.status(409).json({ error: error.message })
                }
            }

            res.status(500).json({ error: "Erro ao remover produto na lista "})
        }
    }
}