import { startServer } from './app';

startServer().catch((error) => {
    console.error('Error starting the server:', error);
});
