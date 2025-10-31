import { prisma } from "../db.js"

interface companyData {
  name: string;
  cnpj: string;
}

export const companyService = {
    
    async createCompany({name,cnpj}: companyData){
        return await prisma.company.create({
            data: {name,cnpj} 
        })
    },

    async updateCompany(companyid: number, {name,cnpj}: companyData){
        return await prisma.company.update({
            where:{ companyid },
            data:{ name, cnpj }
        })
    },

    async deleteCompany(companyid: number){
        return await prisma.company.delete({
            where:{ companyid }
        })
    }
    
}