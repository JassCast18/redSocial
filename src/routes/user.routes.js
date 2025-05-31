import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// Obtener perfil público de usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password") // nunca envíes el password
      .lean();
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar usuario", error: err.message });
  }
});

export default router;