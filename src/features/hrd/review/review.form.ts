import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultReviewDecisionValues,
  reviewDecisionSchema,
  type ReviewDecision,
  type ReviewDecisionFormDefaults,
  type ReviewDecisionValues,
} from "./review.schema";

export function toReviewDecisionDefaultValues(
  decision: ReviewDecision = "lolos",
): ReviewDecisionFormDefaults {
  return { decision, notes: "" };
}

export function useReviewDecisionForm(
  decision: ReviewDecision = "lolos",
): UseFormReturn<ReviewDecisionValues> {
  return useForm<ReviewDecisionValues>({
    resolver: zodResolver(reviewDecisionSchema),
    defaultValues: toReviewDecisionDefaultValues(decision),
    mode: "onBlur",
  });
}

export function resetReviewDecisionForm(
  form: UseFormReturn<ReviewDecisionValues>,
  decision: ReviewDecision,
): void {
  form.reset(toReviewDecisionDefaultValues(decision));
}

export { defaultReviewDecisionValues };
