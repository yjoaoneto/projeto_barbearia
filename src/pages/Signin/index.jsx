import { formToJSON } from 'axios'
import React from 'react'
import styles from './signin.module.css'
import { useRef , useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function Signin (){

  const inputEmail = useRef()
  const inputPassword = useRef()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false); // serve para o estado de carregamento da página, evitando múltiplas requisições de uma vez
  const [userType, setUserType] = useState(""); // armazenar o valor do userType selecionado pelo usuário

  
  async function realizarLogin() {
    if (loading) return; // Evita múltiplos cliques
      setLoading(true); 

    const email = inputEmail.current.value.trim(); // -> remove os espaços em branco 
    const password = inputPassword.current.value.trim();

    // validações

    if (!email || !password) { // validar que os campos foram preenchidos 
      alert("Por favor, preencha todos os campos!");
      setLoading(false);
      return;
    }

    if (!userType) { // validar o tipo do usuário
      alert("Por favor, selecione o tipo de usuário.");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) { // validar que foi digitado um email válido
      alert("Por favor, insira um email válido!");
      setLoading(false);
      return;
    }

    console.log("Dados que serão enviados:");
    console.log({ email, password, userType});
    


    // tratamentos de erro
    try{
      const response = await api.post('/signin', {
        email,
        password,
        userType,
      });

      if (response.status === 200) {
        const { user } = response.data; // Obtém os dados do usuário retornados pelo back-end
        localStorage.setItem('user', JSON.stringify(user)); // Armazena os dados do usuário no localStorage como string JSON
        alert(`Bem-vindo, ${user.name}`);
        navigate('/barbershops'); 
      } // caso dê tudo certo, retorna a mensagem de boas vindas e redireciona o usuário para tela inicial

    }catch(error){
      if(error.response){
        console.error("Erro retornado pelo servidor:", error.response); // mostra a resposta do servidor
        alert(error.response.data.error || "Erro no servidor") 
      }
      else if (error.request){
        console.error("Nenhuma resposta do servidor:", error.request); // indica que a requisição foi feita mas o servidor não respondeu
        alert("Servidor não respondeu. Verifique sua conexão.");
        
      }
      else{
        console.error("erro desconhecido: ", error.message); // qualquer outra mensagem de erro inesperada
        alert("Erro desconhecido"); 
      }
    }finally{
      setLoading(false); // habilita o botão de login novamente
    }
    
  }


  async function fazerCadastro() {
    alert("Redirecionando para a tela de cadastro!")
    navigate('/signup')
  }


  return (
    <div className={styles.container_login}>
      <form>
        <h1>Login de usuários</h1>
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


        <button type='button' onClick={realizarLogin} disabled={loading}
        >{loading ? "Entrando..." : "Entrar"}</button>
        <button type='button' onClick={fazerCadastro}>Não tem uma conta?</button>
      </form>
    </div>
  )
}

export default Signin