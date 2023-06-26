import React, { useState } from 'react';
import "../styles/style.css";
import Axios from "axios";




export const Productos = () => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [fabricante, setFabricante] = useState('');

const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      precio: precio,
      fabricante: fabricante
    }).then(() => {
      alert("Producto registrado");
    });
  };

  return (
    <div className='App'>
      <div className='datos'>
        <label>Nombre: <input type='text' value={nombre} onChange={e => setNombre(e.target.value)} /></label>
        <label>Precio: <input type='number' value={precio} onChange={e => setPrecio(e.target.value)} /></label>
        <label>fabricante: <input type='text' value={fabricante} onChange={e => setFabricante(e.target.value)} /></label>
        <button onClick={add}>Agregar</button>
      </div>
    </div>
  );
};
