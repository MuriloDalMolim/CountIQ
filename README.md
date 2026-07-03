#  CountIQ

O **CountIQ** é um projeto desenvolvido inicialmente para resolver um problema real do cotidiano de uma empresa familiar. O processo antigo exigia listar todos os produtos no sistema, imprimir a lista, realizar as contagens manualmente no papel e, por fim, digitar tudo de volta no sistema

O objetivo desta aplicação é eliminar o uso de papel no inventário, tornando o processo 100% digital, ágil e pré-automatizado

---

## 📋 Sobre o Projeto

O CountIQ é uma aplicação web multiempresa (multi-tenant) voltada para pequenas e médias empresas que ainda dependem de processos manuais para controlar seu estoque.

Cada empresa cadastrada opera de forma isolada, com seus próprios produtos, listas, usuários e contagens

O fluxo de trabalho foi pensado da seguinte maneira:

1. **Cadastre** os produtos da empresa uma única vez
2. **Organize** esses produtos em listas (por categoria, setor, fornecedor, etc.)
3. **Inicie uma contagem** a partir de uma lista, direto pelo celular, enquanto percorre o estoque fisicamente
4. **Acompanhe e audite** os resultados em tempo real, de qualquer dispositivo

A interface possui responsividade tanto para desktop como para mobile, permitindo que as contagens sejam feitas diretamente pelo celular, como se fosse um contador 

---

## 🧠 Funcionalidades

### 🏢 Cadastro de Empresas e Usuários
* **Primeiro Acesso:** O usuário registra sua empresa criando automaticamente uma usuário administrador (`ADMIN`)
* **Controle de Acessos:** Demais usuários vinculados à mesma empresa devem ser criados por um `ADMIN`
* **Níveis de Permissão:**
  * `ADMIN`: Possui acesso total ao sistema da empresa
  * `Padrão`: Fica privado de realizar alguns tipos de ações
  
### 📦 Cadastro de Produtos
* Registro completo de produtos com opções de criação, edição e inativação

### 📝 Criação de Listas
* Agrupamento de produtos em listas personalizadas (ex: "Bebidas", "X marca") para facilitar a organização das contagens

### ⚡ Gerenciamento de Contagens
* Com base nas listas criadas, os produtos podem ser carregados na tela de contagem
* Contagem otimizada para celulares, com botões de incremento/decremento ou inserção direta de quantidade
* Após a contagem, o responsável pela análise pode visualizar os itens contados

---

## 🛠️ Tecnologias Utilizadas

* **Linguagem:** Node.js, TypeScript
* **Frontend:** React, TailwindCSS
* **Backend & Banco de Dados:** Prisma ORM, PostgreSQL

---

## 🚀 Como Rodar o Projeto

> 🌐 **Link Oficial da Aplicação:** *Irei inserir o link aqui assim que o deploy for concluído*

Se desejar rodar o projeto localmente em sua máquina, siga os passos abaixo:
### Pré-requisitos
* Certifique-se de ter o [Node.js](https://nodejs.org/) instalado  seu sistema operacional.
* Um banco de dados [PostgreSQL](https://www.postgresql.org/) ativo
* [Git](https://git-scm.com/) (opcional, para clonar)

### Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/MuriloDalMolim/CountIQ
2. Instale as dependências do projeto na raiz:
   ```bash
   npm install
3. Crie um arquivo .env na raiz do projeto seguindo o modelo do seu banco de dados:
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
4. Crie as tabelas no banco de dados:
   ```bash
   npx prisma migrate dev
5. Abra agora 2 terminais separados e rode:
  * Terminal 1:
     ```bash
     cd backend
     npm run dev
  * Terminal 1:
     ```bash
     cd frontend
     npm run dev
