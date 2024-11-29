import express, { response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())
app.listen(8000)


// ---------------------------------------------------------------------


// ROTA PARA LISTAR USUÁRIOS NA ROTA SIGNUP ( TESTE )

app.get('/signup', async (req, res) => {  // listar usuários 

    const users = await prisma.user.findMany()

    res.status(200).json(users)
})


// ---------------------------------------------------------------------


// ROTA PARA CRIAR USUÁRIOS NA ROTA SIGNUP

app.post('/signup', async (req, res) => { // criar usuários 
    try {
        const { email, name, age, password, userType } = req.body;

        if (!email || !name || !age || !password || !userType) { // validação de campos preenchidos
            return res.status(400).send("Todos os campos são obrigatórios.");
        }

        const validUserTypes = ["cliente", "barbearia"]; // validar os tipos válidos de usuário
        if (!validUserTypes.includes(userType)) {
            return res.status(400).json({ error: "Tipo de usuário inválido." });
        }

        // Validar formato do email
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email inválido." });
        }

        // Verificar se a idade é um valor positivo
        const parsedAge = parseInt(age, 10);
        if (isNaN(parsedAge) || parsedAge <= 0) {
            return res.status(400).json({ error: "Idade inválida. O usuário deve ter uma idade com valor positivo." });
        }

        // Verificar duplicação de email no sistema
        const usuarioExistente = await prisma.user.findUnique({
            where: { email },
        });
        if (usuarioExistente) {
            return res.status(400).json({ error: "Email já cadastrado." });
        }

        const saltRounds = 10; // Número de iterações para gerar o hash
        const hashedPassword = await bcrypt.hash(password, saltRounds); // criptografar a senha com hash bcrypt

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                age: parseInt(age, 10),
                password: hashedPassword,
                userType
            },
        });

        // caso dê tudo certo ao criar o usuário, retornar o sucesso sem a senha. 
        return res.status(201).json({
            message: "Usuário criado com sucesso.",
            user: { id: newUser.id, name: newUser.name, email: newUser.email, userType: newUser.userType }
        });


    } catch (error) {
        console.error("Erro ao criar usuário", error);
        return res.status(500).json({ error: "Erro no servidor. Tente novamente mais tarde." });
    }
})


// ---------------------------------------------------------------------


// ROTA PARA EDITAR USUÁRIOS NA ROTA SIGNUP ( TESTE )

app.put('/signup/:id', async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.status(400).send("O ID do usuário é obrigatório.");
        }


        const { email, name, age, password } = req.body;
        if (!email || !name || !age || !password) {
            return res.status(400).send("Todos os campos são obrigatórios.");
        }


        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id, 10),
            },
            data: {
                email,
                name,
                age: parseInt(age, 10),
                password: hashedPassword
            }
        });


        res.status(200).json({
            message: "Usuário atualizado com sucesso.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
    }
});


// ---------------------------------------------------------------------


// ROTA PARA DELETAR USUÁRIOS EM SIGNUP ( TESTE )

app.delete('/signup/:id', async (req, res) => { // deletar usuários

    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({ message: "usuário deletado com sucesso!" })

})


// ---------------------------------------------------------------------


// ROTA PARA VALIDAÇÃO NO LOGIN DE USUÁRIOS NA ROTA SIGNIN

app.post('/signin', async (req, res) => {
    console.log("Dados recebidos no servidor: ", req.body);

    const { email, password, userType } = req.body;

    if (!email || !password || !userType) { // validar para preencher todos os campos
        return res.status(400).json({ error: "Por favor, forneça email, senha e tipo de usuário" });
    }

    const validUserTypes = ["cliente", "barbearia"]; // validar tipos válidos
    if (!validUserTypes.includes(userType)) {
        return res.status(400).json({ error: "Tipo de usuário inválido" });
    }

    try {
        // validação para buscar o email do usuário no banco
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                userType: userType, // filtro de validação do tipo do usuário
            },
        });


        if (!user) {
            console.log("Usuário não encontrado para o email e tipo: ", email, userType);
            return res.status(400).json({ error: "Usuário não encontrado" });
        }


        // validação para verificar se a senha está correta
        const passwordCorrect = await bcrypt.compare(password, user.password);
        console.log("senha recebida: ", password);
        console.log("Hash armazenado: ", user.password);
        console.log("Senha válida: ", passwordCorrect);

        if (!passwordCorrect) { // validar se a senha está correta
            return res.status(400).json({ error: "A senha está incorreta" });
        }

        return res.status(200).json({  // caso tudo esteja correto, retora uma mensagem de validação que deu tudo ok e apresenta os dados do usuário
            message: "Login bem sucecido!",
            user: { id: user.id, name: user.name, email: user.email, userType: user.userType }
        });


    }
    catch (error) {
        console.error("Erro no servidor: ", error);
        return res.status(500).json({ error: "Erro no servidor" });
    }
})


// parte de testes com as barbearias

const barbershops = [
    {
        id: 1,
        name: "Barbearia do Zé",
        rating: 4,
        location: "José Américo",
        hours: "Seg a Sex: 8:00 às 12:00",
        isOpen: true,
        avaliation: 2.5,
        image: "./barbeariadoze.jpg",
        about: "A Barbearia do Zé é um espaço tradicional e acolhedor, conhecido por oferecer cortes de cabelo e barbas de alta qualidade em um ambiente descontraído.",
        description: "Com mais de 10 anos de história, a Barbearia do Zé é reconhecida por sua atenção aos detalhes e atendimento impecável."
    },
    {
        id: 2,
        name: "Mãos de Tesoura",
        rating: 2,
        location: "Funcionários 2",
        hours: "Seg a Sex: 13:00 às 19:00",
        avaliation: 4,
        isOpen: false,
        image: "./maosdetesoura.jpg",
        about: "A Barbearia Mãos de Tesoura é um espaço tradicional e acolhedor, conhecido por oferecer cortes de cabelo e barbas de alta qualidade em um ambiente descontraído.",
        description: "Com mais de 20 anos de história, a Barbearia Mãos de Tesoura é reconhecida por sua atenção aos detalhes e atendimento impecável."
    },
    {
        id: 3,
        name: "Cabelo Maluco",
        rating: 1,
        location: "Valentina",
        hours: "Seg a Sex: 19:00 às 00:00",
        avaliation: 5,
        isOpen: true,
        image: "./cabelomaluco.jpg",
        about: "A Barbearia Cabelo Maluco é um espaço tradicional e acolhedor, conhecido por oferecer cortes de cabelo e barbas de alta qualidade em um ambiente descontraído.",
        description: "Com mais de 15 anos de história, a Barbearia Cabelo Maluco é reconhecida por sua atenção aos detalhes e atendimento impecável."
    },
];

// Rota para retornar as barbearias
app.get('/barbershops', (req, res) => {
    res.json(barbershops);
});

app.get('/barbershops/:id', (req, res) => {
    const { id } = req.params;
    const barbershop = barbershops.find((shop) => shop.id === parseInt(id, 10)); // retorna o objeto da barbearia caso o id seja encontrado
    if (barbershop) {
        res.json(barbershop);
    } else {
        res.status(404).send('Barbearia não encontrada');
    }
});


app.post('/barbershops/:id/appointments' , async (req, res) => {
    console.log("Dados recebidos no servidor: ", req.body);

    const { date_time,userId } = req.body;

    if (!date_time || !userId) {
        return res.status(400).json({ error: "Data, horário ou usuário ausentes" });
    }


    try {

        const parsedDate = new Date(date_time);

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: "Formato de data inválido" });
        }

        const agendamento = await prisma.agendamentos.create({
            data: {
                date_time: parsedDate,
                userId,
            },
        });

        return res.status(200).json({  // caso tudo esteja correto, retora uma mensagem de validação que deu tudo ok e apresenta os dados do usuário
            message: "Agendamento foi feito com sucesso",
            agendamento 
        });
 
    }
    catch (error) {
        console.error("Erro no servidor: ", error);
        return res.status(500).json({ error: "Erro no servidor" });
    }


})


app.get('/barbershops/:id/appointments', async (req, res) => {
    const { userId } = req.query; // Supondo que o ID do usuário seja enviado como parâmetro de consulta
  
    if (!userId) {
      return res.status(400).json({ error: "ID do usuário ausente" });
    }
  
    try {
      const agendamentos = await prisma.agendamentos.findMany({
        where: { userId },
        orderBy: { date_time: 'asc' }, // Opcional, ordena os agendamentos
      });
  
      if (agendamentos.length === 0) {
        return res.status(404).json({ message: "Nenhum agendamento encontrado" });
      }
  
      return res.status(200).json(agendamentos);
    } catch (error) {
      console.error("Erro ao buscar agendamentos: ", error);
      return res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  });

/*
async function updateExistingUsers() {
    await prisma.barbearia.updateMany({
      data: {
        avaliation: 2.5
  // Valor padrão ou personalizado
      },
    });
    console.log('Campos atualizado para registros existentes.');
  }

  updateExistingUsers()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
 função para atualizar campos na tabela    */ 