import express from "express";
import cors from "cors";
import contactRoutes from "./src/interfaces/routes/contactRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import healthRoutes from "./src/interfaces/routes/healthRoutes.js";

const app = express();

// ============= CORS CONFIGURADO CORRECTAMENTE =============
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite
      'https://impertula.com'
    ];
    
    // Permitir peticiones sin origin (herramientas de desarrollo como Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Para desarrollo, acepta todo. En producción, cambia esto
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight por 10 minutos
};

app.use(cors(corsOptions));

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

app.use(express.json());

// Timeout middleware
app.use((req, res, next) => {
  res.setTimeout(300000, () => { 
    console.error("Request timeout: la petición tardó demasiado.");
    if (!res.headersSent) {
      res.status(408).json({ success: false, error: "Request timeout" });
    }
  });
  next();
});

// 🔹 Rutas de la API
app.use("/api/contact", contactRoutes);

// 🔹 Health check endpoint
app.use("/health", healthRoutes);

app.use(errorHandler);

export default app;