import express, { Request, Response } from "express";

const app = express();
const port = 3000;

// GET / => Hello
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Node.js!");
});

// مثال: GET /hello?name=Ali
app.get("/hello", (req: Request, res: Response) => {
  const name = req.query.name || "Guest";
  res.json({ message: `Hello, ${name}!` });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
