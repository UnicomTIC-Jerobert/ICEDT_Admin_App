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

// --- NEW: Type for Conversation Activity ---
export interface ChatMessage {
    speaker: string;      // e.g., "Mani", "Vani"
    avatar?: string;     // Optional URL for a speaker's avatar image
    text: string;         // The dialogue text
    timestamp: number;    // The start time of this line in the audio file (in seconds)
}

export interface ConversationContent {
    title: string;
    audioUrl: string;     // The URL of the full conversation audio file
    messages: ChatMessage[];
}

// --- NEW: Type for Song Player Activity ---
export interface LyricLine {
    text: string;       // The lyric line
    timestamp: number;  // The time in seconds when this line starts
}

export interface SongContent {
    title: string;
    artist?: string;    // Optional artist name
    albumArtUrl?: string; // Optional URL for album art
    audioUrl: string;   // The URL of the full song audio file
    lyrics: LyricLine[];
}

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

// --- NEW: Type for Interactive Scene Finder Activity ---
export interface Hotspot {
    id: number;           // Unique ID for this object in the scene
    name: string;         // The name of the object, e.g., "ஆடு"
    audioUrl: string;     // The audio prompt that asks the user to find this object
    // Coordinates are percentages (0-100) for responsive design
    x: number;            // X-coordinate of the top-left corner
    y: number;            // Y-coordinate of the top-left corner
    width: number;        // Width of the tappable area
    height: number;       // Height of the tappable area
}

export interface SceneFinderContent {
    title: string;
    sceneImageUrl: string; // The main background image
    sceneAudioUrl?: string; // Optional ambient sound for the scene
    hotspots: Hotspot[];    // The list of all interactive objects in the scene
}