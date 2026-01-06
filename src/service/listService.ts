import { prisma } from "../db.js";

interface createListData {
    description: string,
    companyid: number,
    inactiveflag: 'T' | 'F'
}

interface updateListData {
    description?: string,
    companyid?: number,
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
            throw new Error("Listagem não encontrada")
        }

        const dataToUpdate: any = {};

        if (data.description !== undefined) {
            dataToUpdate.description = data.description;
        }

        try{
            return await prisma.list.update({
                where:{
                    listid: listIdUpdate
                },
                data: dataToUpdate

            })
        } catch (error){
            console.log(error)
            throw error
        }
    }
}