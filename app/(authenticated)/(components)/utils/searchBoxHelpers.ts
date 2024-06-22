import { z } from "zod";

export const searchQuerySchema = z.string().min(1).max(100);
