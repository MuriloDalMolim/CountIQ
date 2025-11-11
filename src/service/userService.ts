import { prisma } from "../db.js"
import bcrypt from "bcryptjs"

interface createUserData{
    email: string,
    password: string,
    name: string,
    companyid: number
}

interface updateUserData{
    email?: string,
    name?: string
}

export const userService ={

    async getAllUsers(authId: number){
        return await prisma.user.findMany({
            where:{
                companyid: authId
            },
            select:{
                userid: true,
                name: true,
                email: true,
                companyid: true
            }
        })
    },

    async createUser({email, password, name, companyid}: createUserData){
        try{
            const hash = await bcrypt.hash(password,10)

            const user = await prisma.user.create({
                data:{
                    email, 
                    password: hash,
                    name,
                    companyid
                },
                select:{
                    userid: true,
                    email: true,
                    name: true,
                    companyid: true
                }
            })
            return user
        } catch (error){
            console.log(error)
        }
    },

    async updateUser(useridUpdate: number, data: updateUserData, authId: number){
        const userToUpdate = await prisma.user.findUnique({
            where:{
                userid: useridUpdate,
                companyid: authId
            }
        })

        if(!userToUpdate){
            throw new Error("Usuário não encontrado")
        }

        return await prisma.user.update({
            where:{
                userid: useridUpdate
            },
            data: data,
            select: {
                userid: true, 
                email: true, 
                name: true, 
                companyid: true
            }
        })
    },

    async deleteUser(useridDelete: number, authId: number){
        const userToDelete = await prisma.user.findUnique({
            where:{
                userid: useridDelete,
                companyid: authId
            }
        })

        if(!userToDelete){
            throw new Error("Usuário não encontrado")
        }

        return await prisma.user.delete({
            where:{
                userid: useridDelete
            },
            select:{
                userid: true,
                email: true,
                name: true
            }
        })

    }

}