import express from 'express';
import cors from 'cors';
import {readdirSync} from "fs";
import mongoose from 'mongoose';
import csrf from "csurf"
import cookieParser from "cookie-parser"
const morgan = require("morgan");
require("dotenv").config();

const csrfProtection = csrf({cookie: true})


//Crear express Aplicacion

const app = express();

//db
mongoose.connect(process.env.DATABASE).then (() => console.log('DB CONNECTED'))
.catch((err) => console.log("DB CONNECTION ERR =>", err))


//Aplicar middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));



//rutas
readdirSync("./routes").map((r) =>
    app.use("/api", require(`./routes/${r}`))
);

//csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req,res)=>{
    res.json({ csrfToken:req.csrfToken()})
})


//Port
const port = process.env.PORT || 8000;

app.listen( port, () => console.log (`Server esta corriendo en el puerto ${port}`));

