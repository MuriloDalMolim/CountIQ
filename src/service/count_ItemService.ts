import { prisma } from "../db.js";

export const countItemService = {
    async registerItemCount(listcountid: number, productid: number, quantity: number,  authId: number, mode: string){
        try{

            const countExists = await prisma.list_count.findFirst({
                where:{
                    listcountid: listcountid,
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
                                listcountid: listcountid,
                                productid: productid
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
                            listcountid: listcountid,
                            productid: productid
                        }
                    },
                    update:{
                        quantity:{
                            increment: quantity
                        } 
                    },
                    create:{
                        listcountid: listcountid,
                        productid: productid,
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
                            listcountid: listcountid,
                            productid: productid
                        }
                    },
                    update:{
                        quantity: quantity
                    },
                    create:{
                        listcountid: listcountid,
                        productid: productid,
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
    }
}