import { prisma } from "../db.js"

interface companyData {
  name?: string,
  cnpj?: string,
}

interface inactiveData {
    inactiveflag?: 'T' | 'F'
}

export const companyService = {
    
    async updateCompany(companyidUpdate: number, data: companyData, authId: number){
        if( companyidUpdate !== authId){
            throw new Error("Acesso negado. Você não pode editar esta empresa.");
        }

        try{
            return await prisma.company.update({
                where:{ 
                    companyid: companyidUpdate 
                },
                data:data
            })
        }   catch (error){
                console.log(error)
                throw error
            }
    },

    async deleteCompany(companyidInactive: number, data: inactiveData, authId: number){
        if (companyidInactive !== authId) {
            throw new Error("Acesso negado. Verifique as credênciais informadas");
        }

        try{
            return await prisma.company.update({
                where:{
                    companyid: companyidInactive
                },
                data:data
            })
        } catch (error){
            console.log(error)
            throw error
        }
    }
    
}