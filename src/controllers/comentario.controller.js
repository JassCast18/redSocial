import Comentario from "../models/comentario.model.js";
import Publicacion from "../models/publicacion.model.js";
import { createNotification } from "../controllers/notificacion.controller.js";

export const crearComentario = async (req, res) => {
  try {
    const { contenido } = req.body;
    const { id: publicacionId } = req.params;

    if (!contenido || !contenido.trim()) {
      return res.status(400).json({ message: "El comentario no puede estar vacío." });
    }

    const comentario = new Comentario({
      publicId: publicacionId,
      user: req.user.id,
      contenido
    });

    await comentario.save();
    await comentario.populate("user", "username imagenPerfil");

    // Notificar al autor de la publicación (si no es el mismo usuario)
    const publicacion = await Publicacion.findById(publicacionId);
    if (publicacion && !publicacion.user.equals(req.user.id)) {
      await createNotification({
        usuarioDestinoId: publicacion.user,
        tipo: "comentario",
        usuarioOrigenId: req.user.id,
        publicacionId: publicacionId
      });

      // Emitir evento socket.io SOLO al autor de la publicación
      const io = req.app.get('io');
      io.to(publicacion.user.toString()).emit("nueva-notificacion", {
        tipo: "comentario",
        publicacionId,
        origen: req.user.id,
        comentario: comentario,
      });
    }

    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear comentario", error: error.message });
  }
};

// Obtener comentarios de una publicación
export const obtenerComentarios = async (req, res) => {
  try {
    const { id: publicacionId } = req.params;

    const comentarios = await Comentario.find({ publicId: publicacionId })
      .populate("user", "username imagenPerfil")
      .sort({ createdAt: -1 });

    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener comentarios", error: error.message });
  }
};