import * as z from "zod";
export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name should be at least of 3 letters")
    .max(50, "Maximum name length is 50"),
  email: z.email(),
  password: z.string().min(5, "Password should be at least of 5 letters."),
});
