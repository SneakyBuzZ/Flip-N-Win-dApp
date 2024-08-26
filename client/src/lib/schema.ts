import { z } from "zod";

export const betSchema = z.object({
  amount: z.string(),
  choice: z.enum(["Heads", "Tails"]),
});
