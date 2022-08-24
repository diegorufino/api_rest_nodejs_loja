const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS AS vendaS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM vendas;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    vendas: result.map(n => {
                        return {
                            id_vendas: n.id_vendas,
                            id_tipo_pagamento_1: n.id_tipo_pagamento_1,
                            id_tipo_pagamento_2: n.id_tipo_pagamento_2,
                            data: n.data,
                            vlr_total: n.vlr_total,
                            vlr_desconto: n.vlr_desconto,
                            vlr_final: n.vlr_final,
                            cancelado: n.cancelado,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna uma venda específico',
                                url: 'http://localhost:3000/vendas/' + n.id_vendas
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

// INSERE UM VENDA
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('INSERT INTO vendas (id_tipo_pagamento_1, id_tipo_pagamento_2, vlr_total, vlr_desconto, vlr_final) VALUES (?, ?, ?, ?, ?)',
            [
                req.body.id_tipo_pagamento_1, 
                req.body.id_tipo_pagamento_2, 
                req.body.vlr_total, 
                req.body.vlr_desconto, 
                req.body.vlr_final
            ],
            (error, result, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'venda inserida com sucesso',
                    vendaCriada: {
                        id_vendas: result.insertId,
                        id_tipo_pagamento_1: req.body.id_tipo_pagamento_1,
                        id_tipo_pagamento_2: req.body.id_tipo_pagamento_2,
                        vlr_total: req.body.vlr_total,
                        vlr_desconto: req.body.vlr_desconto,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todas as vendas',
                            url: 'http://localhost:3000/vendas'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UMA VENDA ESPECIFICA
router.get('/:id_vendas', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM vendas WHERE id_vendas = ?;',
            [req.params.id_vendas],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado número vencedor com este ID'
                    })
                }
                const response = {
                    vendas: {
                        id_vendas: result[0].id_vendas,
                        vlr_total: result[0].vlr_total,
                        vlr_desconto: result[0].vlr_desconto,
                        id_tipo_pagamento_1: result[0].id_tipo_pagamento_1,
                        id_tipo_pagamento_2: result[0].id_tipo_pagamento_2,
                        data: result[0].data,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna um número vencedor especifíco',
                            url: 'http://localhost:3000/vendas'
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
    var today = new Date();
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE vendas
                SET 
                cancelado = ?
            WHERE id_vendas = ?`,
            [
                today,
                req.body.id_vendas
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Venda atualizado com sucesso',
                    vendaAtualizada: {
                        id_vendas: req.body.id_vendas,
                        id_tipo_pagamento_1: req.body.id_tipo_pagamento_1,
                        id_tipo_pagamento_2: req.body.id_tipo_pagamento_2,
                        data: req.body.data,
                        vlr_total: req.body.vlr_total,
                        vlr_desconto: req.body.vlr_desconto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um vendas específico',
                            url: 'http://localhost:3000/vendas/' + req.body.id_vendas
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// EXCLUI UM PRODUTOS
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM vendas WHERE id_vendas = ?`, [req.body.id_vendas],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Venda removida com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um venda',
                        url: 'http://localhost:3000/vendas',
                        body: {
                            id_tipo_pagamento_1: 'Number',
                            id_tipo_pagamento_2: 'Number',
                            vlr_total: 'Number',
                            vlr_desconto: 'Number',
                            vlr_final: 'Number',
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    });
});

module.exports = router;