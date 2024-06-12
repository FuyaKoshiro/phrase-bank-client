import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatar: z.string(),
  createdAt: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  lastLoginAt: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  updatedAt: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
});
export type User = z.infer<typeof userSchema>;

export const checkIfUserExistsSchema = z.boolean();
export type CheckIfUserExists = z.infer<typeof checkIfUserExistsSchema>;
