import Notificacion from '../models/notificacion.model.js';
import Usuario from '../models/user.model.js';
import Publicacion from '../models/publicacion.model.js';

// ==============================================
//  Creación de notificaciones (métodos internos)
// ==============================================
export const createNotification = async ({
  usuarioDestinoId,
  tipo,
  usuarioOrigenId,
  publicacionId = null
}) => {
  try {
    // Validaciones básicas
    if (!usuarioDestinoId || !tipo || !usuarioOrigenId) {
      throw new Error('Faltan campos requeridos');
    }

    // Evitar notificaciones propias
    if (usuarioDestinoId.toString() === usuarioOrigenId.toString()) {
      return null;
    }

    // Verificar existencia de usuarios y publicación
    const [destinatario, origen, publicacion] = await Promise.all([
      Usuario.findById(usuarioDestinoId),
      Usuario.findById(usuarioOrigenId),
      publicacionId ? Publicacion.findById(publicacionId) : Promise.resolve(null)
    ]);

    if (!destinatario || !origen) {
      throw new Error('Usuario origen o destino no encontrado');
    }

    if (publicacionId && !publicacion) {
      throw new Error('Publicación no encontrada');
    }

    // Crear notificación
    const nuevaNotificacion = new Notificacion({
      usuario_destino_id: usuarioDestinoId,
      tipo,
      usuario_origen_id: usuarioOrigenId,
      publicacion_id: publicacionId,
    });

    const notificacionGuardada = await nuevaNotificacion.save();
    
    // Populate para obtener datos relevantes
    return await Notificacion.findById(notificacionGuardada._id)
      .populate('usuario_origen_id', 'username imagenPerfil')
      .populate('publicacion_id', 'titulo');

  } catch (error) {
    console.error(`Error creando notificación [${tipo}]:`, error.message);
    return null;
  }
};

// ==============================================
//  Métodos públicos para el API
// ==============================================
export const getNotifications = async (req, res) => {
  try {
    const { limit = 20, page = 1, vista, tipo } = req.query;
    const skip = (page - 1) * limit;

    // Construir query
    const query = { 
      usuario_destino_id: req.user.id,
      ...(vista !== undefined && { visto: vista === 'true' }),
      ...(tipo && { tipo })
    };

    // Obtener notificaciones con paginación
    const [notificaciones, total] = await Promise.all([
      Notificacion.find(query)
        .populate('usuario_origen_id', 'username imagenPerfil')
        .populate('publicacion_id', 'titulo contenido')
        .sort({ fecha: -1 })
        .skip(Number(skip))
        .limit(Number(limit)),
        
      Notificacion.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        total,
        pagina: Number(page),
        paginas: Math.ceil(total / limit),
        notificaciones: notificaciones.map(notif => ({
          ...notif.toObject(),
          tipo: notif.tipo,
          mensaje: generarMensaje(notif) // Función helper
        }))
      }
    });

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificaciones',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findOneAndUpdate(
      { 
        _id: id,
        usuario_destino_id: req.user.id 
      },
      { visto: true },
      { new: true }
    )
    .populate('usuario_origen_id', 'username imagenPerfil');

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        ...notificacion.toObject(),
        mensaje: generarMensaje(notificacion)
      }
    });

  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar notificación',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const result = await Notificacion.updateMany(
      { 
        usuario_destino_id: req.user.id,
        visto: false
      },
      { $set: { visto: true } }
    );

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Error marcando todas como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar notificaciones'
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Notificacion.deleteOne({
      _id: id,
      usuario_destino_id: req.user.id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    res.json({
      success: true,
      data: { deletedId: id }
    });

  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar notificación'
    });
  }
};

// ==============================================
//  Métodos utilitarios
// ==============================================
export const deleteNotificationByCriteria = async (criteria) => {
  try {
    const result = await Notificacion.deleteMany(criteria);
    return result.deletedCount;
  } catch (error) {
    console.error('Error eliminando notificaciones:', error);
    return 0;
  }
};

const generarMensaje = (notificacion) => {
  const mapMessages = {
    like: `${notificacion.usuario_origen_id.username} reaccionó a tu publicación`,
    comentario: `${notificacion.usuario_origen_id.username} comentó tu publicación`,
    mencion: `${notificacion.usuario_origen_id.username} te mencionó en una publicación`,
    seguidor: `${notificacion.usuario_origen_id.username} empezó a seguirte`
  };

  return mapMessages[notificacion.tipo] || 'Nueva actividad en tu cuenta';
};