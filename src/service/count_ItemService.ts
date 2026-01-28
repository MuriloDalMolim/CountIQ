import { prisma } from "../db.js";

export const countItemService = {
    async registerItemCount(listCountId: number, productId: number, quantity: number,  authId: number, mode: string){
        try{

            const countExists = await prisma.list_count.findFirst({
                where:{
                    listcountid: listCountId,
                    list:{
                        companyid: authId
                    }
                }
            })
            if(!countExists){
                throw new Error("Contagem não encontrada ou acesso negado.");
            }

            if(mode=='increment'){
                
                if(quantity<0){
                    const currentItem = await prisma.count_item.findUnique({
                        where:{
                            listcountid_productid:{
                                listcountid: listCountId,
                                productid: productId
                            }
                        }
                    })
                    if(!currentItem){
                         throw new Error("Item ainda não contado.");
                    }
                    if((currentItem?.quantity + quantity)<0){
                        throw new Error("Não é possível reduzir o saldo de contagem do produto para um valor menor que 0.");
                    }
                }

                const item = await prisma.count_item.upsert({
                    where:{
                        listcountid_productid:{
                            listcountid: listCountId,
                            productid: productId
                        }
                    },
                    update:{
                        quantity:{
                            increment: quantity
                        } 
                    },
                    create:{
                        listcountid: listCountId,
                        productid: productId,
                        quantity: quantity
                    }
                })
                return item
            }else if(mode=='set'){

                if(quantity<0){
                    throw new Error("Não é possível informar um número menor que 0");
                }

                const item = await prisma.count_item.upsert({
                    where:{
                        listcountid_productid:{
                            listcountid: listCountId,
                            productid: productId
                        }
                    },
                    update:{
                        quantity: quantity
                    },
                    create:{
                        listcountid: listCountId,
                        productid: productId,
                        quantity: quantity
                    }

                })
                return item
            }else{
                throw new Error("Modo de operação inválido.");
            }
        } catch(error){
            console.log(error)
            throw error
        }
    },

    async deleteItemCount(listCountId: number, productId: number, authId: number){
        try{

            const count = await prisma.count_item.findFirst({
                where:{
                    listcountid: listCountId,
                    list_count:{ 
                        list:{
                            companyid: authId
                        }
                    }
                }
            })
            if(!count){
                throw new Error("Contagem não localizada ou acesso negado.");
            }

            const itemTodelete = await prisma.count_item.findFirst({
                where:{
                    listcountid: listCountId,
                    productid: productId,
                    list_count:{ 
                        list:{
                            companyid: authId
                        }
                    }
                }
            })
            if(!itemTodelete){
                throw new Error("Produto não localizado na contagem ou acesso negado.");
            }

            const count_item = await prisma.count_item.delete({
                where:{
                    listcountid_productid:{
                        listcountid: listCountId,
                        productid: productId
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