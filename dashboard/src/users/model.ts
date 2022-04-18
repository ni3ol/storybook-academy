import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  firstName: z.string(),
  lastName: z.string(),
  emailAddress: z.string().email(),
});

export type User = z.infer<typeof userSchema>;
