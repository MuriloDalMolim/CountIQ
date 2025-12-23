import { productService } from "../service/productService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number,
    adminflag?: 'T' | 'F'
}

export const productController = {
    async getAllProducts(req: auth,res: Response ){
        try{
            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const product = await productService.getAllProducts(req.companyid)
            res.json(product)
        }catch(error){
            console.log(error)
        }
    },

    async createProduct(req: auth, res: Response){
        try{
            const {description, barcode, inactiveflag} = req.body
            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!description || !barcode){
                return res.status(401).json({ error: "Descrição e código de barras são obrigatórios para o cadastro"})
            }

            const product = await productService.createProduct({
                description,
                barcode,
                inactiveflag,
                companyid: req.companyid
            })
            res.status(201).json(product)
        }catch(error){
            console.log(error)
        }
    },

    async updateProduct(req: auth, res:Response){
        try{
            const productIdUpdate = Number(req.params.productid)
            const productToUpdate = req.body

            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const product = await productService.updateProduct(
                productIdUpdate,
                productToUpdate,
                req.companyid
            )
            res.status(200).json(product)
        }catch(error){
            console.log(error)
        }
    },

    async deleteProduct(req: auth, res:Response){
        try{
            const productIdDelete = Number(req.params.productid)
            const productToDelete = req.body

            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if (req.adminflag !== 'T') {
                return res.status(403).json({ error: "Acesso negado. Apenas usuários ADMIN podem ativar e inativar produtos" })
            }

            const product = await productService.deleteProduct(
                productIdDelete,
                productToDelete,
                req.companyid
            )
            res.status(200).json(product)
        }catch(error){
            console.log(error)
        }
    }
}