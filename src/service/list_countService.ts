import { prisma } from "../db.js";

export const listCountService = {
    async startCount (listId: number, authId: number, authUserId: number){
        try{
            const listToCount = await prisma.list.findFirst({
                where: {
                    listid: listId,
                    companyid: authId
                }
            })
            if (!listToCount) {
                throw new Error("Lista não encontrada");
            }

            const openListCount = await prisma.list_count.findFirst({
                where: {
                    listid: listId,
                    status: "Aberta"
                }
            })
            if(openListCount){   
                throw new Error("Essa lista já possui uma contagem em andamento")
            }

            const list_count = await prisma.list_count.create({
                data:{
                    listid: listId,
                    userid: authUserId
                },
                select:{
                    listcountid: true,
                    status: true,
                    list: true,
                    user:{
                        select:{
                            userid: true,
                            name: true
                        }
                    }
                }
            })

            return list_count
        } catch (error){
            console.log(error)
            throw error
        }
    },
    
    async closeCount (listId: number, countId: number, authId: number, authUserId: number){
        try{
            const listToCount = await prisma.list.findFirst({
                where: {
                    listid: listId,
                    companyid: authId
                }
            })
            if (!listToCount) {
                throw new Error("Lista não encontrada");
            }

            const count = await prisma.list_count.findFirst({
                where: {
                    listcountid: countId,
                    listid: listId,
                    list:{
                        companyid: authId
                    } 
                }
            })
            if (!count) {
                throw new Error("Contagem não encontrada");
            }
            if (count.status !== "Aberta") {
                throw new Error("Esta contagem já está encerrada.");
            }

            return await prisma.list_count.update({
                where:{
                    listcountid: countId
                },
                data:{
                    status: 'Encerrada',
                    userid: authUserId 
                },
                select:{
                    listcountid: true,
                    status: true,
                    listid: true,
                    userid: true,
                }
            })
        } catch (error){
            console.log(error)
            throw error
        }
    }
}