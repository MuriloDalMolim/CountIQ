import { prisma } from "../db.js";

export const productListService = {

    async getListProducts(listid: number, authId: number){
        try{
            return await prisma.product_list.findMany({
                where:{
                    listid: listid,
                    list:{
                        companyid: authId
                    }
                },
                select:{
                    product:{
                        select:{
                        productid: true,
                        description: true,
                        barcode: true,
                        companyid: true,
                        inactiveflag: true
                        }
                    }
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
            });

            if (!listToFull) {
                throw new Error("Lista não encontrada");
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

            if (error.code === 'P2002') {
                throw new Error("Este produto já foi adicionado a esta lista.");
            }

            console.log(error)
            throw error
        }
    }
}