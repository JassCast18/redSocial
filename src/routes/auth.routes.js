import { Router } from "express";
import { 
    register, 
    login, 
    logout, 
    profile 
} from "../controllers/auth.controller.js";    
import { authRequire } from "../middlewares/valideToken.js";
const router =Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

router.get('/profile', authRequire, profile)

export default router;