"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(request, response) {
        //Recebe os valores no Body
        const { name, email, password } = request.body;
        // importa a pool de conexão e faz a conexão
        // preenche o callback com erro e a variavel de conexão
        // e faz uma arrow function onde sera feito a query
        mysql_1.pool.getConnection((err, connection) => {
            (0, bcrypt_1.hash)(password, 10, (err, hash) => {
                if (err) {
                    return response.status(500).json(err);
                }
                connection.query(
                //primeiro parametro  a query
                'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)', 
                //segundo parametro array de valores da query
                [(0, uuid_1.v4)(), name, email, hash], 
                // arrow function, que recebe o erro da operação, result e os fileds
                (error, result, fields) => {
                    //encerra a conexão
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error });
                    }
                    response.status(200).json({ message: "Usuario criado com sucesso!" });
                });
            });
        });
    }
    login(request, response) {
        //Recebe os valores no Body
        const { name, email, password } = request.body;
        // importa a pool de conexão e faz a conexão
        // preenche o callback com erro e a variavel de conexão
        // e faz uma arrow function onde sera feito a query
        mysql_1.pool.getConnection((err, connection) => {
            connection.query(
            //primeiro parametro  a query
            'SELECT * FROM users WHERE email = ?', 
            //segundo parametro array de valores da query
            [email], 
            // arrow function, que recebe o erro da operação, result e os fileds
            (error, results, fields) => {
                //encerra a conexão
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro na sua autenticação! Email' });
                }
                // utiliza o compare do bcrypt para comparar as senhas
                (0, bcrypt_1.compare)(password, results[0].password, (err, result) => {
                    // se houver erro
                    if (err) {
                        return response.status(400).json({ error: 'Erro na sua autenticação! Senha' });
                    }
                    // se não retorna um jwt
                    if (result) {
                        const token = (0, jsonwebtoken_1.sign)({
                            id: results[0].user_id,
                            email: results[0].email
                        }, process.env.SECRET, { expiresIn: "1d" });
                        console.log(token);
                        return response.status(200).json({ token: token, message: 'Autenticado com Sucesso!' });
                    }
                });
            });
        });
    }
}
exports.UserRepository = UserRepository;
