export enum Priority {
  NO_PRIORITY = "NO_PRIORITY",
  URGENT = "URGENT",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum ThemeMode {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

export enum ColorMode {
  AMBER = "AMBER",
  BLUE = "BLUE",
  PINK = "PINK",
  ROSE = "ROSE",
  EMERALD = "EMERALD",
  BLACK = "BLACK",
}

export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  statusId: string;
  dueDateStart: string | null;
  dueDateEnd: string | null;
}