import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './details_barber.module.css';
import BarberLogo from "../../assets/barbeariadoze.jpg"; // Adicione o logo à pasta de assets
import Ze1 from "../../assets/fotos-barbearias/barbeariaze/barbearia-do-ze.jpeg";
import Ze2 from "../../assets/fotos-barbearias/barbeariaze/imagem2.jpg";
import Ze3 from "../../assets/fotos-barbearias/barbeariaze/imagem3.jpeg";
import Cabelo1 from "../../assets/fotos-barbearias/cabelomaluco/cabelomaluco.jpeg";
import Cabelo2 from "../../assets/fotos-barbearias/cabelomaluco/cabelomaluco2.jpg";
import Cabelo3 from "../../assets/fotos-barbearias/cabelomaluco/imagem3.jpeg";
import Maos1 from "../../assets/fotos-barbearias/maosdetesoura/imagem2.png";
import Maos2 from "../../assets/fotos-barbearias/maosdetesoura/imagem3.jpeg";
import Maos3 from "../../assets/fotos-barbearias/maosdetesoura/maosdetesoura.jpg";
import api from '../../services/api'

function Details_barber() {

  const navigate = useNavigate()

  const inputData = useRef();


  const [showFilters, setShowFilters] = useState(null); // define o estado da caixa que mostra o agendamento
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [agendamentos, setAgendamentos] = useState()
  const [user, setUser] = useState(null); // recuperar o usuário logado do localStorage
  const [barbershop, setBarbershop] = useState(null);
  const images = [Ze1, Ze2, Ze3,Cabelo1,Cabelo2,Cabelo3,Maos1,Maos2,Maos3]; // Lista de imagens para o carrossel
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para o índice da imagem atual

  useEffect(() => {
    // Recupera os dados do usuário do localStorage ( salvos ao logar ) ao carregar o componente
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }


    const fetchBarbershop = async () => {
      try {
        const response = await api.get(`/barbershops/${id}`);
        const data = await response.data;
        console.log(data);
        setBarbershop(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da barbearia:", error);  // Caso a barbearia não seja encontrada
        setBarbershop(null);
      }
    };

    if (id) {
      fetchBarbershop();
    }
  }, [id]);



  useEffect(() => {
    const fetchAgendamentos = async () => {
      if (!user) return; // Garante que o usuário esteja logado

      setLoading(true);
      try {
        const response = await api.get(`/barbershops/${id}/appointments`, {
          params: { userId: user.id },
        });
  
        setAgendamentos(response.data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        setAgendamentos(null);
      }finally{
        setLoading(false);
      }
    };
  
    fetchAgendamentos();
  }, [id, user]);

  


  if (!barbershop) {
    return <p>Barbearia não encontrada ou erro ao carregar os dados.</p>;
  }

  // Funções para avançar e retroceder no carrossel
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Avança para o próximo
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    ); // Volta para o anterior
  };


  const backMenu = () => {
    navigate('/barbershops/'); // Redireciona para a tela de barbearias
  };





  const realizarAgendamento = async () =>{
    if (loading) return; // Evita múltiplos cliques
      setLoading(true);

      const data = {
        date_time: new Date("2024-10-10T10:00:00").toISOString(),
      };

      const dateInput = inputData.current.value;

      if (!dateInput) { // validar que o horário foi preenchido
        alert("Por favor, preencha todo o campo!");
        setLoading(false);
        return;
      }

      const dateTime = new Date(dateInput).toISOString();

      

      try{

        console.log("Dados que serão enviados:");
        console.log({ dateTime });


        const response = await api.post(`/barbershops/${id}/appointments`,{
          date_time: dateTime,
          userId: user.id
        })

        if (response.status === 200) {
          const { agendamento } = response.data; // Obtém os dados do usuário retornados pelo back-end
          setAgendamentos(prevAgendamentos => [...prevAgendamentos, agendamento]); // Armazena os dados do usuário no localStorage como string JSON
          alert(`Agendamento feito em nome de: ${user.name}`);
          
        } else{
          alert("Erro 1 ao realizar o agendamento");
        }
  

      }catch{
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

  


 

  



  return (
    <div className={styles.barbershop_container}>
      <header className={styles.barbershop_header}>
        <img src={BarberLogo} alt="Logo Barbearia" className={styles.barbershop_logo} />
        <h1 className={styles.barbershop_title}>{barbershop?.name}</h1>
        <button className={styles.back_menu} onClick={backMenu}>Voltar</button>
      </header>

      <div className={styles.carousel}>
        <div
          className={styles.carousel_inner}
          style={{ "--current-index": currentIndex }}
        >
          {images.map((image, index) => (
            <div
              className={`carousel_item ${currentIndex === index ? "active" : ""}`}
              key={index}>
              <img className={styles.image_carrosel} src={image} alt={`Imagem ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className={`${styles.carousel_control} ${styles.prev}`} onClick={handlePrev}>
          &#10094;
        </button>
        <button className={`${styles.carousel_control} ${styles.next}`} onClick={handleNext}>
          &#10095;
        </button>
      </div>


      <div className={styles.barbershop_description}>
        <p className={styles.about}>
        {barbershop?.about}
        </p>
        <h2 className={styles.detalhes}>- - Detalhes - -</h2>
        <ul className={styles.detalhes_box}>
          <li>
            <strong>Localização:</strong> {barbershop?.location}
          </li>
          <li>
            <strong>Horário de Funcionamento:</strong> {barbershop?.hours}
          </li>
          <li>
            <strong>Avaliação:</strong> {barbershop?.avaliation}⭐
          </li>
          <li>
            <strong>Descrição:</strong> {barbershop?.description}
          </li>
        </ul>

        <button
          className={styles.botao_agendamento}
          onClick={() => setShowFilters(!showFilters)}
        >
          AGENDAR
        </button>
        {showFilters && (
        <div className={styles.botao_agendamento}>
            <p>Digite pra quando deseja agendar seu corte: </p><input type="datetime-local" name='datetime' ref={inputData}/> 
            <button type='button' onClick={realizarAgendamento}>Agendar corte!</button>
        </div>
      )}
  
      </div>

      <div className={styles.container_agendamentos}>
        <h1>Tela de agendamentos</h1>

        <ul className={styles.box_agendamentos}>
          <li>
            <strong>Nome do cliente:</strong> {user?.name}
          </li>
          {Array.isArray(agendamentos) ? (
          agendamentos.map((agendamento) => (
        <li key={agendamento?.id}>
        <strong>Data e horário do corte:</strong> {new Date(agendamento?.date_time).toLocaleString()}
      </li>
    ))
  ) : (
    <li>Nenhum agendamento encontrado.</li>
  )}
        </ul>
      </div>
    </div>
  );
}

export default Details_barber;
