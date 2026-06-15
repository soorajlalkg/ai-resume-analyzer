import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fileUpload from 'express-fileupload';
import { swaggerSpec } from './config/swagger/swagger';
import v1Routes from './routes/v1';
import { API_VERSION } from './constants';
import { errorHandler } from './middlewares/errorHandler';
import corsConfig from './config/cors/cors.config';
import path from 'path';

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true, // Keep Bearer token after page refresh
      displayRequestDuration: true, // Show request duration
      docExpansion: 'none', // Collapse all sections by default
      defaultModelsExpandDepth: -1, // Hide schemas/models section
      filter: true, // Enable filtering of API paths
      tryItOutEnabled: true, // Enable "Try it out" by default
    },
    customCss: '.swagger-ui .topbar { display: none }', // Hide Swagger top bar
    customSiteTitle: 'API Documentation', // Set custom title
  }),
);

app.use((req, _, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.use(`/api/${API_VERSION}`, v1Routes);

app.use(errorHandler);

export default app;
