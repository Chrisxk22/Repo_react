const express = require ("express");
const app = express ();
const mysql = require ("mysql2");
const cors = require ("cors");

require ("./db/conn");
const router = require ("./Routes/router");

const port = 3001;

//app.get("/", (req,res)=>{
//res.send("Incio del servidor")
//});

//middleware
app.use(express.json);
app.use(cors());
app.use(router);

app.post("/create",(req,res) =>{
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const fabricante = req.body.fabricante;

    conn.query('INSERT INTO producto(nombre, precio, fabricante) VALUES(?, ?, ?)',[nombre, precio, fabricante],
    (err, result) =>{
        if(err){
            console.log(err);
        }else{
            res.send("Producto registrado con exito");
        }
    
    }
    );
});


app.listen(port, () =>{
    console.log("inicio del servidor en el puerto :" + port);
})

