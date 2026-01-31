export type AlgorithmIntent = "study" | "news" | "social" | "wellness" | "discovery";

export interface AlgorithmProfile {
  id: string;
  name: string;
  description: string;
  intent: AlgorithmIntent;
  popularity: number; // 0–100
  trustScore: number; // 0–100
  active?: boolean;
}

export type ContentType = "long-form" | "short-video" | "journalism" | "community-note";

export interface FeedItem {
  id: string;
  author: string;
  authorHandle: string;
  contentType: ContentType;
  title?: string;
  body: string;
  timestamp: string;
  focusArea?: CurriculumFocusArea;
  likes: number;
  comments: number;
}

export type CurriculumFocusArea =
  | "mental-health"
  | "physical-health"
  | "academic"
  | "vocational"
  | "nutrition";

export interface CurriculumProgress {
  focusArea: CurriculumFocusArea;
  label: string;
  completed: number;
  total: number;
  badgeUnlocked: boolean;
}

export interface ScheduleBlock {
  id: string;
  day: number; // 0–6
  startHour: number;
  endHour: number;
  algorithmId: string;
  label: string;
}

export interface RewardEntry {
  id: string;
  reason: string;
  points: number;
  date: string;
}
