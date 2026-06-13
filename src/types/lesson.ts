import { Level } from './level';

export interface Lesson {
    lessonId: number;
    levelId: number;
    lessonName: string;
    description: string | null;
    sequenceOrder: number;
    slug: string;
    lessonImageUrl?: string | null;
    level?: Level; // Optional navigation property
}