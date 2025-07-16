import * as z from "zod";
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(5, "Password should be at least of 5 letters."),
});
