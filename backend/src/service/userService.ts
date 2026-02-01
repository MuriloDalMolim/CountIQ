import { prisma } from "../db.js"
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client";

interface createUserData{
    email: string,
    password: string,
    name: string,
    companyid: number,
    adminflag?: 'T' | 'F'
}

interface updateUserData{
    email?: string,
    name?: string,
    password?: string,
    inactiveflag?: 'T' | 'F',
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
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error("Este email já está cadastrado no sistema.");
                }
            }
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

        const dataToUpdate: any = {};

        if (data.email !== undefined) {
            dataToUpdate.email = data.email;
        }
        if (data.name !== undefined) {
            dataToUpdate.name = data.name;
        }
        if (data.inactiveflag !== undefined) {
            dataToUpdate.inactiveflag = data.inactiveflag;
        }
        if (data.adminflag !== undefined) {
            dataToUpdate.adminflag = data.adminflag;
        }
        if (data.password !== undefined && data.password.trim() !== "") {
            dataToUpdate.password = await bcrypt.hash(data.password, 10);
        }

        try{
            return await prisma.user.update({
                where:{
                    userid: userIdUpdate
                },
                data: dataToUpdate,
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
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error("Este email já está em uso por outro usuário.");
                }
            }
            console.log(error)
            throw error
        }
    }

}