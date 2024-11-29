# Projeto construído durante a matéria Paradigmas de Liguagem de Programação. E consiste uma API para agendamento de horários para uma barbearia.

🚉 Rotas
Rotas de autenticação:

/ - Tela principal de escolha ( cadastro ou login )
/signup - Cadastro
/siginin - Login
/barbershops - Visualização das barbearias
/barbershops/:id - Detalhes da barbearia

💻 Tecnologias
Esse projeto foi desenvolvido com as seguintes tecnologias:

Node.js
Javascript
MongoDB

Bibliotecas necessárias
Prisma
Axios
Cors

🚀 Como rodar o projeto
# Clone o projeto via http
git clone https://github.com/yjoaoneto/projeto_barbearia.git

# Entrar na pasta do projeto backend
cd barbershop

### Instalar as depedencias usando yarn
npm i

### Rodar o servidor
node server.js

#Rodar o projeto
npm run dev

#Rodar atualizações do banco mongo 
npx prisma db push

!!! Lembrar de vincular seu banco de dados no arquivo .env !!!


