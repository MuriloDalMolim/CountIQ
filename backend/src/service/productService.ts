import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";
import { AppError } from "../utilities/AppError.js";

interface createProductData{
    description: string,
    barcode: string,
    companyId: number,
    isInactive?: boolean
}

interface updateProductData{
    description?: string,
    barcode?: string,
    companyId?: number
}

interface deleteProductData{
    isInactive: boolean
}

export const productService = {

    async getProductById(productIdGet: number, authId: number){
        try{
            const product = await prisma.product.findFirst({
                where:{
                    productId: productIdGet,
                    companyId: authId
                },
                select: {
                    productId: true,
                    description: true,
                    barcode: true,
                    companyId: true,
                    isInactive: true
                }
            })
            if(!product){
                throw new AppError("Produto não encontrado.", 404)
            }

            return product
        }catch(error){
            console.log(error)
            throw error
        }
    },

    async getAllProducts(authId: number){
        try{
            return await prisma.product.findMany({
                where:{
                    companyId: authId
                },
                select:{
                    productId: true,
                    description: true,
                    barcode: true,
                    companyId: true,
                    isInactive: true
                }

            })
        } catch (error){
            console.log(error)
            throw error
        }
    },

    async createProduct(data: createProductData){
        try{
            const barcodeExists = await prisma.product.findFirst({
                where: {
                    barcode: data.barcode,
                    companyId: data.companyId
                }
            })
            if (barcodeExists) {
                throw new AppError("Este código de barras já está em uso.", 409)
            }

            const product = await prisma.product.create({
                data:{
                    description: data.description,
                    barcode: data.barcode,
                    companyId: data.companyId,
                    isInactive: data.isInactive  || false
                },
                select:{
                    productId: true,
                    description: true,
                    barcode: true,
                    isInactive: true,
                    companyId: true
                }
            })

            return product
        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError("Este código de barras já está em uso por outro produto.", 409)
                }
            }
            console.log(error)
            throw error
        }
    },

    async updateProduct(productIdUpdate: number, data: updateProductData, authId: number){
        try{
            const productToUpdate = await prisma.product.findFirst({
                where:{
                    companyId: authId,
                    productId: productIdUpdate
                }
            })
            if(!productToUpdate){
                throw new AppError("Produto não encontrado.", 404)
            }

            if (data.barcode) {
                const barcodeExists = await prisma.product.findFirst({
                    where: {
                        barcode: data.barcode,
                        companyId: authId, 
                        NOT: {
                            productId: productIdUpdate 
                        }
                    }
                })
                if (barcodeExists) {
                    throw new AppError("Código de barras já utilizado em outro produto.", 409)
                }
            }

            const dataToUpdate: Prisma.productUpdateInput = {}

            if (data.description !== undefined) {
                dataToUpdate.description = data.description
            }
            if (data.barcode !== undefined) {
                dataToUpdate.barcode = data.barcode
            }

            return await prisma.product.update({
                where:{
                    productId: productIdUpdate,
                },
                data:dataToUpdate,
                select:{
                    productId: true,
                    description: true,
                    barcode: true,
                    companyId: true,
                    isInactive: true
                }
            })
        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError("Código de barras já utilizado em outro produto.", 409)
                }
            }
            console.log(error)
            throw error
        }
    },

    async deleteProduct(productIdDelete: number, data: deleteProductData ,authId: number, ){
        try{
            const productToDelete = await prisma.product.findFirst({
                where:{
                    productId: productIdDelete,
                    companyId: authId
                }
            })
            if(!productToDelete){
                throw new AppError("Produto não encontrado.", 404)
            }

            return await prisma.product.update({
                where:{
                    productId: productIdDelete
                },
                data:{
                    isInactive: data.isInactive
                }, 
                select:{
                    productId: true,
                    description: true,
                    barcode: true,
                    companyId: true,
                    isInactive: true
                }
            })
        }catch(error){
            console.log(error)
            throw error
        }
    }

    
}