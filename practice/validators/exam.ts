import { z } from "zod";
import { QuestionDifficulty } from "../types";

export const examFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().default(""),
  subject: z.string().min(1, "Subject is required").max(100),
  category: z.string().min(1, "Category is required").max(100),
  difficulty: z.nativeEnum(QuestionDifficulty),
  totalMarks: z.number().min(1, "Total marks must be at least 1"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  passingMarks: z.number().min(0).optional(),
  negativeMarks: z.number().min(0).optional(),
  instructions: z.string().max(5000).optional().default(""),
  tags: z.array(z.string()).optional().default([]),
});

export type ExamFormValues = z.infer<typeof examFormSchema>;
