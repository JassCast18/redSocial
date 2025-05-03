import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        requerided: true,
        trim: true,
    },
    email: {
        type: String,
        requerided: true,
        trim:true,
        unique: true,
    },
    password:{
        type: String,
        requerided: true,
    },
    infoPersonal:{
        nombre:{
            type: String,
            required: true,
            trim: true,
        },
        apellido:{
            type: String,
            trim: true,
        },
        fechaNacimiento:{
            type: Date,
            required: true,
        },
        sexo:{
            type: String,
            enum: ["masculino", "femenino", "Prefiero no decir"],
        },
        direccion:{
            type: String,
            trim: true,
        }
    },
    imagenPerfil: {
        type: String,
        default : "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/default-avatar.png"
    },
    seguidores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }],
    seguidos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }]
}, {
    timestamps: true
})

export default mongoose.model('Usuario', userSchema)