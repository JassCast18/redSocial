import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema({
  usuario_destino_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ["like", "comentario", "mencion", "seguidor"],
    lowercase: true
  },
  usuario_origen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  publicacion_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publicacion"
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  visto: {
    type: Boolean,
    default: false
  }
});

// Índices para consultas frecuentes
notificacionSchema.index({ usuario_destino_id: 1, visto: 1 });  // Notificaciones no leídas
notificacionSchema.index({ fecha: -1 });  // Ordenar por más recientes

export default mongoose.model("Notificacion", notificacionSchema);