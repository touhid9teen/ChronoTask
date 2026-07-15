"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Question, UserAnswer } from "@/practice/types";
import { QuestionType } from "@/practice/types";

interface QuestionRendererProps {
  question: Question;
  answer: UserAnswer | undefined;
  onAnswer: (value: string | string[]) => void;
}

export default function QuestionRenderer({
  question,
  answer,
  onAnswer,
}: QuestionRendererProps) {
  const currentValue = answer?.value;

  switch (question.type) {
    case QuestionType.MCQ:
      return (
        <MCQRenderer
          question={question}
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={onAnswer}
        />
      );
    case QuestionType.MULTIPLE_CORRECT:
      return (
        <MultiCorrectRenderer
          question={question}
          value={Array.isArray(currentValue) ? currentValue : []}
          onChange={onAnswer}
        />
      );
    case QuestionType.TRUE_FALSE:
      return (
        <TrueFalseRenderer
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={onAnswer}
        />
      );
    case QuestionType.FILL_BLANK:
      return (
        <FillBlankRenderer
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={onAnswer}
        />
      );
    case QuestionType.SHORT_ANSWER:
      return (
        <ShortAnswerRenderer
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={onAnswer}
        />
      );
    case QuestionType.LONG_ANSWER:
      return (
        <LongAnswerRenderer
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={onAnswer}
        />
      );
    default:
      return <p className="text-gray-500">Unsupported question type</p>;
  }
}

function MCQRenderer({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {question.options?.map((opt, i) => {
        const label = String.fromCharCode(65 + i);
        return (
          <label
            key={i}
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
              value === opt
                ? "border-blue-300 bg-blue-50 ring-1 ring-blue-200"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <RadioGroupItem value={opt} id={`opt-${i}`} />
            <span className="text-sm font-medium text-gray-500 w-6">
              {label}.
            </span>
            <span className="text-sm text-gray-900">{opt}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}

function MultiCorrectRenderer({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Select all that apply</p>
      {question.options?.map((opt, i) => {
        const label = String.fromCharCode(65 + i);
        return (
          <label
            key={i}
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
              value.includes(opt)
                ? "border-blue-300 bg-blue-50 ring-1 ring-blue-200"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Checkbox
              checked={value.includes(opt)}
              onCheckedChange={() => toggle(opt)}
            />
            <span className="text-sm font-medium text-gray-500 w-6">
              {label}.
            </span>
            <span className="text-sm text-gray-900">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function TrueFalseRenderer({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-4">
      {["True", "False"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 p-6 rounded-lg border text-lg font-semibold transition-all ${
            value === opt
              ? opt === "True"
                ? "border-green-300 bg-green-50 text-green-700 ring-1 ring-green-200"
                : "border-red-300 bg-red-50 text-red-700 ring-1 ring-red-200"
              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function FillBlankRenderer({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Fill in the blank</p>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
        className="text-lg"
      />
    </div>
  );
}

function ShortAnswerRenderer({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Short Answer</p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
        rows={4}
      />
    </div>
  );
}

function LongAnswerRenderer({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">
        Long Answer / Essay
      </p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your detailed answer..."
        rows={8}
        className="min-h-[200px]"
      />
    </div>
  );
}
