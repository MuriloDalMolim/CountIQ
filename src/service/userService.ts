import { prisma } from "../db.js"
import bcrypt from "bcryptjs"

interface createUserData{
    email: string,
    password: string,
    name: string,
    companyid: number,
    adminflag?: 'T' | 'F'
}

interface updateUserData{
    email?: string,
    name?: string
    inactiveflag?: 'T' | 'F'
    adminflag?: 'T' | 'F'
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
                companyid: true,
                inactiveflag: true,
                adminflag: true
            }
        })
    },

    async createUser(data: createUserData){
        try{
            const hash = await bcrypt.hash(data.password,10)

            const user = await prisma.user.create({
                data:{
                    name: data.name,
                    email: data.email,
                    password: hash,
                    companyid: data.companyid,
                    adminflag: data.adminflag || 'F'
                },
                select:{
                    userid: true,
                    email: true,
                    name: true,
                    companyid: true,
                    inactiveflag: true,
                    adminflag: true
                }
            })
            return user
        } catch (error){
            console.log(error)
            throw error
        }
    },

    async updateUser(userIdUpdate: number, data: updateUserData, authId: number){
        const userToUpdate = await prisma.user.findFirst({
            where:{
                userid: userIdUpdate,
                companyid: authId
            }
        })

        if(!userToUpdate){
            throw new Error("Usuário não encontrado")
        }

        try{
            return await prisma.user.update({
                where:{
                    userid: userIdUpdate
                },
                data: data,
                select: {
                    userid: true, 
                    email: true, 
                    name: true, 
                    companyid: true,
                    inactiveflag: true,
                    adminflag: true
                }
            })
        } catch (error){
            console.log(error)
            throw error
        }
    }

}