import mongoose from "mongoose";

const comentarioSchema = new mongoose.Schema({
    publicId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publicacion",
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    contenido:{
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    likes :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
    }],

},{
    timestamps: true,
});

export default mongoose.model("Comentario", comentarioSchema);
// publicacionSchema.index({publicId:1});