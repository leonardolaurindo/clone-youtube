"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideoRepository {
    create(request, response) {
        //Recebe os valores no Body
        const { title, description, user_id } = request.body;
        // importa a pool de conexão e faz a conexão
        // preenche o callback com erro e a variavel de conexão
        // e faz uma arrow function onde sera feito a query
        if (title === "" || description === "" || user_id === "") {
            response.status(300).json({ desgraca: "Preencha todos os campos" });
        }
        else {
            mysql_1.pool.getConnection((err, connection) => {
                connection.query(
                //primeiro parametro  a query
                'INSERT INTO videos (video_id, user_id, title, description) VALUES (?,?,?,?)', 
                //segundo parametro array de valores da query
                [(0, uuid_1.v4)(), user_id, title, description], 
                // arrow function, que recebe o erro da operação, result e os fileds
                (error, result, fields) => {
                    //encerra a conexão
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error });
                    }
                    response.status(200).json({ message: 'Video Criado com Sucesso' });
                });
            });
        }
    }
    getVideos(request, response) {
        //Recebe os valores no Body
        const { user_id } = request.body;
        // importa a pool de conexão e faz a conexão
        // preenche o callback com erro e a variavel de conexão
        // e faz uma arrow function onde sera feito a query
        mysql_1.pool.getConnection((err, connection) => {
            connection.query(
            //primeiro parametro  a query
            'SELECT * FROM videos WHERE user_id = ?', 
            //segundo parametro array de valores da query
            [user_id], 
            // arrow function, que recebe o erro da operação, result e os fileds
            (error, results, fields) => {
                //encerra a conexão
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro ao buscar os videos' });
                }
                // utiliza o compare do bcrypt para comparar as senhas
                return response.status(200).json({ message: 'Videos encontrados', videos: results });
            });
        });
    }
    search(request, response) {
        //Recebe os valores no Body
        const { search } = request.query;
        // importa a pool de conexão e faz a conexão
        // preenche o callback com erro e a variavel de conexão
        // e faz uma arrow function onde sera feito a query
        mysql_1.pool.getConnection((err, connection) => {
            connection.query(
            //primeiro parametro  a query
            'SELECT * FROM videos INNER JOIN users ON videos.user_id = users.user_id WHERE videos.title OR videos.description LIKE ? OR users.name LIKE ?', 
            //segundo parametro array de valores da query
            [`%${search}%`, `%${search}%`], 
            // arrow function, que recebe o erro da operação, result e os fileds
            (error, results, fields) => {
                //encerra a conexão
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro ao buscar os videos', erro: error });
                }
                // utiliza o compare do bcrypt para comparar as senhas
                return response.status(200).json({ message: 'Videos encontrados', videos: results });
            });
        });
    }
}
exports.VideoRepository = VideoRepository;
