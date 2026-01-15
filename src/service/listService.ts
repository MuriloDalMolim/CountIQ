import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";

interface createListData {
    description: string,
    companyid: number,
    inactiveflag: 'T' | 'F'
}

interface updateListData {
    description?: string,
    inactiveflag?: 'T' | 'F'
}

export const listService = {
    async getAllList(authId: number){
        return await prisma.list.findMany({
            where:{
                companyid: authId
            },
            select:{
                listid: true,
                description: true,
                companyid: true,
                inactiveflag: true
            }
        })
    },

    async createList(data: createListData){
        try{
            const list = await prisma.list.create({
                data:{
                    description: data.description,
                    inactiveflag: data.inactiveflag,
                    companyid: data.companyid
                },
                    select:{
                    listid: true,
                    description: true,
                    companyid: true,
                    inactiveflag: true
                }   
            })

            return list
        }catch (error){
            console.log(error)
            throw error
        }
    },

    async updateList(listIdUpdate: number,data: updateListData, authId: number){
        const listToUpdate = await prisma.list.findFirst({
            where:{
                companyid: authId,
                listid: listIdUpdate
            },
            select:{
                listid: true,
                description: true,
                companyid: true,
                inactiveflag: true
            }
        })

        if(!listToUpdate){
            throw new Error("Lista não encontrada")
        }

        const dataToUpdate: Prisma.listUpdateInput = {};

        if (data.description !== undefined) {
            dataToUpdate.description = data.description;
        }
        if (data.inactiveflag !== undefined) {
            dataToUpdate.inactiveflag = data.inactiveflag;
        }

        try{
            return await prisma.list.update({
                where:{
                    listid: listIdUpdate
                },
                data: dataToUpdate,
                select:{
                    listid: true,
                    description: true,
                    companyid: true,
                    inactiveflag: true
                }
            })
        } catch (error){
            console.log(error)
            throw error
        }
    }
}