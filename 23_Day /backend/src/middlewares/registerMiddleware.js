import { registerSchema } from "../schemas/registerSchema.js";

export function validateRegister(req, res, next) {
  console.log("req.body", req.body);

  try {
    registerSchema.parse({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    next();
  } catch (err) {
    console.log("err", err);
    res.status(400).json({
      message: "Invalid data. Error during registration.",
      error: err.errors,
    });
  }
}
