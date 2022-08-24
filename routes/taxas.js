const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS AS TAXAS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM taxas;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    taxas: result.map(n => {
                        return {
                            id_taxa: n.id_taxa,
                            nome: n.nome,
                            valor_percentual: n.valor_percentual,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna uma taxa específica',
                                url: 'http://localhost:3000/taxas/' + n.id_taxa
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
            'INSERT INTO taxas (nome, valor_percentual) VALUES (?, ?)',
            [req.body.nome, req.body.valor_percentual],
            (error, resultado, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'taxa inserida com sucesso',
                    taxaCriado: {
                        id_taxa: resultado.id_taxa,
                        nome: req.body.nome,
                        valor_percentual: req.body.valor_percentual,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todas as taxas',
                            url: 'http://localhost:3000/taxas'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UMA TAXA ESPECIFICA
router.get('/:id_taxa', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM taxas WHERE id_taxa = ?;',
            [req.params.id_taxa],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o registro'
                    })
                }
                const response = {
                    taxas: {
                        id_taxa: result[0].id_taxa,
                        nome: result[0].nome,
                        valor_percentual: result[0].valor_percentual,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna um número vencedor especifíco',
                            url: 'http://localhost:3000/taxas'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
});

// ALTERA UMA TAXA
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE taxas
                SET nome = ?, valor_percentual = ?
            WHERE id_taxa = ?`,
            [
                req.body.nome,
                req.body.valor_percentual,
                req.body.id_taxa
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Taxa atualizada com sucesso',
                    taxaAtualizada: {
                        id_taxa: req.body.id_taxa,
                        nome: req.body.nome,
                        valor_percentual: req.body.valor_percentual,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um taxas específico',
                            url: 'http://localhost:3000/taxas/' + req.body.id_taxa
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
            `DELETE FROM taxas WHERE id_taxa = ?`, [req.body.id_taxa],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Taxa removida com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere uma taxa',
                        url: 'http://localhost:3000/taxas',
                        body: {
                            nome: 'String',
                            valor_percentual: 'Number',
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    });
});


module.exports = router;