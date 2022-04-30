import { z } from "zod";

export enum UserRole {
  User = "user",
  Admin = "admin",
  Teacher = "teacher",
  Principal = "principal",
  Child = "child",
}

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  firstName: z.string(),
  lastName: z.string(),
  emailAddress: z.string().email(),
  role: z.nativeEnum(UserRole),
});

export type User = z.infer<typeof userSchema>;
