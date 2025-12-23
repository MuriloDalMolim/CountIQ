import { prisma } from "../db.js";

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
            console.log(error)
            throw error
        }
    },

    async updateProduct(productIdUpdate: number, data: updateProductData, authUd: number){
        const productToUpdate = await prisma.product.findFirst({
            where:{
                companyid: authUd,
                productid: productIdUpdate
            }
        })

        if(!productToUpdate){
            throw new Error("Produto não encontrado")
        }

        const dataToUpdate: any = {};

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