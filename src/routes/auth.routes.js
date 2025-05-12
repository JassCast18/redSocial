import { Router } from "express";
import { 
    register, 
    login, 
    logout, 
    profile 
} from "../controllers/auth.controller.js";    
import { authRequire } from "../middlewares/valideToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router =Router();

router.post('/register', validateSchema(registerSchema),register)
router.post('/login', validateSchema(loginSchema) , login)
router.post('/logout', logout)

router.get('/profile', authRequire, profile)

export default router;