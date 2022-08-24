const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS AS tipopagamento
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tipopagamento;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    tipopagamento: result.map(n => {
                        return {
                            id_tipo_pagamento: n.id_tipo_pagamento,
                            nome: n.nome,
                            taxa_percentual: n.taxa_percentual,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna uma venda específico',
                                url: 'http://localhost:3000/tipopagamento/' + n.id_tipo_pagamento
                            }
                        }
                    })
                }
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({response})
            }
        )
    })
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO tipopagamento (nome, taxa_percentual) VALUES (?, ?)',
            [req.body.nome, req.body.taxa_percentual],
            (error, resultado, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'Tipo de Pagamento inserido com sucesso',
                    tipoPagCriado: {
                        id_tipo_pagamento: resultado.id_tipo_pagamento,
                        nome: req.body.nome,
                        taxa_percentual: req.body.taxa_percentual,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todas os Tipos de Pagamento',
                            url: 'http://localhost:3000/tipopagamento'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UMA VENDA ESPECIFICA
router.get('/:id_tipo_pagamento', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tipopagamento WHERE id_tipo_pagamento = ?;',
            [req.params.id_tipo_pagamento],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o Tipo de Pagamento'
                    })
                }
                const response = {
                    tipopagamento: {
                        id_tipo_pagamento: result[0].id_tipo_pagamento,
                        nome: result[0].nome,
                        taxa_percentual: result[0].taxa_percentual,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna um Tipo de Pagamento',
                            url: 'http://localhost:3000/tipopagamento'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
});

// ALTERA UMA VENDA
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE tipopagamento
                SET nome = ?, taxa_percentual = ?
            WHERE id_tipo_pagamento = ?`,
            [
                req.body.nome,
                req.body.taxa_percentual,
                req.body.id_tipo_pagamento
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Tipo de Pagamento atualizado com sucesso',
                    vendaAtualizada: {
                        id_tipo_pagamento: req.body.id_tipo_pagamento,
                        nome: req.body.nome,
                        taxa_percentual: req.body.taxa_percentual,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produtos específico',
                            url: 'http://localhost:3000/tipopagamento/' + req.body.id_tipo_pagamento
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// EXCLUI UM TAXAS
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM tipopagamento WHERE id_tipo_pagamento = ?`, [req.body.id_tipo_pagamento],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Tipo de Pagamento removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere uma Tipo de Pagamento',
                        url: 'http://localhost:3000/tipopagamento',
                        body: {
                            nome: 'String',
                            taxa_percentual: 'Number',
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    });
});

module.exports = router;