import { productService } from "../service/productService.js";
import type { Request, Response } from "express";
import { AppError } from "../utilities/AppError.js";

interface auth extends Request{
    companyId?: number,
    userId?: number,
    isAdmin?: boolean
}

export const productController = {
    async getProductById(req: auth, res: Response){
        try{
            const productIdGet = Number(req.params.productId)
            
            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const product = await productService.getProductById(
                productIdGet,
                req.companyId
            )

            return res.json(product)
        }catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao buscar produto." })
        }
    },
    
    async getAllProducts(req: auth,res: Response ){
        try{
            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const product = await productService.getAllProducts(req.companyId)

            res.json(product)
        } catch (error){
            console.log(error)
            return res.status(500).json({ error: "Erro ao buscar produtos." })
        }
    },

    async createProduct(req: auth, res: Response){
        try{
            const {description, barcode, isInactive} = req.body

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!description || !barcode){
                return res.status(400).json({ error: "Descrição e código de barras são obrigatórios para o cadastro"})
            }

            const product = await productService.createProduct({
                description,
                barcode,
                isInactive,
                companyId: req.companyId
            })

            res.status(201).json(product)
        } catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }

            console.log(error)
            res.status(500).json({ error: "Erro ao criar produto" })
        }
    },

    async updateProduct(req: auth, res:Response){
        try{
            const productIdUpdate = Number(req.params.productId)
            const { description, barcode} = req.body

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const product = await productService.updateProduct(
                productIdUpdate,
                { description, barcode},
                req.companyId
            )

            res.status(200).json(product)
        }catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }

            console.log(error)
            return res.status(500).json({ error: "Erro ao atualizar produto." })
        }
    },

    async deleteProduct(req: auth, res:Response){
        try{
            const productIdDelete = Number(req.params.productId)
            const { isInactive } = req.body

            if(!req.companyId || !req.userId || !req.isAdmin){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!req.isAdmin) {
                return res.status(403).json({ error: "Acesso negado. Apenas usuários ADMIN podem ativar e inativar produtos" })
            }

            if(isInactive === undefined){
                return res.status(400).json({ error: "Verifique a requisição." })
            }

            const product = await productService.deleteProduct(
                productIdDelete,
                { isInactive },
                req.companyId
            )
            res.status(200).json(product)
        }catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao alterar status do produto." })
        }
    }
}