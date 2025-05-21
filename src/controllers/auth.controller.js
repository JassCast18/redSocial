import { validationResult } from 'express-validator';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req,res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email,password, username, infoPersonal, imagenPerfil} =req.body;
    try {

        // Verificar si el usuario o email ya existen
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json(['El email o nombre de usuario ya están en uso']);
        }

        //hashear la contra
        const passwordhash = await bcrypt.hash(password,10)

        // Crear el nuevo usuario
        const newUser = new User({
            username,
            email,
            password: passwordhash,
            infoPersonal: {
                nombre: infoPersonal?.nombre || '',
                apellido: infoPersonal?.apellido || '',
                fechaNacimiento: infoPersonal?.fechaNacimiento || null,
                sexo: infoPersonal?.sexo || 'Prefiero no decir',
                direccion: infoPersonal?.direccion || ''
            },
            imagenPerfil: imagenPerfil && imagenPerfil.trim() !== '' ? imagenPerfil : undefined
        });
        
        const userSaved = await newUser.save()
        const token = await createAccessToken({id: userSaved._id})
        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });
        res.json({
            message: "User created successfully",
        })
    

        /*res.json(
            {
                id: userSaved._id,
                username: userSaved.username,
                email: userSaved.email,
                createdAt: userSaved.createdAt,
                updatedAt: userSaved.updatedAt
            })*/
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        })
    }
   
};


export const login = async (req,res)=> {
    const {email,password} =req.body;
    try {

        const userFound = await User.findOne({email})
        if (!userFound) return res.status(400).json({message: "User not found"});


        const isMatch = await bcrypt.compare(password, userFound.password)
        if(!isMatch) return res.status(400).json({message: "Invalid credentials"})
        

        const token = await createAccessToken({id: userFound._id})
        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });
    

        res.json(
            {
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
                imagenPerfil: userFound.imagenPerfil,
                seguidores: userFound.seguidores,
                seguidos: userFound.seguidos,
                createdAt: userFound.createdAt
            })
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        })
    }
   
};

export const logout = (req, res) => {
    // 1. Limpiar la cookie de forma segura
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    
    // 2. Enviar UNA sola respuesta combinada
    res.status(200).json({
        success: true,
        message: "Logout exitoso"
    });
};


export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id).select('-password');
        if (!userFound) return res.status(400).json({ message: "User not found" });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            imagenPerfil: userFound.imagenPerfil,
            infoPersonal: userFound.infoPersonal,
            seguidores: userFound.seguidores.length,
            seguidos: userFound.seguidos.length,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching profile" });
    }
}