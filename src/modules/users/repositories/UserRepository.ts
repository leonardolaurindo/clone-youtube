import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';

class UserRepository {
    create(request: Request, response: Response) {
        //Recebe os valores no Body
        const { name, email, password } = request.body;
        // importa a pool de conexão e faz a conexão
        // preenche o callback com erro e a variavel de conexão
        // e faz uma arrow function onde sera feito a query
        pool.getConnection((err: any, connection: any) => {
            hash(password, 10, (err, hash) => {
                if (err) {
                    return response.status(500).json(err);
                }
                connection.query(
                    //primeiro parametro  a query
                    'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
                    //segundo parametro array de valores da query
                    [uuidv4(), name, email, hash],
                    // arrow function, que recebe o erro da operação, result e os fileds
                    (error: any, result: any, fields: any) => {
                        //encerra a conexão
                        connection.release();
                        if (error) {
                            return response.status(400).json({ error });
                        }
                        response.status(200).json({ message: "Usuario criado com sucesso!" });
                    }
                )
            })
        })
    }

    login(request: Request, response: Response) {
        //Recebe os valores no Body
        const { name, email, password } = request.body;
        // importa a pool de conexão e faz a conexão
        // preenche o callback com erro e a variavel de conexão
        // e faz uma arrow function onde sera feito a query
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                //primeiro parametro  a query
                'SELECT * FROM users WHERE email = ?',
                //segundo parametro array de valores da query
                [email],
                // arrow function, que recebe o erro da operação, result e os fileds
                (error: any, results: any, fields: any) => {
                    //encerra a conexão
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro na sua autenticação! Email' });
                    }
                    // utiliza o compare do bcrypt para comparar as senhas
                    compare(password, results[0].password, (err, result) => {
                        // se houver erro
                        if (err) {
                            return response.status(400).json({ error: 'Erro na sua autenticação! Senha' });
                        }
                        // se não retorna um jwt
                        if (result) {
                            const token = sign({
                                id: results[0].user_id,
                                email: results[0].email
                            }, process.env.SECRET as string, { expiresIn: "1d" });

                            console.log(token);

                            return response.status(200).json({ token: token, message: 'Autenticado com Sucesso!' })
                        }
                    })
                }
            )
        })
    }

    getUser(request: any, response: any) {
        //recebe token do usuaio decodifica
        const decode: any = verify(request.headers.authorization, process.env.SECRET as string);
        // pega o email
        if (decode.email) {
            pool.getConnection((error, conn) => {
                conn.query(
                    'SELECT * FROM users WHERE email=?',
                    [decode.email],
                    (error, resultado, fields) => {
                        conn.release();
                        if (error) {
                            return response.status(400).send({
                                error: error,
                                response: null
                            })
                        }
                        // console.log(resultado);
                        return response.status(201).send({
                            user: {
                                nome: resultado[0].name,
                                email: resultado[0].email,
                                id: resultado[0].user_id,
                            }
                        })
                    }
                )
            })
        }
    }
}

export { UserRepository };