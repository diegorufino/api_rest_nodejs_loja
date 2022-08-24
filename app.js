const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
const bodyParser = require('body-parser')

const rotaVendas = require('./routes/vendas')
const rotaProdutos = require('./routes/produtos')
const rotaVendaProdutos = require('./routes/vendaprodutos')
const rotaTaxas = require('./routes/taxas')
const rotaColaboradores = require('./routes/colaboradores')
const rotaTipoPagamento = require('./routes/tipopagamento')
const { use } = require('./routes/vendas')

//morgan - monitora todas as acoes mostrando no log
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false })); //apenas dados simples
app.use(bodyParser.json()) //json de entrada no body

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
    app.use(cors())
    next();
})

// ROTA
app.use('/vendas', rotaVendas)
app.use('/produtos', rotaProdutos)
app.use('/vendaProdutos', rotaVendaProdutos)
app.use('/taxas', rotaTaxas)
app.use('/colaboradores', rotaColaboradores)
app.use('/tipoPagamento', rotaTipoPagamento)

app.use((req, res, next) => {
    const erro = new Error('Não encontrado')
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;