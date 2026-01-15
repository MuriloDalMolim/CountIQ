import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";

interface createProductData{
    description: string,
    barcode: string,
    companyid: number,
    inactiveflag?: 'T' | 'F'
}

interface updateProductData{
    description?: string,
    barcode?: string,
    companyid?: number
}

interface deleteProductData{
    inactiveflag: 'T' | 'F'
}

export const productService = {

    async getAllProducts(authId: number){
        try{
            return await prisma.product.findMany({
                where:{
                    companyid: authId
                },
                select:{
                    productid: true,
                    description: true,
                    barcode: true,
                    companyid: true,
                    inactiveflag: true
                }

            })
        } catch (error){
            console.log(error)
            throw error
        }
    },

    async createProduct(data: createProductData){
        try{
            const product = await prisma.product.create({
                data:{
                    description: data.description,
                    barcode: data.barcode,
                    companyid: data.companyid,
                    inactiveflag: data.inactiveflag  || "F"
                },
                select:{
                    productid: true,
                    description: true,
                    barcode: true,
                    inactiveflag: true,
                    companyid: true
                }
            })
            return product
        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error("Este código de barras já está em uso por outro produto.");
                }
            }
            console.log(error)
            throw error
        }
    },

    async updateProduct(productIdUpdate: number, data: updateProductData, authId: number){
        const productToUpdate = await prisma.product.findFirst({
            where:{
                companyid: authId,
                productid: productIdUpdate
            }
        })

        if(!productToUpdate){
            throw new Error("Produto não encontrado")
        }

        const dataToUpdate: Prisma.productUpdateInput = {};

        if (data.description !== undefined) {
            dataToUpdate.description = data.description;
        }
        if (data.barcode !== undefined) {
            dataToUpdate.barcode = data.barcode;
        }

        try{
            return await prisma.product.update({
                where:{
                    productid: productIdUpdate,
                },
                data:dataToUpdate,
                select:{
                    productid: true,
                    description: true,
                    barcode: true,
                    companyid: true,
                    inactiveflag: true
                }
            })
        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error("Este código de barras já está em uso por outro produto.");
                }
            }
            console.log(error)
            throw error
        }
    },

    async deleteProduct(productIdDelete: number, data: deleteProductData ,authId: number, ){
        const productToDelete = await prisma.product.findFirst({
            where:{
                productid: productIdDelete,
                companyid: authId
            }
        })

        if(!productToDelete){
            throw new Error("Produto não encontrado")
        }

        try{
            return await prisma.product.update({
                where:{
                    productid: productIdDelete
                },
                data:{
                    inactiveflag: data.inactiveflag
                }, 
                select:{
                    productid: true,
                    description: true,
                    barcode: true,
                    companyid: true,
                    inactiveflag: true
                }
            })
        }catch(error){
            console.log(error)
            throw error
        }
    }

    
}