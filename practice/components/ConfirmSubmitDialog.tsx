"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmSubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  answered: number;
  total: number;
}

export default function ConfirmSubmitDialog({
  open,
  onOpenChange,
  onConfirm,
  answered,
  total,
}: ConfirmSubmitDialogProps) {
  const unanswered = total - answered;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
          <AlertDialogDescription>
            You have answered <strong>{answered}</strong> out of{" "}
            <strong>{total}</strong> questions.
            {unanswered > 0 && (
              <span className="text-yellow-600 font-medium">
                {" "}
                {unanswered} question(s) unanswered.
              </span>
            )}
            <br />
            Are you sure you want to submit?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continue Exam</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit Exam
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
