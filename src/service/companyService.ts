import { prisma } from "../db.js"

interface companyData {
  name: string;
  cnpj: string;
}

export const companyService = {
    
    async createCompany({name,cnpj}: companyData){
        try{
            return await prisma.company.create({
                data: {name,cnpj} 
            })
        }catch (error){
            throw error;
        }
    },

    async updateCompany(companyidUpdate: number, data: companyData, authId: number){
        if( companyidUpdate !== authId){
            throw new Error("Acesso negado. Você não pode editar esta empresa.");
        }

        try{
            return await prisma.company.update({
                where:{ companyid: companyidUpdate },
                data:{ name: data.name, cnpj: data.cnpj }
            })
        }   catch (error){
                console.log(error)
            }
    },

    async deleteCompany(companyidDelete: number, authId: number){
        if (companyidDelete !== authId) {
            throw new Error("Acesso negado. Você não pode deletar esta empresa.");
        }

        return await prisma.company.delete({
            where:{ companyid: companyidDelete }
        })
    }
    
}