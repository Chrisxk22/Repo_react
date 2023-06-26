import React from 'react';
import {FaBars, FaTimes } from "react-icons/fa";
import {useRef} from 'react';
import "../styles/main.css";

export const Menu = () => {
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  }
  return (
   <header>
    <h3>Titofer.com</h3>
    <nav ref ={navRef}>
     <a href='/'>Dashboard</a>
     <a href='/fabricantes'>Fabricantes</a>
     <a href='/productos'>Productos</a>
     <button className="nav-btn nav-close-btn" onClick={showNavbar}>
        <FaTimes/>
     </button>
    </nav>
    <button className="nav-btn nav-close-btn" onClick={showNavbar}>
      <FaBars/>
    </button>
   </header>
  )
}
  //<div>
       // <a href='/'>Dashboard</a>
       // <a href='/fabricantes'>Fabricantes</a>
      //  <a href='/productos'>Productos</a>
    //</div>