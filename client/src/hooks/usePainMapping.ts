import { useState, useCallback } from "react";
import type { PainMarkData } from "@/components/3d/HumanModel";
import type { PainType } from "@/components/ui/PainTypeSelector";

interface UsePainMappingReturn {
  selectedPainType: PainType;
  selectedIntensity: number;
  paintedPoints: PainMarkData[];
  painTypeCount: Record<string, number>;
  setSelectedPainType: (type: PainType) => void;
  setSelectedIntensity: (intensity: number) => void;
  handlePaintPoint: (point: PainMarkData) => void;
  handleClearMarks: () => void;
}

export const usePainMapping = (defaultPainType: PainType = "THROBBING"): UsePainMappingReturn => {
  const [selectedPainType, setSelectedPainType] = useState<PainType>(defaultPainType);
  const [selectedIntensity, setSelectedIntensity] = useState(3);
  const [paintedPoints, setPaintedPoints] = useState<PainMarkData[]>([]);

  const painTypeCount = paintedPoints.reduce<Record<string, number>>((acc, p) => {
    acc[p.painType] = (acc[p.painType] ?? 0) + 1;
    return acc;
  }, {});

  const handlePaintPoint = useCallback(
    (point: PainMarkData) => {
      const enrichedPoint = { ...point, intensity: Math.round(selectedIntensity) };
      setPaintedPoints((prev) => [...prev, enrichedPoint]);
    },
    [selectedIntensity]
  );

  const handleClearMarks = useCallback(() => {
    setPaintedPoints([]);
  }, []);

  return {
    selectedPainType,
    selectedIntensity,
    paintedPoints,
    painTypeCount,
    setSelectedPainType,
    setSelectedIntensity,
    handlePaintPoint,
    handleClearMarks,
  };
};
