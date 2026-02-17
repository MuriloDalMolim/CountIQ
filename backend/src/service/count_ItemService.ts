import { prisma } from "../db.js";
import { AppError } from "../utilities/AppError.js";

export const countItemService = {
    async registerItemCount(listCountId: number, productId: number, quantity: number, authId: number, mode: string){
        try{
            const countExists = await prisma.list_count.findFirst({
                where:{
                    listCountId: listCountId,
                    list:{
                        companyId: authId
                    }
                }
            })
            if(!countExists){
                throw new AppError("Contagem não encontrada.", 404)
            }
            if(countExists.status !== "Aberta"){
                throw new AppError("Esta contagem está encerrada e não aceita modificações.", 403)
            }

            const product = await prisma.product.findFirst({
                where:{
                    productId: productId,
                    companyId: authId,
                    isInactive: false
                }
            })
            if(!product){
                throw new AppError("Produto não encontrado ou inativo.", 400)
            }

            if(mode=='increment'){

                if(quantity<0){
                    const currentItem = await prisma.count_item.findUnique({
                        where:{
                            listCountId_productId:{
                                listCountId: listCountId,
                                productId: productId
                            }
                        }
                    })
                    if(!currentItem){
                         throw new AppError("Item ainda não contado, impossível subtrair.", 400)
                    }
                    if((currentItem?.quantity + quantity)<0){
                        throw new AppError("A quantidade não pode ficar negativa.", 400)
                    }
                }

                const item = await prisma.count_item.upsert({
                    where:{
                        listCountId_productId:{
                            listCountId: listCountId,
                            productId: productId
                        }
                    },
                    update:{
                        quantity:{
                            increment: quantity
                        } 
                    },
                    create:{
                        listCountId: listCountId,
                        productId: productId,
                        quantity: quantity
                    }
                })
                return item
            }else if(mode=='set'){
                if(quantity<0){
                    throw new AppError("A quantidade não pode ser negativa.", 400)
                }

                const item = await prisma.count_item.upsert({
                    where:{
                        listCountId_productId:{
                            listCountId: listCountId,
                            productId: productId
                        }
                    },
                    update:{
                        quantity: quantity
                    },
                    create:{
                        listCountId: listCountId,
                        productId: productId,
                        quantity: quantity
                    }

                })
                return item
            }else{
                throw new AppError("Modo de operação inválido (use 'increment' ou 'set').", 400)
            }
        } catch(error){
            console.log(error)
            throw error
        }
    },

    async deleteItemCount(listCountId: number, productId: number, authId: number){
        try{
            const count = await prisma.list_count.findFirst({
                where:{
                    listCountId: listCountId,
                    list:{
                        companyId: authId 
                    }
                }
            })
            if(!count){
                throw new AppError("Contagem não encontrada.", 404)
            }
            if(count.status !== "Aberta"){
                throw new AppError("Contagem encerrada. Não é possível remover itens.", 403)
            }

            const itemTodelete = await prisma.count_item.findFirst({
                where:{
                    listCountId: listCountId,
                    productId: productId,
                    list_count:{ 
                        list:{
                            companyId: authId
                        }
                    }
                }
            })
            if(!itemTodelete){
                throw new AppError("Produto não encontrado ou inativo.", 404)
            }

            const count_item = await prisma.count_item.delete({
                where:{
                    listCountId_productId:{
                        listCountId: listCountId,
                        productId: productId
                    },
                }
            })

            return count_item
        } catch(error){
            console.log(error)
            throw error
        }
    }
}