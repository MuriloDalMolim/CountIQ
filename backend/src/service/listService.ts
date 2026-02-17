import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";
import { AppError } from "../utilities/AppError.js";

interface createListData {
    description: string,
    companyId: number,
    isInactive: boolean
}

interface updateListData {
    description?: string,
    isInactive?: boolean
}

export const listService = {

    async getListById(listIdGet:number, authId: number){
        try{
            const list = await prisma.list.findFirst({
                where:{
                    listId: listIdGet,
                    companyId: authId 
                },
                select:{
                    listId: true,
                    description: true,
                    companyId: true,
                    isInactive: true
                }
            })
            if(!list){
                throw new AppError("Lista não encontrada.", 404)
            }

            return list
        }catch(error){
            console.log(error)
            throw error
        }
    },

    async getAllList(authId: number){
        try{
            return await prisma.list.findMany({
                where:{
                    companyId: authId
                },
                select:{
                    listId: true,
                    description: true,
                    companyId: true,
                    isInactive: true
                }
            })
        }catch(error){
            console.log(error)
            throw error
        }
    },

    async createList(data: createListData){
        try{
            const list = await prisma.list.create({
                data:{
                    description: data.description,
                    isInactive: data.isInactive || false,
                    companyId: data.companyId
                },
                    select:{
                    listId: true,
                    description: true,
                    companyId: true,
                    isInactive: true
                }   
            })

            return list
        }catch (error){
            console.log(error)
            throw error
        }
    },

    async updateList(listIdUpdate: number,data: updateListData, authId: number){
        try{
            const listToUpdate = await prisma.list.findFirst({
                where:{
                    companyId: authId,
                    listId: listIdUpdate
                }
            })
            if(!listToUpdate){
                throw new AppError("Lista não encontrada.", 404)
            }

            const dataToUpdate: Prisma.listUpdateInput = {}

            if (data.description !== undefined) {
                dataToUpdate.description = data.description
            }
            if (data.isInactive !== undefined) {
                dataToUpdate.isInactive = data.isInactive
            }

            const list = await prisma.list.update({
                where:{
                    listId: listIdUpdate
                },
                data: dataToUpdate,
                select:{
                    listId: true,
                    description: true,
                    companyId: true,
                    isInactive: true
                }
            })

            return list
        } catch (error){
            console.log(error)
            throw error
        }
    }
}