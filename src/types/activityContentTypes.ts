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




// ... (existing types)










// --- NEW: Type for Recognition Grid Activity ---
export interface GridItem {
    id: number;         // Unique ID for this item
    imageUrl: string;
    audioUrl: string;   // The sound that identifies this as the correct answer
}

export interface RecognitionGridPage {
    // All possible items to display in the grid for this page (e.g., 6 images)
    gridItems: GridItem[]; 
    // The list of correct item IDs that the user must find on this page
    correctItemIds: number[]; 
}

export interface RecognitionGridContent {
    title: string;
    pages: RecognitionGridPage[];
}

// --- NEW: Type for Character Grid Activity ---
export interface CharacterGridItem {
    id: number;
    character: string; // The letter to display, e.g., "க"
    audioUrl: string;  // The audio of that letter's sound
}

export interface CharacterGridPage {
    gridItems: CharacterGridItem[];
    correctItemIds: number[];
}

export interface CharacterGridContent {
    title: string;
    pages: CharacterGridPage[];
}

// --- NEW: Type for Word Pair MCQ Activity ---
export interface WordPairQuestion {
    id: number;
    // The audio prompt to play for this question
    promptAudioUrl: string; 
    // The two words to display as choices
    choices: [string, string];
    // The correct word
    correctAnswer: string;
}

export interface WordPairMCQContent {
    title: string;
    questions: WordPairQuestion[];
}



// --- NEW: Type for Word Finder Activity ---
export interface WordFinderChallenge {
    targetLetter: string;
    wordGrid: string[];     // All words to display in the grid for this challenge
    correctWords: string[]; // The subset of words that are the correct answers
}

export interface WordFinderContent {
    title: string;
    challenges: WordFinderChallenge[];
}

// --- NEW: Type for Audio Text Image Selection Activity ---
export interface AudioTextImageSelectionContent {
    title: string;
    text: string;           // The text to display at the top center
    audioUrl: string;       // The audio file to play the text
    images: {
        id: number;
        imageUrl: string;
        isCorrect: boolean;
    }[];                    // Array of two images, one correct and one incorrect
}