const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS AS colaboradores
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM colaboradores;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    colaboradores: result.map(n => {
                        return {
                            id_colaborador: n.id_colaborador,
                            nome: n.nome,
                            codigo: n.codigo,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um colaborador específico',
                                url: 'http://localhost:3000/colaboradores/' + n.id_colaborador
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

// INSERE UM COLABORADOR
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO colaboradores (nome, codigo) VALUES (?, ?)',
            [req.body.nome, req.body.codigo],
            (error, resultado, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'colaborador inserido com sucesso',
                    colaboradorCriado: {
                        id_colaborador: resultado.id_colaborador,
                        nome: req.body.nome,
                        codigo: req.body.codigo,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todas as colaboradores',
                            url: 'http://localhost:3000/colaboradores'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UMA VENDA ESPECIFICA
router.get('/:id_colaborador', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM colaboradores WHERE id_colaborador = ?;',
            [req.params.id_colaborador],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado colaborador com este ID'
                    })
                }
                const response = {
                    colaboradores: {
                        id_colaborador: result[0].id_colaborador,
                        nome: result[0].nome,
                        codigo: result[0].codigo,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna um colaborador especifíco',
                            url: 'http://localhost:3000/colaboradores'
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
            `UPDATE colaboradores
                SET nome = ?, codigo = ?
            WHERE id_colaborador = ?`,
            [
                req.body.nome,
                req.body.codigo,
                req.body.id_colaborador
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'colaborador atualizado com sucesso',
                    colaboradorAtualizada: {
                        id_colaborador: req.body.id_colaborador,
                        nome: req.body.nome,
                        codigo: req.body.codigo,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produtos específico',
                            url: 'http://localhost:3000/colaboradores/' + req.body.id_colaborador
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// EXCLUI UM COLABORADOR
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM colaboradores WHERE id_colaborador = ?`, [req.body.id_colaborador],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Registro removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um colaborador',
                        url: 'http://localhost:3000/colaboradores',
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