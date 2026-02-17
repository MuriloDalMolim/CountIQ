import { prisma } from "../db.js";
import { AppError } from "../utilities/AppError.js";

export const listCountService = {
    async startCount (listId: number, authId: number, authUserId: number){
        try{
            const listToCount = await prisma.list.findFirst({
                where: {
                    listId: listId,
                    companyId: authId,
                    isInactive: false
                }
            })
            if (!listToCount) {
                throw new AppError("Lista não encontrada ou inativa.", 404)
            }

            const openListCount = await prisma.list_count.findFirst({
                where: {
                    listId: listId,
                    status: "Aberta"
                }
            })
            if(openListCount){   
                throw new AppError("Esta lista já possui uma contagem em andamento.", 409)
            }

            const list_count = await prisma.list_count.create({
                data:{
                    listId: listId,
                    userId: authUserId
                },
                select:{
                    listCountId: true,
                    status: true,
                    list: true,
                    user:{
                        select:{
                            userId: true,
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
    
    async closeCount (listCountId: number, authId: number, authUserId: number){
        try{
            const listToClose = await prisma.list_count.findFirst({
                where: {
                    listCountId: listCountId,
                    list:{
                        companyId: authId
                    }
                }
            })
            if (!listToClose) {
                throw new AppError("Contagem não encontrada.", 404)
            }
            if (listToClose.status !== "Aberta") {
                throw new AppError("Esta contagem já está encerrada.", 409)
            }

            return await prisma.list_count.update({
                where:{
                    listCountId: listCountId
                },
                data:{
                    status: 'Encerrada',
                    userId: authUserId 
                },
                select:{
                    listCountId: true,
                    status: true,
                    listId: true,
                    userId: true
                }
            })
        } catch (error){
            console.log(error)
            throw error
        }
    },

    async deleteCount(listCountId: number, authId: number){
        try{
            const countToDelete = await prisma.list_count.findFirst({
                where:{
                    listCountId: listCountId,
                    list:{
                        companyId: authId
                    }
                }
            })
            if(!countToDelete){
                throw new AppError("Contagem não encontrada.", 404)
            }
            if(countToDelete.status === "Encerrada"){
                throw new AppError("Não é possível excluir uma contagem encerrada (Histórico).", 403)
            }

            return await prisma.$transaction(async(tx) =>{
                await tx.count_item.deleteMany({
                    where:{
                        listCountId: listCountId
                    }
                })

                const deletedCount = await tx.list_count.delete({
                    where:{
                        listCountId: listCountId
                    }
                })

                return deletedCount
            })
        }catch(error){
            console.log(error)
            throw error
        }
    }
}