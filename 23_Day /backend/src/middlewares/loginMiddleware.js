import { loginSchema } from "../schemas/loginSchema.js";

export default function validateLogin(req, res, next) {
  console.log("req.body", req.body);

  try {
    loginSchema.parse({
      email: req.body.email,
      password: req.body.password,
    });
    next();
  } catch (err) {
    console.log("err", err);
    res.status(400).json({
      message: "Invalid data. Error during Login.",
      error: err.errors,
    });
  }
}

export function add() {}

export const subtract = {};
