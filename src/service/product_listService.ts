import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";

export const productListService = {

    async getListProducts(listid: number, authId: number){
        try{
            const listExists = await prisma.list.findFirst({
                where:{ 
                    listid: listid, 
                    companyid: authId 
                }
            })
            if(!listExists) {
                throw new Error("Lista não encontrada");
            }

            return await prisma.product_list.findMany({
                where:{
                    listid: listid
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

    async insertIntoList(listid: number, barcode: string, authId: number){
        try{
            const listToFull = await prisma.list.findUnique({
                where: {
                    listid: listid,
                    companyid: authId
                }
            })

            if (!listToFull) {
                throw new Error("Lista não encontrada ou sem permissão");
            }

            const productToInsert = await prisma.product.findUnique({
                where:{
                    companyid_barcode:{
                        companyid: authId,
                        barcode: barcode
                    }
                }
            })

            if(!productToInsert){
                throw new Error("Produto não encontrado")
            }

            const product_list = await prisma.product_list.create({
                data:{
                    listid: listid,
                    productid: productToInsert.productid
                },
                include:{
                    product: true
                }
            })

            return product_list
        } catch (error: any){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error("Este produto já foi adicionado a esta lista.");
                }
            }

            console.log(error)
            throw error
        }
    },

    async deleteFromList(listid: number, productid: number, forceDelete: boolean, authId: number){
        try{

            const listExists = await prisma.list.findFirst({
                where: {
                    listid: listid,
                    companyid: authId
                }
            })
            if (!listExists) {
                throw new Error("Lista não encontrada ou sem permissão");
            }

            const productIsCounted = await prisma.count_item.findFirst({
                where:{
                    list_count:{
                        listid:listid,
                        status: "Encerrada"
                    },
                    productid: productid
                }
            })
            if(productIsCounted && forceDelete == false){
                return{
                status: 'Ação não confirmada',
                message:"Este produto já tem contagens encerradas para esta lista, deseja continuar?"
                }
            }

            const count_item = await prisma.count_item.deleteMany({
                where:{
                    list_count:{
                        listid:listid,
                        status: "Aberta"
                    },
                    productid: productid,
                }
            })

            const product_list = await prisma.product_list.delete({
                where:{
                    listid_productid:{
                        listid: listid,
                        productid: productid
                    }
                }
            })

            return product_list
        } catch(error){
            console.log(error)
            throw error
        }
    }
}