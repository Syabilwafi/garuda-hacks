"use client";
import { SPACING, COLORS } from "@/constants";
import { cardStyles } from "@/utils/styleHelpers";
import type { CSSProperties } from "react";

interface ScreeningCardProps {
  minHeight?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export const ScreeningCard = ({
  minHeight = "450px",
  style = {},
  children,
}: ScreeningCardProps) => {
  return (
    <div
      style={{
        ...cardStyles(),
        minHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1px solid ${COLORS.border}`,
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
