import Publication from "../models/publicacion.model.js";
export const getPublications = async (req, res) => {
    try {
        // 1. Asegurar que seguidos sea un array válido
        const seguidos = Array.isArray(req.user.seguidos) 
            ? req.user.seguidos 
            : [];

        // 2. Convertir ObjectIds a strings si es necesario
        const seguidosIds = seguidos.map(id => id.toString?.() || id);

        // 3. Consulta con validación reforzada
        const publications = await Publication.find({
            $or: [
                { privacidad: "publico" },
                { 
                    privacidad: "soloAmigos",
                    $or: [
                        { user: req.user.id },
                        { user: { $in: seguidosIds } } // ✅ Ahora es array garantizado
                    ]
                }
            ]
        })
        .populate('user', 'username imagenPerfil')
        .populate('menciones', 'username imagenPerfil')
        .sort({ fechaCreacion: -1 });

        res.json(publications);
    } catch (error) {
        console.error('Error en getPublications:', {
            error: error.message,
            seguidos: req.user.seguidos,
            tipoSeguidos: typeof req.user.seguidos
        });
        
        res.status(500).json({
            message: "Error al obtener publicaciones",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};
export const CreatePublication = async (req, res) => {
    const { titulo, contenido, multimedia, hashtags, menciones, privacidad } = req.body;

    try {
        // Validación condicional
        if (!multimedia?.length && !contenido?.trim()) {
            return res.status(400).json({
                message: "Debes incluir al menos contenido textual o multimedia"
            });
        }

        const newPublication = new Publication({
            user: req.user.id,
            titulo,
            contenido,
            multimedia: multimedia || [],
            hashtags: hashtags ? hashtags.map(tag => tag.toLowerCase()) : [],
            menciones,
            privacidad: privacidad || "publico"
        });

        // Validar el esquema antes de guardar
        const validationError = newPublication.validateSync();
        if (validationError) {
            const errors = Object.values(validationError.errors).map(err => err.message);
            return res.status(400).json({
                message: "Error de validación",
                errors
            });
        }

        const savedPublication = await newPublication.save();
        
        const populatedPublication = await Publication.findById(savedPublication._id)
            .populate('user', 'username imagenPerfil')
            .populate('menciones', 'username imagenPerfil');

        res.status(201).json(populatedPublication);
    } catch (error) {
        res.status(500).json({
            message: "Error al crear publicación",
            error: error.message
        });
    }
};
export const getPublication = async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id)
            .populate('usuarioId', 'username imagenPerfil')
            .populate('menciones', 'username imagenPerfil')
            .populate('metricas.likes', 'username imagenPerfil');

        if (!publication) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        // Verificar privacidad
        if (publication.privacidad === "soloAmigos" && 
            !publication.usuarioId.equals(req.user.id) && 
            !req.user.seguidos.includes(publication.usuarioId._id)) {
            return res.status(403).json({ message: "No tienes permiso para ver esta publicación" });
        }

        // Incrementar contador de vistas
        publication.metricas.vistas += 1;
        await publication.save();

        res.json(publication);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener publicación",
            error: error.message
        });
    }
};

export const updatePublication = async (req, res) => {
    try {
        // Verificar que el usuario es el autor
        const publication = await Publication.findById(req.params.id);
        if (!publication) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        if (!publication.usuarioId.equals(req.user.id)) {
            return res.status(403).json({ message: "No puedes editar esta publicación" });
        }

        const updatedPublication = await Publication.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                // Si se actualizan hashtags, convertirlos a minúsculas
                hashtags: req.body.hashtags ? req.body.hashtags.map(tag => tag.toLowerCase()) : publication.hashtags,
                fechaActualizacion: Date.now()
            },
            { new: true }
        )
        .populate('usuarioId', 'username imagenPerfil')
        .populate('menciones', 'username imagenPerfil');

        res.json(updatedPublication);
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar publicación",
            error: error.message
        });
    }
};

export const deletePublication = async (req, res) => {
    try {
        // Verificar que el usuario es el autor
        const publication = await Publication.findById(req.params.id);
        if (!publication) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        if (!publication.usuarioId.equals(req.user.id)) {
            return res.status(403).json({ message: "No puedes eliminar esta publicación" });
        }

        await Publication.findByIdAndDelete(req.params.id);
        
        // Aquí podrías agregar lógica para eliminar las imágenes de Cloudinary si es necesario
        
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar publicación",
            error: error.message
        });
    }
};
import { createNotification, deleteNotificationByCriteria } from './notificacion.controller.js';
export const likePublication = async (req, res) => {
    try {
        
// Verificar que el autor existe

        // Obtener publicación y poblar el campo 'user'
        const publication = await Publication.findById(req.params.id)
            .populate('user', '_id'); // Solo necesitamos el _id del autor
            if (!publication.user) {
                return res.status(500).json({ 
                    message: "Error: Publicación sin autor válido" 
                });
            }
        if (!publication) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        const userId = req.user.id;
        const authorId = publication.user._id ? publication.user._id : publication.user;

        const alreadyLiked = publication.metricas.likes.some(likeId => 
            likeId.equals(userId)
        );

        if (alreadyLiked) {
            // Quitar like
            publication.metricas.likes = publication.metricas.likes.filter(
                likeId => !likeId.equals(userId)
            );
            
            // Eliminar notificación
            await deleteNotificationByCriteria({
                usuario_destino_id: authorId, // Usar el ID obtenido
                usuario_origen_id: userId,
                tipo: "like",
                publicacion_id: publication._id
            });
        } else {
            // Agregar like
            publication.metricas.likes.push(userId);
            
            // Crear notificación solo si no es el propio usuario
            if (!authorId.equals(userId)) {
                await createNotification({
                    usuarioDestinoId: authorId,
                    tipo: "like",
                    usuarioOrigenId: userId,
                    publicacionId: publication._id
                });
            }
        }

        await publication.save();
        
        // Obtener publicación actualizada
        const updatedPublication = await Publication.findById(req.params.id)
            .populate('metricas.likes', 'username imagenPerfil')
            .populate('user', 'username');

        res.json(updatedPublication);
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar likes",
            error: error.message
        });
    }
};