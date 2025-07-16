import { loginSchema } from "../schemas/loginSchema.js";
import jwt from "jsonwebtoken";

export default function validateToken(req, res, next) {
  console.log("req.headers", req.headers);

  // Bearer 123
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    if (isValid) {
      req.user = isValid;
      next();
    } else
      return res.status(401).json({
        message: "Authorize access.",
      });
  } catch {
    res.status(400).json({
      message: "Invalid Token.",
      error: err.errors,
    });
  }

  //   try {
  //     loginSchema.parse({
  //       email: req.body.email,
  //       password: req.body.password,
  //     });
  //     next();
  //   } catch (err) {
  //     console.log("err", err);
  //     res.status(400).json({
  //       message: "Invalid data. Error during Login.",
  //       error: err.errors,
  //     });
  //   }
}

export function add() {}

export const subtract = {};
