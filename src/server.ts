import type * as http from 'http';
import 'reflect-metadata';
import config from './config/config';
import app from './app';
import { AppDataSource } from './data-source';

const { port: PORT } = config;
let server: http.Server;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');

    server = app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
      console.log(`API doc running on port http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => console.log(err));

process.on('unhandledRejection', (reason, promise) => {
  console.log('❌ Unhandled Rejection at:', promise, 'reason:', reason);

  if (server) {
    server.close(() => {
      console.log('🔁 Server shutting down due to unhandled rejection');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Exiting...');
  process.exit(0);
});
