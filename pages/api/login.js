// pages/api/login.js
import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key"; // Ideally, store this in an environment variable

const doctor = {
  username: "dryukti",
  password: "Yjain@1970", // hashed password: "Yjain@2001"
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (username === doctor.username && (password=== doctor.password)) {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
