const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(__dirname+'/'))

const server = app.listen(3000,
    () => {
        console.log('Servidor iniciado');
    }
)
