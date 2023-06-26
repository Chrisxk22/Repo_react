const express = require ("express");
const router = new express.Router();
const conn = require ("../db/conn");

//Registrar datos de usuario                                 

router.post("/create",(req,rest)=>{


    console.log(req.body);

});

module.exports = router;