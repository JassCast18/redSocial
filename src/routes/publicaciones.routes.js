import { Router } from "express";
import { authRequire } from "../middlewares/valideToken.js";
import {
    getPublications, 
    getPublication,
    CreatePublication,
    updatePublication,
    deletePublication,
    likePublication
}from "../controllers/publicacion.controller.js";

const router = Router();

router.get('/publicaciones', authRequire, getPublications)
router.get('/publicaciones/:id', authRequire, getPublication)
router.post('/publicaciones', authRequire, CreatePublication)
router.delete('/publicaciones/:id', authRequire, deletePublication) 
router.put('/publicaciones/:id', authRequire, updatePublication)
// Ruta para like/dislike
router.post('/publicaciones/:id/like', authRequire, likePublication);

export default router;