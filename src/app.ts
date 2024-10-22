import express, { Request, Response } from 'express';

const app = express();
const port = 3333;

app.use(express.json());

app.get('/statistics', (req: Request, res: Response) => {
    res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
