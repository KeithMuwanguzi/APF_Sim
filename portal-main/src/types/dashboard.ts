import { LucideIcon } from "lucide-react";
export type StatColor = "purple" | "orange" | "green";

export type Stat = {
  title: string;
  value: string;
  trend: "up" | "down";
  percentage:string;
  period:string;
  icon: LucideIcon;
  color:StatColor
};
