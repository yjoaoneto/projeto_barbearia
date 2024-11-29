import React from 'react'
import styles from './home.module.css'
import { formToJSON } from 'axios'
import api from '../../services/api'
import Logo from '../../assets/logo.jpg'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate();

  async function fazerCadastro() {
    alert("Redirecionando para a tela de cadastro!")
    navigate('/signup')
  }

  async function fazerLogin() {
    alert("Redirecionando para a tela de login!")
    navigate('/signin')
  }





  return (
    <div className={styles.container_home}>
      <img src={Logo}  width={400} height={400}/>
      <button type='button' onClick={fazerCadastro}>SIGN UP</button>
      <button type='button' onClick={fazerLogin}>SIGN IN</button>
    </div>
  )
}

export default Home