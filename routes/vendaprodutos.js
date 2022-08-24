const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS USUARIOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM vendaProdutos;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    vendaProdutos: result.map(u => {
                        return {
                            id_venda_produtos: u.id_venda_produtos,
                            id_venda: u.id_venda,
                            codigo_produto: u.codigo_produto,
                            quantidade: u.quantidade,
                            vlr_desconto: u.vlr_desconto,
                            vlr_produto: u.vlr_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um registro específico',
                                url: 'http://localhost:3000/vendaProdutos/' + u.id_venda_produtos
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

// INSERE UM USUARIOS
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO vendaProdutos (id_venda, codigo_produto, quantidade, vlr_desconto, vlr_produto) VALUES (?,?,?,?,?)',
            [req.body.id_venda, req.body.codigo_produto, req.body.quantidade, req.body.vlr_desconto, req.body.vlr_produto],
            (error, result, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'Registro inserido com sucesso',
                    sorteioCriado: {
                        id_venda_produtos: result.insertId,
                        id_venda: req.body.id_venda,
                        codigo_produto: req.body.codigo_produto,
                        quantidade: req.body.quantidade,
                        vlr_desconto: req.body.vlr_desconto,
                        vlr_produto: req.body.vlr_produto,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todos os vendaProdutos',
                            url: 'http://localhost:3000/vendaProdutos'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UM USUARIOS ESPECIFICO
router.get('/:id_venda_produtos', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM vendaProdutos WHERE id_venda_produtos = ?;',
            [req.params.id_venda_produtos],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado vendaProdutos com este ID'
                    })
                }

                const response = {
                    
                    vendaProdutos: {
                        id_venda_produtos: result[0].id_venda_produtos,
                        id_venda: result[0].id_venda,
                        codigo_produto: result[0].codigo_produto,
                        quantidade: result[0].quantidade,
                        vlr_desconto: result[0].vlr_desconto,
                        vlr_produto: result[0].vlr_produto,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna um vendaProdutos',
                            url: 'http://localhost:3000/vendaProdutos'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
});

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE vendaProdutos
                SET id_venda = ?,
                    codigo_produto = ?,
                    quantidade = ?,
                    vlr_desconto = ?,
                    vlr_produto = ?
            WHERE id_venda_produtos = ?`,
            [req.body.id_venda, req.body.codigo_produto, req.body.quantidade, req.body.vlr_desconto, req.body.vlr_produto, req.body.id_venda_produtos],
            
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Registro atualizado com sucesso',
                    sorteioAtualizado: {
                        id_venda_produtos: req.body.id_venda_produtos,
                        id_venda: req.body.id_venda,
                        codigo_produto: req.body.codigo_produto,
                        quantidade: req.body.quantidade,
                        vlr_desconto: req.body.vlr_desconto,
                        vlr_produto: req.body.vlr_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um usuario específico',
                            url: 'http://localhost:3000/vendaProdutos/' + req.body.id_venda_produtos
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// EXCLUI UM PRODUTO DA VENDA
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM vendaProdutos WHERE id_venda_produtos = ?`, [req.body.id_venda_produtos],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Registro removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um vendaProdutos',
                        url: 'http://localhost:3000/vendaProdutos',
                        body: {
                            id_venda: 'String',
                            tamanho: 'Number'
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    });
});

module.exports = router;