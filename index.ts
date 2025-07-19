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

app.listen(3000, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:3000`);
});

const app2 = express();
app2.get("/api/", (req: Request, res: Response) => {
    res.send("Hello from the second app on port 4000!");
});
app2.listen(4000, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:4000`);
});
