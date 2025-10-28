import express from 'express';
import { prisma } from './src/db.js';

const app = express();
app.use(express.json())

app.get('/', async function (req,res) {
    try{
        const company = await prisma.company.findMany();
        res.json(company);
    }catch(error){
        console.log(error);
    }
})

app.get('/:companyid', async (req, res) => {
    const companyid = parseInt(req.params.companyid)

    const company = await prisma.company.findUnique({
        where: {
            companyid: companyid  
        }
    })
    console.log(company)
    res.json({company})
})

app.post('/companycreate', async (req, res) => {
    const {name,cnpj} = req.body

    if (!name){
        res.json({mensagem: "A empresa precisa ter um nome! Favor verificar"})
    } 
    if (!cnpj){
        res.json({mensagem: "A empresa precisa ter um cnpj! Favor verificar"})
    }

    const company = await prisma.company.create({
        data:{
            name: name,
            cnpj
        }
    })
    res.json({company})
})

app.put('/:companyid', async (req,res) =>{
    const companyid = parseInt(req.params.companyid)
    const {name,cnpj} = req.body


    const company = await prisma.company.update({
        where: {companyid : companyid},
        data:{
            name: name,
            cnpj: cnpj
        } 
    })

    res.json(company)
})

app.delete('/:companyid', async (req,res) => {
    const {companyid} = req.params
    
    const company = await prisma.company.delete({
        where: {companyid: parseInt(companyid)}
    })

    res.json({
        mensagem: "Empresa excluido",
        company
    })

})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});