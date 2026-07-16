import { useState, useCallback } from "react";
import {
  TAHAP_1_EMERGENCY,
  TAHAP_2_URGENT,
  TAHAP_3_YELLOW,
  TRIAGE_STATUS,
} from "@/constants";
import {
  calculateTriageStatus,
  getTotalScreeningSteps,
  getProgressPercentage,
  type TriageStatus,
} from "@/utils/screeningHelpers";

interface UseScreeningReturn {
  currentStep: number;
  hardStopStatus: TriageStatus | null;
  triageAnswers: Record<string, "ya" | "tidak">;
  progressPercentage: number;
  finalStatus: TriageStatus;
  totalSteps: number;
  handleAnswer: (questionId: string, answer: "ya" | "tidak", stageType: 1 | 2 | 3) => void;
  handleNextStep: () => void;
  handleBackStep: () => void;
  resetScreening: () => void;
}

export const useScreening = (): UseScreeningReturn => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hardStopStatus, setHardStopStatus] = useState<TriageStatus | null>(null);
  const [triageAnswers, setTriageAnswers] = useState<Record<string, "ya" | "tidak">>({});

  const totalSteps = getTotalScreeningSteps();
  const progressPercentage = getProgressPercentage(currentStep);

  const finalStatus = calculateTriageStatus(hardStopStatus, triageAnswers, 0);

  const handleAnswer = useCallback(
    (questionId: string, answer: "ya" | "tidak", stageType: 1 | 2 | 3) => {
      const updatedAnswers = { ...triageAnswers, [questionId]: answer };
      setTriageAnswers(updatedAnswers);

      if (answer === "ya") {
        if (stageType === 1) {
          setHardStopStatus(TRIAGE_STATUS.RED_EMERGENCY);
        } else if (stageType === 2 && hardStopStatus !== TRIAGE_STATUS.RED_EMERGENCY) {
          setHardStopStatus(TRIAGE_STATUS.RED_URGENT);
        }
      }

      setCurrentStep((prev) => prev + 1);
    },
    [triageAnswers, hardStopStatus]
  );

  const handleNextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const handleBackStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const resetScreening = useCallback(() => {
    setCurrentStep(0);
    setHardStopStatus(null);
    setTriageAnswers({});
  }, []);

  return {
    currentStep,
    hardStopStatus,
    triageAnswers,
    progressPercentage,
    finalStatus,
    totalSteps,
    handleAnswer,
    handleNextStep,
    handleBackStep,
    resetScreening,
  };
};
