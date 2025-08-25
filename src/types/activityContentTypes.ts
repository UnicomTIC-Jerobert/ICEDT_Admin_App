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
export interface Equation {
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

// ... (existing types)

// --- NEW: Type for Dropdown Sentence Completion ---
export interface DropdownBlank {
    id: number; // Unique ID for this sentence
    prefix: string;
    suffix: string;
    options: string[]; // The choices for THIS specific dropdown
    correctAnswer: string;
}

export interface DropdownCompletionContent {
    title: string;
    sentences: DropdownBlank[];
}


// --- NEW: Type for Letter Spotlight Activity ---
export interface SpotlightWord {
    text: string;
    imageUrl?: string; // Optional image for the word
    audioUrl?: string; // Optional audio for pronunciation
}

export interface LetterSpotlightContent {
    spotlightLetter: string; // The letter to highlight, e.g., "அ"
    words: SpotlightWord[];
}

// ... (existing types)

// --- NEW: Type for Media Spotlight Activity (Carousel) ---
export interface MediaSpotlightItem {
    text: string;
    imageUrl: string;
    audioUrl?: string;
}

// --- The content for a SINGLE MediaSpotlight exercise ---
export interface MediaSpotlightSingleContent {
    title: string;
    spotlightLetter: string;
    item: MediaSpotlightItem; // It now contains a single 'item', not an array 'items'
}

export interface MediaSpotlightMultipleContent {
    title: string; // e.g., "உயிர் எழுத்து"
    spotlightLetter: string;
    items: MediaSpotlightItem[];
}

export interface FlashcardContent {
    title: string;
    word: string;
    imageUrl: string;
    audioUrl?: string;
}



