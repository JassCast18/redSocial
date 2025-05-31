import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import publiRoutes from './routes/publicaciones.routes.js';
import followRoutes from './routes/follow.routes.js';
import notificacionRoutes from './routes/noticaciones.routes.js';
import chatRoutes from './routes/chat.routes.js'
import userRoutes from './routes/user.routes.js';;
import cors from 'cors';

const app = express()


app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use("/api",authRoutes);
app.use("/api",publiRoutes);
app.use("/api",followRoutes);
app.use("/api",notificacionRoutes);
app.use("/api/chat",chatRoutes);

app.use("/api/users", userRoutes);
export default app;