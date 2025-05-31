import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
    usuario_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    contenido:{
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    fecha:{
        type: Date,
        default: Date.now
    },
    leido:{
        type: Boolean,
        default: false
    }
},{_id: true});

const chatSchema = new mongoose.Schema({
    participantes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }],
    mensajes:[mensajeSchema],
    ultima_actividad:{
        type: Date,
        default: Date.now
    },
}, {
    // Validación personalizada sobre el ARRAY de participantes
    validate: {
        validator: function(v) {
            return v.participantes && v.participantes.length >= 2;
        },
        message: 'El chat debe tener al menos 2 participantes'
    }
});

// Actualizar última actividad al agregar mensajes
chatSchema.pre("save", function(next) {
    if (this.isModified("mensajes")) {
      this.ultima_actividad = Date.now();
    }
    next();
  });

// Índices
chatSchema.index({ participantes: 1 });  // Búsqueda rápida por usuarios
chatSchema.index({ ultima_actividad: -1 });  // Ordenar chats por actividad

export default mongoose.model("Chat", chatSchema);