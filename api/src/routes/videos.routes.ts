import { Router } from "express";
import { VideoRepository } from "../modules/videos/repositories/VideosRepository";
import { login } from "../middleware/login";

const videosRoutes = Router();
const videoRepository = new VideoRepository();

videosRoutes.post('/create', login, (request, response) => {
    videoRepository.create(request, response);
})

videosRoutes.get('/getVideos', login, (request, response) => {
    videoRepository.getVideos(request, response);
})

videosRoutes.get('/search', (request, response) => {
    videoRepository.search(request, response);
})



export { videosRoutes };