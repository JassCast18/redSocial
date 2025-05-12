import {z} from 'zod';

export const registerSchema = z.object({
    username: z.string({
        required_error: 'Username es requerido'
    }),
    email: z.string({
        required_error: 'Email es requerido',
    }).email({
        message:"Email no es válido"

    }),
    password: z.string({
        required_error: 'Contraseña es requerida',
        invalid_type_error: 'Contraseña debe ser un string'
    }).min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres'
    }),
})

export const loginSchema = z.object({
    email: z.string({
        required_error: 'Email es requerido',
        invalid_type_error: 'Email debe ser un string'
    }).email({
        required_error: 'Email no es válido',

    }
    ),
    password: z.string({
        required_error: 'Contraseña es requerida',
        invalid_type_error: 'Contraseña debe ser un string'
    }).min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres'
    }),
})