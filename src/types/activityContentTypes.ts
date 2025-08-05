// This file will hold the interfaces for all 18 activity content types.

export interface MCQChoice {
    id: string | number; // A unique identifier for the choice
    text: string;
    isCorrect: boolean;
}

export interface MCQContent {
    question: string;
    choices: MCQChoice[];
    // You could add optional properties later, like an image URL for the question
    // imageUrl?: string;
}

// --- NEW: Types for Matching Activity ---
export interface MatchItem {
    id: string; // Unique ID for this item (e.g., 'A', 'B', '1', '2')
    content: string; // The text to display
    matchId: string; // The ID of the item it should be paired with
}

export interface MatchingContent {
    columnA: MatchItem[]; // Items for the left column
    columnB: MatchItem[]; // Items for the right column
    // Optional title for the activity
    title?: string;
}