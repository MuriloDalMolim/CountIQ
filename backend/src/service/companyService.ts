import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";
import { AppError } from "../utilities/AppError.js";

interface companyData {
  name?: string
  cnpj?: string
  isInactive?: boolean
}

export const companyService = {
    async getCompany(authId: number){
        try{
            const company = await prisma.company.findUnique({
                where:{
                    companyId: authId
                },
                select:{
                    companyId: true,
                    name: true,
                    cnpj: true,
                    isInactive: true
                }
            })
            if(!company){
                throw new AppError("Empresa não encontrada.", 404)
            }

            return company
        } catch (error){
            console.log(error)
            throw error
        }
    },  
    async updateCompany(companyIdUpdate: number, data: companyData, authId: number){
        try{
            if( companyIdUpdate !== authId){
                throw new AppError("Acesso negado.",403)
            }

            if(data.cnpj){
                if(data.cnpj.length != 14){
                    throw new AppError("Verifique o CNPJ e tente novamente.",400)
                }

                const existsCnpj = await prisma.company.findFirst({
                    where:{
                        cnpj: data.cnpj,
                        NOT: {
                            companyId: companyIdUpdate
                        }
                    }
                })
                if(existsCnpj){
                    throw new AppError("CNPJ indisponivel.",409)
                }
            }

            return await prisma.company.update({
                where:{ 
                    companyId: companyIdUpdate 
                },
                data:data,
                select: { 
                    companyId: true,
                    name: true,
                    cnpj: true,
                    isInactive: true
                }
            })
        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError("Este CNPJ já está cadastrado em outra empresa.", 409)                
                }
            }
            console.log(error)
            throw error
        }
    }
    
}