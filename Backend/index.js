import ConnectDb from './src/databse/Connect.js'
import dotenv from "dotenv"
import http from 'http'
import app from './app.js'
dotenv.config()

const startServer = async () => {
    try {
        const server = http.createServer(app);
        await ConnectDb();
        console.log('Database connected successfully');
        const PORT = process.env.PORT || 8000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error during server startup:', err);
    }
};

startServer();
