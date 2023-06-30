import React, { useEffect, useState } from 'react';
import "../styles/style.css";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSVLink } from "react-csv";
import Swal from 'sweetalert2'
import jsPDF from "jspdf";
import "jspdf-autotable";


export const Productos = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [editar, setEditar] = useState(false);
  const [codigo, setCodigo] = useState(0);
  const [productoList, setProducto] = useState([]);
  const [fabricanteOption, setFabricanteOption] = useState([]);

//hola


  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      precio: precio,
      fabricante: fabricante
    }).then(() => {
      getProducto();
      limpiarCampos();
      Swal.fire({
        title: "<strong>se agrego el producto exitosamente !!!</strong>",
        html: "<i>El Producto <strong>" + nombre + "</strong> fue agregado exitosamente!!</i>",
        icon: 'success',
        timer: 3000
      })
    });
  };

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      codigo: codigo,
      nombre: nombre,
      precio: precio,
      fabricante: fabricante
    }).then(() => {
      getProducto();
      limpiarCampos();
      Swal.fire({
        title: "<strong>se Actualizo el producto exitosamente !!!</strong>",
        html: "<i>El Producto <strong>" + nombre + "</strong> fue actualzado exitosamente!!</i>",
        icon: 'success',
        timer: 3000
      })
    });
  };

  const deleteProducto = (val) => {

    Swal.fire({
      title: 'confirmar Eliminado?',
      html: "<i>Realmente desea eliminar <strong>" + val.nombre + "</strong></i>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.codigo}`).then(() => {
          getProducto();
          limpiarCampos();
          Swal.fire({
            icon: 'success',
            title: val.nombre + 'fue eliminado',
            showConfirmButton: false,
            timer: 2000
          })
        }).catch(function (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se logro eliminar el producto!',
            footer: JSON.parse(JSON.stringify(error)).message === "Newtwork Error" ? "Intente mas tarde" : JSON.parse(JSON.stringify(error)).message
          })
        });

      }
    });

  };

  const limpiarCampos = () => {
    setCodigo("");
    setNombre("");
    setPrecio("");
    setFabricante("");
    setEditar(false);
  }

  const EditarProducto = (val) => {
    setEditar(true);

    setNombre(val.nombre);
    setPrecio(val.precio);
    setFabricante(val.codigo_fabricante);
    setCodigo(val.codigo)
  }


  const getProducto = () => {
    Axios.get("http://localhost:3001/producto").then((response) => {
      setProducto(response.data);
    });
  };

  getProducto();


  const exportarPDF = () => {
    const pdf = new jsPDF();
    const tableHeaders = Object.keys(productoList[0]);
    const tableData = productoList.map((producto) => Object.values(producto));

    pdf.setFontSize(12);
    pdf.text("Tabla de productos", 10, 10);
    pdf.autoTable({
      head: [tableHeaders],
      body: tableData,
    });

    pdf.save("productos.pdf");
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/fabricante")
      .then(result => {
        setFabricanteOption(result.data)
      }).catch(error => {
        console.error("ocurrio un error")
      })
  })

  return (
    <div className="container">

      <div className="card text-center" id='gestion-de-producto'>
        <div className="card-header">
          GESTION DE PRODUCTO
        </div>
        <div className="card-body">
          <div className="inclassNamenput-group mb-3">
            <span className="inclassNamenput-group-text" id="basic-addon1">Nombre:</span>
            <input type="text" value={nombre}
              onChange={(event) => {
                setNombre(event.target.value);
              }}
              className="form-control" placeholder="Ingrese el Producto" aria-label="Username" aria-describedby="basic-addon1" />
          </div>

          <div className="inclassNamenput-group mb-3">
            <span className="inclassNamenput-group-text" id="basic-addon1">Precio:</span>
            <input type="number" value={precio}
              onChange={(event) => {
                setPrecio(event.target.value);
              }}
              className="form-control" placeholder="Ingrese el Precio" aria-label="Username" aria-describedby="basic-addon1" />
          </div>

          <div className="inclassNamenput-group mb-3">
            <span className="inclassNamenput-group-text" id="basic-addon1">Fabricante:</span>
            {/* <input type="number"  value={fabricante}
      onChange={(event) =>{
      setFabricante(event.target.value);
      }}
      className="form-control"  placeholder="Ingrese el codigo del fabricante" aria-label="Username" aria-describedby="basic-addon1"/> */}
            <select className='form-control' onChange={(event) => {
              setFabricante(event.target.value);
            }}>
              <option value="">seleccione uno</option>
              {fabricanteOption.map((fabricanteOption) => {
                return (<option value={fabricanteOption.codigo}>{fabricanteOption.nombre}</option>)
              })}
            </select>
          </div>

        </div>
        <div className="card-footer text-body-secondary">
          {
            editar ?
              <div>
                <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
                <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
              </div>

              : <button className='btn btn-success' onClick={add}>Agregar</button>
          }
        </div>
      </div>

      <div style={{ height: '300px', overflow: 'auto' }}>
        <CSVLink data={productoList} filename={"producto.csv"} className="text-blue-500 hover:text-blue-700"><span className="text-dark dark:text-white" >Exportar a CSV</span></CSVLink>
        <span style={{cursor:"pointer"}}  onClick={window.print}>Imprimir</span>
        <span style={{cursor:"pointer"}}  onClick={exportarPDF}>Exportar PDF</span>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Precio</th>
              <th scope="col">Codigo_Fabricante</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              productoList.map((val, key) => {
                return <tr key={val.codigo}>
                  <th>{val.codigo}</th>
                  <td>{val.nombre}</td>
                  <td>{val.precio}</td>
                  <td>{fabricanteOption.find(e => e.codigo === val.codigo_fabricante)?.nombre}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button"
                        onClick={() => {
                          EditarProducto(val);
                        }}
                        className="btn btn-info m-2">Editar</button>
                      <button type="button" onClick={() => {
                        deleteProducto(val);
                      }} className="btn btn-danger m-2">Eliminar</button>
                    </div>
                  </td>
                </tr>
              })
            }


          </tbody>
        </table>
      </div>

      <style>
        {`
    @media print{
      #gestion-de-producto{
        display:none;
      }
      #nombre-de-fabricante{
        display:none;
      }
      .btn-success{
        display:none;
      }
    }

    `}
      </style>

    </div>
  );
};
