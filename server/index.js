const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");



// Crear una instancia de la aplicación Express
const app = express();
const port = "3001";

// Configurar la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tienda",
  port: "3306",
});


// Conectar a la base de datos
db.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos: ", error);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});


// Middleware para permitir solicitudes de diferentes dominios
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi API!");
});

app.post("/create", (req,res)=>{
  const nombre = req.body.nombre;
  const precio = req.body.precio;
  const fabricante = req.body.fabricante;

  db.query('INSERT INTO producto(nombre, precio, codigo_fabricante) VALUES (?, ?, ? )',[nombre, precio, fabricante],
  (err,result) =>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  } 
  );
});

app.post("/createFabricante", (req,res)=>{
  const nombre = req.body.nombre;
  db.query('INSERT INTO fabricante(nombre) VALUES (?)',[nombre],
  (err,result) =>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  } 
  );
});

app.get("/producto", (req,res)=>{  
   db.query('SELECT * FROM producto',
  (err,result) =>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  } 
  );
});

app.get("/fabricante", (req,res)=>{  
  db.query('SELECT * FROM fabricante',
 (err,result) =>{
   if(err){
     console.log(err);
   }
   else{
     res.send(result);
   }
 } 
 );
});

app.put("/update", (req,res)=>{
  const codigo = req.body.codigo;
  const nombre = req.body.nombre;
  const precio = req.body.precio;
  const fabricante = req.body.fabricante;

  db.query('UPDATE producto SET nombre=?, precio=?, codigo_fabricante=? WHERE codigo=?',[nombre, precio, fabricante, codigo],
  (err,result) =>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  } 
  );
});

app.put("/updateFabricante", (req,res)=>{
  const codigo = req.body.codigo;
  const nombre = req.body.nombre;
  

  db.query('UPDATE fabricante SET nombre=? WHERE codigo=?',[nombre, codigo],
  (err,result) =>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  } 
  );
});

app.delete("/delete/:codigo", (req,res)=>{
  const codigo = req.params.codigo;
  
  db.query('DELETE FROM producto WHERE codigo=?',codigo,
  (err,result) =>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  } 
  );
});

app.delete("/deleteFabricante/:codigo", (req,res)=>{
  const codigo = req.params.codigo;
  
  db.query('DELETE FROM fabricante WHERE codigo=?',codigo,
  (err,result) =>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  } 
  );
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});