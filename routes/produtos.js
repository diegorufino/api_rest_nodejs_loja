const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    produtos: result.map(s => {
                        return {
                            id_produtos: s.id_produtos,
                            codigo: s.codigo,
                            nome: s.nome,
                            valor: s.valor,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto específico',
                                url: 'http://localhost:3000/produtos/' + s.id_produtos
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

// INSERE UM PRODUTOS
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO produtos (codigo, nome, valor) VALUES (?, ?, ?)',
            [req.body.codigo, req.body.nome, req.body.valor],
            (error, resultado, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'produto inserido com sucesso',
                    produtoCriado: {
                        id_produtos: resultado.id_produtos,
                        codigo: req.body.codigo,
                        nome: req.body.nome,
                        valor: req.body.valor,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UM PRODUTOS ESPECIFICO
router.get('/:codigo', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE codigo = ?;',
            [req.params.codigo],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produtos com este ID'
                    })
                }

                const response = {
                    
                    produtos: {
                        id_produtos: result[0].id_produtos,
                        codigo: result[0].codigo,
                        nome: result[0].nome,
                        valor: result[0].valor,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
});

// ALTERA UM PRODUTOS
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos
                SET codigo = ?,
                    nome = ?,
                    valor = ?,
            WHERE id_produtos = ?`,
            [
                req.body.codigo,
                req.body.nome,
                req.body.valor,
                req.body.id_produtos,
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produtos: req.body.id_produtos,
                        codigo: req.body.codigo,
                        nome: req.body.nome,
                        valor: req.body.valor,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produtos específico',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produtos
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
            `DELETE FROM produtos WHERE id_produtos = ?`, [req.body.id_produtos],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            codigo: 'String',
                            nome: 'String',
                            valor: 'Number',
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    });
});

module.exports = router;