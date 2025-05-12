export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error.errors) { // Para versiones antiguas de Zod
            return res.status(400).json({
                error: error.errors.map((err) => err.message)
            });
        } else if (error.issues) { // Para versiones recientes de Zod
            return res.status(400).json({
                error: error.issues.map((issue) => {
                    // Prioriza el mensaje personalizado, luego el código
                    return issue.message || `${issue.path.join('.')} - ${issue.code}`;
                })
            });
        } else {
            return res.status(400).json({ error: ["Error de validación"] });
        }
    }
};