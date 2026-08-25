import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.email().transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8)
    .regex(/[a-z]/, "Password must contain a lowercase letter.")
    .regex(/[A-Z]/, "Password must contain an uppercase letter.")
    .regex(/\d/, "Password must contain a number.")
    .regex(
      /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/,
      "Password must contain a special character."
    )
    .refine(
      (password) => !/\s/.test(password),
      "Password cannot contain spaces."
    ),
});

export type signupDTO = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

export type loginDTO = z.infer<typeof loginSchema>;
