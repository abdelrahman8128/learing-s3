"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
// GET / => Hello
app.get("/", (req, res) => {
    res.send("Hello from TypeScript + Node.js!");
});
// مثال: GET /hello?name=Ali
app.get("/hello", (req, res) => {
    const name = req.query.name || "Guest";
    res.json({ message: `Hello, ${name}!` });
});
app.listen(3000, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:3000`);
});
const app2 = (0, express_1.default)();
app2.get("/api/", (req, res) => {
    res.send("Hello from the second app on port 4000!");
});
app2.listen(4000, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:4000`);
});
