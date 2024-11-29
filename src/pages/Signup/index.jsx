import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './signup.module.css'
import Trash from '../../assets/trash.png'
import Pencil from '../../assets/pencil.png'
import api from '../../services/api'



function Signup() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("Cliente"); // serve para o estado do tipo do usuário 

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()
  const inputPassword = useRef()
  const navigate = useNavigate()

  async function getUsers() {
    const usersFromApi = await api.get('/signup')

    setUsers(usersFromApi.data)
  }

  async function realizarCadastro() {

    if (loading) return; // Evita múltiplos cliques
    setLoading(true);

    const name = inputName.current.value.trim();
    const age = parseInt(inputAge.current.value, 10);
    const email = inputEmail.current.value.trim();
    const password = inputPassword.current.value.trim();

    if (!name || !age || !email || !password) { // validar campos vazios
      alert("Por favor, preencha todos os campos!");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) { // Verificar se o email é válido
      alert("Por favor, insira um email válido!");
      setLoading(false);
      return;
    }

    if (!userType) { // validar tipo de usuário selecionado
      alert("Por favor, selecione o tipo de usuário.");
      setLoading(false);
      return;
    }

    if (isNaN(age) || age <= 0) { // Validar se a idade é um número positivo
      alert("Por favor, insira uma idade válida!");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/signup', {
        name,
        age,
        email,
        password,
        userType,
      });
  
      console.log("Resposta do servidor: ", response.data);
      alert("Cadastro realizado com sucesso! Agora, faça o login.");
      navigate('/signin'); // Redireciona para a tela de login após o cadastro
  
    } catch (error) {
      // Tratamento de erros da requisição
      if (error.response) {
        console.error("Erro retornado pelo servidor:", error.response); // mostra a resposta do servidor 
        alert(error.response.data.error || "Erro ao realizar cadastro");
      } else if (error.request) {
        console.error("Nenhuma resposta do servidor:", error.request); // requisição feita mas sem resposta do servidor
        alert("Servidor não respondeu. Verifique sua conexão.");
      } else {
        console.error("Erro desconhecido: ", error.message); // qualquer outra mensagem de erro
        alert("Erro desconhecido");
      }
    }finally{
      setLoading(false); // habilitar o botão de cadastro novamente
    }

    
  }

  async function fazerLogin() {
    alert("Redirecionando para a tela de login!")
    navigate('/signin')
  }

  useEffect(() => {
    getUsers()
  }, [])

  async function deleteUsers(id) {
    await api.delete(`/signup/${id}`)
    getUsers()
  }


  return (

    <div className={styles.container_cadastro}>
      <form>
        <h1>Cadastro de usuários</h1>
        <input type="text" name='nome' placeholder='Digite seu nome' ref={inputName} />
        <input type="number" name='idade' placeholder='Digite sua idade' ref={inputAge} />
        <input type="email" name='email' placeholder='Digite seu email' ref={inputEmail} />
        <input type="password" name='password' placeholder='Digite sua senha' ref={inputPassword} />

        <label>
        <input type="radio" name="userType" value="cliente" onChange={(e) => setUserType(e.target.value)}/>
        Cliente
        </label>
        
        <label>
        <input type="radio" name="userType" value="barbearia" onChange={(e) => setUserType(e.target.value)}/> 
        Barbearia
        </label>
        
        <button type='button' onClick={realizarCadastro}>Cadastrar</button>
        <button type='button' onClick={fazerLogin}>Já tem uma conta?</button>
      </form>

      {users.map(user => (
        <div className={styles.box_usuarios} key={user.id}>
          <div className={styles.usuarios}>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
            <p>Senha: <span>{user.password}</span></p>
          </div>
          <div className={styles.icones}>
            <button>
              <img src={Pencil} width={30} height={30} />
            </button>
            <button onClick={() => deleteUsers(user.id)}>
              <img src={Trash} width={30} height={30} />
            </button>
          </div>
        </div>
      ))}

    </div>


  )
}

export default Signup
