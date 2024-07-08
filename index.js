import express from "express";
import morgan from "morgan";

import db from "./dataBase/db.js";

import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

app.listen(3000,()=>{
    console.log("Servidor escuchando en el puerto http://localhost:3000");
});

app.get("/",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "./public/index.html"));
})

//endpoint

app.post("/api/v1/posts", async (req,res)=>{
    try {
        let {usuario, URL, descripcion}=req.body;
        console.log(usuario, URL, descripcion)

        if(!usuario || !URL || !descripcion){
            res.status(400).json({
                msg:"Debe ingresar los datos solicitados [usuario, URL, descripcion]"
            });
        };

        let consulta = {
            text: "INSERT INTO posts(usuario, url, descripcion) VALUES ($1, $2, $3) RETURNING id",
            values: [usuario, URL, descripcion]
        }
        let results = await db.query(consulta);

        let idPost = results.rows[0].id;

        res.status(201).json({
            msg:`Se ha creado correctamente el post con id: ${idPost}`
        });
    } catch (error) {
        res.status(500).json({
            msg:"Error al intentar procesar datos"
        });
    }
});

// retornar post

app.get("/api/v1/posts", async (req,res)=>{
    try {
        let results = await db.query("SELECT id, usuario, url, descripcion, likes FROM posts ORDER BY id");
        let post = results.rows;
        res.json(post);
    } catch (error) {
        res.status(500).json({
            msg:"Error al intentar acceder a post"
        });
    }
});

// endpoint likes 

app.put("/api/v1/posts", async (req,res)=>{
    try {
        let {id}=req.query;
        console.log(id);

        if(!id){
            return res.status(400).json({
                msg:"Debe proporcionar id válido"
            });
        }

        let consulta = {
            text:"UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING id",
            values:[id]
        }


        let results = await db.query(consulta);
        
        let post = results.rows[0];
        console.log(post)

        res.status(201).json({
            msg:`Like registrado con éxito en post con ID: ${post.id}`
        });

    } catch (error) {
        res.status(500).json({
            msg:"Error al intentar registrar like"
        });
    }
});