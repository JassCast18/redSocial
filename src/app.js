import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import publiRoutes from './routes/publicaciones.routes.js';
import followRoutes from './routes/follow.routes.js';

const app = express()

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use("/api",authRoutes);
app.use("/api",publiRoutes);
app.use("/api",followRoutes);

export default app;