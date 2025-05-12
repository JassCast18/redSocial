import Usuario from '../models/user.model.js';
import { createNotification } from './notificacion.controller.js';

// Seguir a un usuario
export const followUser = async (req, res) => {
    try {
        const userToFollow = await Usuario.findById(req.params.id);
        const currentUser = await Usuario.findById(req.user.id);

        // Validaciones
        if (!userToFollow) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (currentUser._id.equals(userToFollow._id)) {
            return res.status(400).json({ message: "No puedes seguirte a ti mismo" });
        }

        if (currentUser.seguidos.includes(userToFollow._id)) {
            return res.status(400).json({ message: "Ya sigues a este usuario" });
        }

        // Actualizar ambos usuarios
        await Usuario.findByIdAndUpdate(currentUser._id, {
            $addToSet: { seguidos: userToFollow._id }
        });

        await Usuario.findByIdAndUpdate(userToFollow._id, {
            $addToSet: { seguidores: currentUser._id }
        });

        // Crear notificación
        await createNotification({
            usuarioDestinoId: userToFollow._id,
            tipo: "seguidor",
            usuarioOrigenId: currentUser._id
        });

        // Obtener usuario actualizado
        const updatedUser = await Usuario.findById(currentUser._id)
            .populate('seguidos', 'username imagenPerfil')
            .populate('seguidores', 'username imagenPerfil');

        res.json({
            message: `Ahora sigues a ${userToFollow.username}`,
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al seguir usuario",
            error: error.message
        });
    }
};

// Dejar de seguir a un usuario
export const unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await Usuario.findById(req.params.id);
        const currentUser = await Usuario.findById(req.user.id);

        // Validaciones
        if (!userToUnfollow) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (!currentUser.seguidos.some(id => id.equals(userToUnfollow._id))) {
            return res.status(400).json({ message: "No sigues a este usuario" });
        }

        // Actualizar ambos usuarios
        await Usuario.findByIdAndUpdate(currentUser._id, {
            $pull: { seguidos: userToUnfollow._id }
        });

        await Usuario.findByIdAndUpdate(userToUnfollow._id, {
            $pull: { seguidores: currentUser._id }
        });

        // Eliminar notificación de seguimiento
        await deleteNotificationByCriteria({
            usuario_destino_id: userToUnfollow._id,
            usuario_origen_id: currentUser._id,
            tipo: "seguidor"
        });

        // Obtener usuario actualizado
        const updatedUser = await Usuario.findById(currentUser._id)
            .populate('seguidos', 'username imagenPerfil')
            .populate('seguidores', 'username imagenPerfil');

        res.json({
            message: `Has dejado de seguir a ${userToUnfollow.username}`,
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al dejar de seguir",
            error: error.message
        });
    }
};

// Obtener relaciones
export const getRelationships = async (req, res) => {
    try {
        const user = await Usuario.findById(req.params.id)
            .populate('seguidos', 'username imagenPerfil')
            .populate('seguidores', 'username imagenPerfil');

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({
            seguidos: user.seguidos,
            seguidores: user.seguidores,
            countSeguidos: user.seguidos.length,
            countSeguidores: user.seguidores.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener relaciones",
            error: error.message
        });
    }
};