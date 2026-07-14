import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/v1", router)

// Sample API Endpoint
app.get('/api/info', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Welcome to the backend API of your NPM Monorepo!',
    timestamp: new Date().toISOString(),
    features: [
      'NPM Workspaces configured',
      'React (Vite) Frontend',
      'Express (TypeScript) Backend',
      'Shared environment capabilities'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
