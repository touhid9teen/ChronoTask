import { z } from "zod";
import { QuestionType, QuestionDifficulty } from "../types";

const optionsSchema = z.array(z.string().min(1)).min(2, "At least 2 options required");

export const questionFormSchema = z.object({
  type: z.nativeEnum(QuestionType),
  text: z.string().min(1, "Question text is required"),
  options: optionsSchema.optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().optional().default(""),
  marks: z.number().min(1, "Marks must be at least 1"),
  difficulty: z.nativeEnum(QuestionDifficulty),
});

export const questionImportSchema = z.array(
  z.object({
    type: z.nativeEnum(QuestionType),
    text: z.string().min(1),
    options: z.array(z.string()).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]),
    explanation: z.string().optional(),
    marks: z.number().min(1).default(1),
    difficulty: z.nativeEnum(QuestionDifficulty).default(QuestionDifficulty.MEDIUM),
  })
);

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

export function validateQuestion(
  question: Partial<QuestionFormValues>,
  index: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!question.text?.trim()) {
    errors.push(`Question ${index + 1}: Question text is empty`);
  }

  if (
    question.type === QuestionType.MCQ ||
    question.type === QuestionType.MULTIPLE_CORRECT
  ) {
    if (!question.options || question.options.length < 2) {
      errors.push(
        `Question ${index + 1}: At least 2 options are required`
      );
    } else {
      const emptyOpts = question.options.filter((o) => !o.trim());
      if (emptyOpts.length > 0) {
        errors.push(`Question ${index + 1}: Contains empty options`);
      }
      const uniqueOpts = new Set(question.options.map((o) => o.trim().toLowerCase()));
      if (uniqueOpts.size !== question.options.length) {
        errors.push(`Question ${index + 1}: Contains duplicate options`);
      }
    }
  }

  if (
    question.type === QuestionType.TRUE_FALSE
  ) {
    const ans = String(question.correctAnswer).toLowerCase();
    if (ans !== "true" && ans !== "false") {
      errors.push(`Question ${index + 1}: Answer must be "True" or "False"`);
    }
  }

  if (
    question.type !== QuestionType.SHORT_ANSWER &&
    question.type !== QuestionType.LONG_ANSWER
  ) {
    if (
      question.correctAnswer === undefined ||
      question.correctAnswer === null ||
      (Array.isArray(question.correctAnswer) && question.correctAnswer.length === 0) ||
      (typeof question.correctAnswer === "string" && !question.correctAnswer.trim())
    ) {
      errors.push(`Question ${index + 1}: Answer is missing`);
    }
  }

  if (question.type === QuestionType.MULTIPLE_CORRECT) {
    if (Array.isArray(question.correctAnswer) && question.options) {
      for (const ans of question.correctAnswer) {
        if (!question.options.includes(ans)) {
          errors.push(
            `Question ${index + 1}: Answer "${ans}" is not in the options`
          );
        }
      }
    }
  }

  if (question.type === QuestionType.MCQ) {
    if (
      typeof question.correctAnswer === "string" &&
      question.options &&
      !question.options.includes(question.correctAnswer)
    ) {
      errors.push(
        `Question ${index + 1}: Answer is not in the options`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}
