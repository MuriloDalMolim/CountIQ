import { prisma } from "../db.js"

interface companyData {
  name?: string,
  cnpj?: string,
}

export const companyService = {
    
    async updateCompany(companyIdUpdate: number, data: companyData, authId: number){
        if( companyIdUpdate !== authId){
            throw new Error("Acesso negado. Você não pode editar esta empresa.");
        }

        try{
            return await prisma.company.update({
                where:{ 
                    companyid: companyIdUpdate 
                },
                data:data
            })
        }   catch (error){
                console.log(error)
                throw error
            }
    }
    
}