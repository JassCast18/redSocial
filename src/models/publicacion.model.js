import mongoose from "mongoose";
import './user.model.js'; // Importa primero el modelo de usuario

const publicacionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    titulo:{
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    contenido: {
        type: String,
        trim: true,
        maxlength: [500, "El contenido no puede exceder los 500 caracteres"],
        required: function() {
            return !this.multimedia?.length;
        }
    },
    multimedia: [{
        type: String,
        validate: {
            validator: (url) => /^(http|https):\/\/\S+/.test(url), // Corregida la expresión regular
            message: "La URL multimedia no es válida"
        }
    }],
    hashtags: [{
        type: String,
        trim: true,
        lowercase:true
    }],
    menciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
    }],
    privacidad:{
        type: String,
        enum: ["publico", "soloAmigos", "privado"],
        default: "publico",
    },
    metricas:{
        vistas:{
            type: Number,
            default: 0,
        },
        likes:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
        }]
    }
},{
    timestamps: true
});

publicacionSchema.index({user:1});
publicacionSchema.index({hashtags:1});
publicacionSchema.index({"metricas.vistas": -1});

export default mongoose.model("Publicacion", publicacionSchema);