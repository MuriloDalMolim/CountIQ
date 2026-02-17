import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";
import { AppError } from "../utilities/AppError.js";

export const productListService = {

    async getListProducts(listId: number, authId: number){
        try{
            const listExists = await prisma.list.findFirst({
                where:{ 
                    listId: listId, 
                    companyId: authId 
                }
            })
            if(!listExists) {
                throw new AppError("Lista não encontrada.", 404)
            }

            return await prisma.product_list.findMany({
                where:{
                    listId: listId
                },
                select:{
                    product: true
                }
            })
        } catch (error){
            console.log(error)
            throw error
        }
    },

    async insertIntoList(listId: number, barcode: string, authId: number){
        try{
            const listToFull = await prisma.list.findUnique({
                where: {
                    listId: listId,
                    companyId: authId,
                    isInactive: false
                }
            })
            if(!listToFull){
                throw new AppError("Lista não encontrada ou inativa.", 404)
            }

            const productToInsert = await prisma.product.findFirst({
                where:{
                    companyId: authId,
                    barcode: barcode,
                    isInactive: false
                }
            })
            if(!productToInsert){
                throw new AppError("Produto não encontrado ou inativo.", 404)
            }

            const product_list = await prisma.product_list.create({
                data:{
                    listId: listId,
                    productId: productToInsert.productId
                },
                include:{
                    product: true
                }
            })

            return product_list
        } catch (error: any){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError("Este produto já foi adicionado a esta lista.", 409)
                }
            }

            console.log(error)
            throw error
        }
    },

    async deleteFromList(listId: number, productId: number, forceDelete: boolean, authId: number, isAdmin: boolean){
        try{
            const listExists = await prisma.list.findFirst({
                where: {
                    listId: listId,
                    companyId: authId
                }
            })
            if (!listExists) {
                throw new AppError("Lista não encontrada.", 404)
            }

            const productIsCounted = await prisma.count_item.findFirst({
                where:{
                    list_count:{
                        listId:listId,
                        status: "Encerrada"
                    },
                    productId: productId
                }
            })
            if(productIsCounted){
                if(!isAdmin){
                    throw new AppError("Este produto possui contagens encerradas para esta lista. Solicite a exclusão para um ADMIN", 403)
                }

                if(!forceDelete){
                    throw new AppError("Este produto possui contagens encerradas para esta lista. Confirme a exclusão para apagar todo o histórico.", 409)
            
                }
            }

            return await prisma.$transaction(async (tx) => {

                await tx.count_item.deleteMany({
                    where:{
                        productId: productId,
                        list_count:{
                            listId:listId
                        },
                    }
                })

                const product_list = await prisma.product_list.delete({
                    where:{
                        listId_productId:{
                            listId: listId,
                            productId: productId
                        }
                    }
                })
                return product_list
            })
        } catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new AppError("Produto não está nesta lista.", 404)
                }
            }

            console.log(error)
            throw error
        }
    }
}