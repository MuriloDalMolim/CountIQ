import { prisma } from "../db.js"
import { Prisma } from "@prisma/client";

interface companyData {
  name?: string,
  cnpj?: string,
}

export const companyService = {
    
    async updateCompany(companyIdUpdate: number, data: companyData, authId: number){
        if( companyIdUpdate !== authId){
            throw new Error("Acesso negado.");
        }

        try{
            return await prisma.company.update({
                where:{ 
                    companyid: companyIdUpdate 
                },
                data:data,
                select: { 
                    companyid: true,
                    name: true,
                    cnpj: true,
                    inactiveflag: true
                }
            })
        } catch (error){
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        throw new Error("Este CNPJ já está cadastrado em outra empresa.");
                    }
                }
                console.log(error)
                throw error
            }
    }
    
}