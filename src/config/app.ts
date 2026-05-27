import express   from 'express';
import helmet    from 'helmet';
import cors      from 'cors';
import rateLimit from 'express-rate-limit';
import hpp       from 'hpp';
import { env }   from './env';
import { errorHandler } from '../errors/errorHandler';

const app = express();

// ── Seguridad global ──────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(hpp());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intentá más tarde' },
}));

// ── Ruta de salud ─────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ── Manejador global de errores ───────────────────────
app.use(errorHandler);

export default app;
