import React, { useState } from 'react';
import "../styles/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Axios from "axios";
import Swal from 'sweetalert2';
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";



export const Fabricantes = () => {
  const [nombre, setNombre] = useState("");
  const [productoList, setProducto] = useState([]);
  const [editar, setEditar] = useState(false);
  const [codigo, setCodigo] = useState(0);

  const add = () => {
    Axios.post("http://localhost:3001/createfabricante", {
      nombre: nombre,
    }).then(() => {
      getFabricante();
      Swal.fire({
        title: "<strong>se agrego el producto exitosamente !!!</strong>",
        html: "<i>El Producto <strong>" + nombre + "</strong> fue agregado exitosamente!!</i>",
        icon: 'success',
        timer: 3000
      })
    });
  };

  const update = () => {
    Axios.put("http://localhost:3001/updateFabricante", {
      codigo: codigo,
      nombre: nombre,
    }).then(() => {
      getFabricante();
      limpiarCampos();
      Swal.fire({
        title: "<strong>se Actualizo el producto exitosamente !!!</strong>",
        html: "<i>El Producto <strong>" + nombre + "</strong> fue actualzado exitosamente!!</i>",
        icon: 'success',
        timer: 3000
      })
    });
  };

  const deleteFabricante = (val) => {

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
        Axios.delete(`http://localhost:3001/deleteFabricante/${val.codigo}`).then(() => {
          getFabricante();
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
    setEditar(false);
  }

  const EditarFabricante = (val) => {
    setEditar(true);

    setNombre(val.nombre);
    setCodigo(val.codigo)
  }

  const getFabricante = () => {
    Axios.get("http://localhost:3001/fabricante").then((response) => {
      setProducto(response.data);
    });
  };

  getFabricante();

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

    pdf.save("fabricantes.pdf");
  }
  return (
    <div className="container">
      <div className="card text-center" id='gestion-de-fabricante'>
        <div class="card-header" >
          GESTION DE FABRICANTE
        </div>
        <div class="card-body" id='nombre-de-fabricante'>
          <div className="inclassNamenput-group mb-3">
            <span className="inclassNamenput-group-text" id="basic-addon1">Nombre Fabricante:</span>
            <input type="text" value={nombre}
              onChange={(event) => {
                setNombre(event.target.value);
              }}
              className="form-control" placeholder="Ingrese el Fabricante" aria-label="Username" aria-describedby="basic-addon1" />
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
      <CSVLink data={productoList} filename={"fabricante.csv"} className="text-blue-500 hover:text-blue-700"><span className="text-dark dark:text-white" >Exportar a CSV</span></CSVLink>
      <span style={{cursor:"pointer"}} onClick={window.print}>Imprimir</span>
      <span style={{cursor:"pointer"}}  onClick={exportarPDF}>Exportar PDF</span>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre_fabricante</th>
            <th scope="col">Producto</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            productoList.map((val, key) => {
              return <tr key={val.codigo}>
                <th>{val.codigo}</th>
                <td>{val.nombre}</td>
                <td>{val.nombre}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button"
                      onClick={() => {
                        EditarFabricante(val);
                      }}
                      className="btn btn-info m-2">Editar</button>
                    <button type="button" onClick={() => {
                      deleteFabricante(val);
                    }} className="btn btn-danger m-2">Eliminar</button>
                  </div>
                </td>
              </tr>
            })
          }

          <style>
            {`
    @media print{
      #gestion-de-fabricante{
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
        </tbody>
      </table>
    </div>
  )
}
