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

// --- NEW: Type for First Letter Word Match Activity ---
export interface FirstLetterMatchContent {
    title: string;
    words: string[];
}

// --- NEW: Type for Fill-in-the-Equation Activity ---
// --- REFINED: Type for Fill-in-the-Equation Activity ---
// This is much simpler and less prone to data entry errors.
export interface SimpleEquationContent {
    leftOperand: string;  // e.g., "க்"
    rightOperand: string; // e.g., "ஆ"
    correctAnswer: string; // e.g., "கா"
    options: string[];     // e.g., ["கா", "கி", "க", "கூ"]
}

// --- NEW: Type for Word Bank Sentence Completion ---
export interface SentenceWithBlank {
    id: number; // A unique ID for this sentence
    // The sentence parts before and after the blank
    prefix: string; 
    suffix: string;
    correctAnswer: string;
}

export interface WordBankCompletionContent {
    title: string;
    sentences: SentenceWithBlank[];
    wordBank: string[];
}