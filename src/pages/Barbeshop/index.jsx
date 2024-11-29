import { useNavigate} from "react-router-dom";
import { useState, useEffect } from 'react';
import Ze from "../../assets/barbeariadoze.jpg";
import Maos from "../../assets/maosdetesoura.jpg";
import Cabelo from "../../assets/cabelomaluco.jpg";
import styles from './barbershop.module.css';
import api from '../../services/api'

const Barbershop = () => {

  const [user, setUser] = useState(null); // recuperar o usuário logado do localStorage
  const navigate = useNavigate();
  const [barbershops, setBarbershops] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    location: "", // Filtro de localização
    rating: 0, // Filtro de avaliação mínima
    isOpen: null, // Filtro de status
  });
  const [showFilters, setShowFilters] = useState(false); // Controla visibilidade do menu de filtros

  useEffect(() => {
    const fetchBarbershops = async () => {
      // Recupera os dados do usuário do localStorage ( salvos ao logar ) ao carregar o componente
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }


      try {
        const response = await api.get('/barbershops');
        const data = await response.data;
        console.log(data); 

        const updatedData = data.map((shop) => {
          switch (shop.name) {
            case "Barbearia do Zé":
              shop.image = Ze;
              break;
            case "Mãos de Tesoura":
              shop.image = Maos;
              break;
            case "Cabelo Maluco":
              shop.image = Cabelo;
              break;
            default:
              shop.image = "../../assets/cabelomaluco.jpg";
          }
          return shop;
        });

        setBarbershops(updatedData);
      } catch (error) {
        console.error("Erro ao buscar barbearias:", error);
      }
    };

    fetchBarbershops();
  }, []);


  // função para deslogar 
  const logout = () => {
    localStorage.removeItem('user'); // Remove os dados do usuário do localStorage
    navigate('/signin'); // Redireciona para a tela de login
  };




  // Filtra barbearias com base no texto de pesquisa e nos filtros
  const filteredBarbershops = barbershops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesLocation = filters.location
      ? shop.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    const matchesRating = filters.rating ? shop.rating >= filters.rating : true;
    const matchesStatus = filters.isOpen !== null ? shop.isOpen === filters.isOpen : true;

    return matchesSearch && matchesLocation && matchesRating && matchesStatus;
  });

  return (
    <div className={styles.container_barbershop}>
      <header className={styles.header_barbershop}>
        <h1>Barbearias</h1>
        <div className={styles.profile}>
          <span>Olá, {user?.name}!</span>
          <button className={styles.logoutButton} onClick={logout}>Sair</button>
        </div>
      </header>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Localizar barbearias..."
          className={styles.searchInput}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          ☰
        </button>
      </div>

      {/* Menu de Filtros */}
      {showFilters && (
        <div className={styles.filterMenu}>
          <div>
            <label>Localização:</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              placeholder="Digite a localização"
              className={styles.filterInput}
            />
          </div>
          <div>
            <label>Avaliação mínima:</label>
            <input
              type="number"
              min="0"
              max="5"
              value={filters.rating}
              onChange={(e) =>
                setFilters({ ...filters, rating: parseInt(e.target.value, 10) })
              }
              placeholder="0 a 5"
              className={styles.filterInput}
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              value={filters.isOpen}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  isOpen: e.target.value === "true" ? true : e.target.value === "false" ? false : null,
                })
              }
              className={styles.filterInput}
            >
              <option value="">Todos</option>
              <option value="true">Aberta</option>
              <option value="false">Fechada</option>
            </select>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {filteredBarbershops.length === 0 ? (
          <p>Nenhuma barbearia encontrada!</p>
        ): 
        filteredBarbershops.map((shop) => (
          <div key={shop.id} className={styles.card}>
            <img
              src={shop?.image || Ze}
              alt={shop?.name}
              className={styles.image_barbearia}
            />
            <div className={styles.details}>
              <h2>{shop?.name}</h2>
              <p>
                {"⭐".repeat(shop?.rating)}{" "}
                <span className={styles.location}>{shop.location}</span>
              </p>
              <p className={styles.hours}>{shop?.hours}</p>
              <p
                style={{
                  color: shop?.isOpen ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {shop.isOpen ? "ABERTA AGORA" : "FECHADA"}
              </p>
              <button className={styles.viewButton} onClick={() => navigate(`/barbershops/${shop.id}`)}>Visualizar</button>
            </div>
          </div>
        ))}
      </div>
      


    </div>
  );
};



export default Barbershop;