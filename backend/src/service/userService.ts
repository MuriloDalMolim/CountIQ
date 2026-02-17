import { prisma } from "../db.js";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { AppError } from "../utilities/AppError.js";

interface createUserData{
    email: string,
    password: string,
    name: string,
    companyId: number,
    isAdmin?: boolean
}

interface updateUserData{
    email?: string,
    name?: string,
    password?: string,
    isInactive?: boolean
    isAdmin?: boolean
}

export const userService ={

    async getUserById(authUserId: number, authId: number){
        const user = await prisma.user.findFirst({
            where:{
                userId: authUserId,
                companyId: authId
            },
            select: {
                userId: true,
                name: true,
                email: true,
                companyId: true,
                isInactive: true,
                isAdmin: true
            }
        })
        if (!user) {
            throw new AppError("Usuário não encontrado.", 404)
        }

        return user
    },

    async getAllUsers(authId: number){
        try{
            return await prisma.user.findMany({
                where:{
                    companyId: authId
                },
                select:{
                    userId: true,
                    name: true,
                    email: true,
                    companyId: true,
                    isInactive: true,
                    isAdmin: true
                }
            })
        }catch(error){
            console.log(error)
            throw error
        }
    },

    async createUser(data: createUserData){
        try{
            const hash = await bcrypt.hash(data.password,10)

            const emailExists = await prisma.user.findFirst({
                where:{ 
                    email: data.email }
            })
            if(emailExists){
                throw new AppError("Email indisponível.", 409)
            }
        
            const user = await prisma.user.create({
                data:{
                    name: data.name,
                    email: data.email,
                    password: hash,
                    companyId: data.companyId,
                    isAdmin: data.isAdmin || false
                },
                select:{
                    userId: true,
                    email: true,
                    name: true,
                    companyId: true,
                    isInactive: true,
                    isAdmin: true
                }
            })

            return user
        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError("Este email já está cadastrado no sistema.", 409)
                }
            }
            console.log(error)
            throw error
        }
    },

    async updateUser(userIdUpdate: number, data: updateUserData, authId: number){
        try{
            const userToUpdate = await prisma.user.findFirst({
                where:{
                    userId: userIdUpdate,
                    companyId: authId
                }
            })

            if(!userToUpdate){
                throw new AppError("Usuário não encontrado.", 404)
            }
            
            if(data.email){
                const emailExists = await prisma.user.findFirst({
                    where:{
                        email: data.email,
                        NOT:{
                            userId: userIdUpdate
                        }
                    }
                })
                if(emailExists){
                    throw new AppError("Este email já está em uso por outro usuário.", 409)
                }
            }

            const dataToUpdate: any = {}

            if (data.email !== undefined) {
                dataToUpdate.email = data.email
            }
            if (data.name !== undefined) {
                dataToUpdate.name = data.name
            }
            if (data.isInactive !== undefined) {
                dataToUpdate.isInactive = data.isInactive
            }
            if (data.isAdmin !== undefined) {
                dataToUpdate.isAdmin = data.isAdmin
            }
            if (data.password !== undefined && data.password.trim() !== "") {
                dataToUpdate.password = await bcrypt.hash(data.password, 10)
            }

            return await prisma.user.update({
                where:{
                    userId: userIdUpdate
                },
                data: dataToUpdate,
                select: {
                    userId: true, 
                    email: true, 
                    name: true, 
                    companyId: true,
                    isInactive: true,
                    isAdmin: true
                }
            })
        } catch (error){
            console.log(error)
            throw error
        }
    }

}