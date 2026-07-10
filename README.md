# CountIQ

O **CountIQ** é um projeto desenvolvido inicialmente para resolver um problema real do cotidiano de uma empresa familiar. O processo antigo exigia listar todos os produtos no sistema, imprimir a lista, realizar as contagens manualmente no papel e, por fim, digitar tudo de volta no sistema.

O objetivo desta aplicação é eliminar o uso de papel no inventário, tornando o processo 100% digital, ágil e pré-automatizado.

---

## 📋 Sobre o Projeto

O CountIQ é uma aplicação web multiempresa (multi-tenant) voltada para pequenas e médias empresas que ainda dependem de processos manuais para controlar seu estoque.

Cada empresa cadastrada opera de forma isolada, com seus próprios produtos, listas, usuários e contagens.

O fluxo de trabalho foi pensado da seguinte maneira:

1. **Cadastre** os produtos da empresa uma única vez
2. **Organize** esses produtos em listas (por categoria, setor, fornecedor, etc.)
3. **Inicie uma contagem** a partir de uma lista, direto pelo celular, enquanto percorre o estoque fisicamente
4. **Acompanhe e audite** os resultados em tempo real, de qualquer dispositivo

A interface possui responsividade tanto para desktop como para mobile, permitindo que as contagens sejam feitas diretamente pelo celular, como se fosse um coletor de dados.

---

## 🧠 Funcionalidades

### 🏢 Cadastro de Empresas e Usuários

* **Primeiro Acesso:** O usuário registra sua empresa, criando automaticamente um usuário administrador (`ADMIN`)
* **Controle de Acessos:** Demais usuários vinculados à mesma empresa devem ser criados por um `ADMIN`
* **Níveis de Permissão:**
  * `ADMIN`: Possui acesso total ao sistema da empresa
  * `Padrão`: Possui acesso restrito a determinadas ações administrativas

### 📦 Cadastro de Produtos

* Registro completo de produtos com opções de criação, edição e inativação

### 📝 Criação de Listas

* Agrupamento de produtos em listas personalizadas (ex: "Bebidas", "Marca X") para facilitar a organização das contagens

### ⚡ Gerenciamento de Contagens

* Com base nas listas criadas, os produtos podem ser carregados na tela de contagem
* Contagem otimizada para celulares, com botões de incremento/decremento ou inserção direta de quantidade
* Após a contagem, o responsável pela análise pode visualizar e imprimir os itens contados

---

## 🛠️ Tecnologias Utilizadas

**Frontend**
* React + Vite + TypeScript
* TailwindCSS
* Axios

**Backend**
* Node.js + Express + TypeScript
* Prisma ORM 7 (`@prisma/adapter-pg`)
* PostgreSQL

**Infraestrutura**
* [Supabase](https://supabase.com) — banco de dados PostgreSQL gerenciado
* [Render](https://render.com) — hospedagem do backend (Web Service) e frontend (Static Site)

---

## 🚀 Como Rodar o Projeto

> 🌐 **Link Oficial da Aplicação:** https://countiq-app.onrender.com

Se desejar rodar o projeto localmente em sua máquina, siga os passos abaixo.

### Pré-requisitos

* [Node.js](https://nodejs.org/) instalado em seu sistema operacional
* Um banco de dados [PostgreSQL](https://www.postgresql.org/) ativo (local ou remoto)
* [Git](https://git-scm.com/) (opcional, para clonar)

### Estrutura do projeto

Este é um monorepo dividido em duas pastas independentes:

```
CountIQ/
├── backend/
└── frontend/
```

Cada pasta possui seu próprio `package.json` e deve ser configurada separadamente.

### Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/MuriloDalMolim/CountIQ
   ```

2. Instale as dependências do **backend**:
   ```bash
   cd backend
   npm install
   ```

3. Crie um arquivo `.env` dentro da pasta `backend/` com o seguinte modelo:
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   JWT_SECRET="uma_string_aleatoria_e_forte"
   FRONTEND_URL="http://localhost:5173"
   PORT=3000
   ```
   > `DATABASE_URL` e `DIRECT_URL` podem apontar para o mesmo banco em ambiente local.

4. Aplique as migrations no banco de dados (ainda dentro de `backend/`):
   ```bash
   npx prisma migrate dev
   ```

5. Em um novo terminal, instale as dependências do **frontend**:
   ```bash
   cd frontend
   npm install
   ```

6. Crie um arquivo `.env` dentro da pasta `frontend/`:
   ```bash
   VITE_API_URL="http://localhost:3000"
   ```

7. Abra dois terminais separados e rode cada parte da aplicação:

   * **Terminal 1** (backend):
     ```bash
     cd backend
     npm run dev
     ```

   * **Terminal 2** (frontend):
     ```bash
     cd frontend
     npm run dev
     ```

8. Acesse a aplicação em `http://localhost:5173`.
