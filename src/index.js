import express from 'express';
import dotenv from'dotenv';
import cors from 'cors';
import pg from 'pg';
dotenv.config();

const {Client } = pg;
const client = new Client({
    user:process.env.POSTGRES_USER,
    password:process.env.POSTGRES_PASSWORD,
    database:process.env.POSTGRES_DB,
    host:process.env.POSTGRES_HOST,
    port:process.env.POSTGRES_PORT
})

conectar();

async function conectar() {
        await client.connect();
}

const app = express();

app.use(express.json());
app.use(cors());

app.get('/svg/:estado/:municipio',async(req,res)=>{
    const {estado,municipio} = req.params;
    let pathEstado = await client.query('Select ST_AsSVG(geom) FROM WHERE nome ilike $1',[estado]);
    let pathMunicipio = await client.query('Select ST_AsSVG(geom) FROM WHERE nome ilike $1',[municipio]);
    let viewBox = await client.query('Select viewBox($1)',[estado]);

    res.json({
            pathestado:pathEstado.rows[0].st_assvg,
            pathmunicipio:pathMunicipio.rows[0].st_assvg,
            viewBox:viewBox.rows[0].getviewbox
        })
})


app.listen(3000,()=>{
    console.log('Servidor ligado');
})

