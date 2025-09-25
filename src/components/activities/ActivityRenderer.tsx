import React from 'react';
import { Typography } from '@mui/material';

// --- Step 1: Import ALL activity components and their content types ---
import MCQActivity from './activity-types/MCQActivity';
import EquationFillInTheBlank, { Equation } from './activity-types/Equations';
import MediaSpotlightSingle, { MediaSpotlightSingleContent } from './activity-types/MediaSpotlightSingle';
import Flashcard, { FlashcardContent } from './activity-types/Flashcard';
import MediaSpotlightMultiple, { MediaSpotlightMultipleContent } from './activity-types/MediaSpotlightMultiple';

import {
    MCQContent,
    AudioTextImageSelectionContent,
    DragDropImageMatchingContent,
} from '../../types/activityContentTypes';
import ConversationPlayer, { ConversationContent } from './activity-types/ConversationPlayer';
import SongPlayer, { SongContent } from './activity-types/SongPlayer';
import RecognitionGrid, { RecognitionGridContent } from './activity-types/RecognitionGrid';
import CharacterGrid, { CharacterGridContent } from './activity-types/CharacterGrid';
import WordFinder, { WordFinderChallenge } from './activity-types/WordFinder';
import WordPairMCQ, { WordPairQuestion } from './activity-types/WordPairMCQ';
import SceneFinder, { SceneFinderContent } from './activity-types/SceneFinder';
import StoryPlayer, { StoryContent } from './activity-types/StoryPlayer';
import AudioTextImageSelection from './activity-types/AudioTextImageSelection';
import DragDropImageMatching from './activity-types/DragDropImageMatching';
import InteractiveImageLearning, { InteractiveImageLearningContent } from './activity-types/InteractiveImageLearning';
import LettersDisplay, { LettersDisplayContent } from './activity-types/TamilVowels';
import EquationLern, { EquationLernContent } from './activity-types/EquationLern';
import SentenceBuilder, { SentenceBuilderContent } from './activity-types/SentenceBuilder';
import PronunciationPractice, { PronunciationPracticeContent } from './activity-types/PronunciationPractice';
import RiddleActivity, { RiddleContent } from './activity-types/RiddleActivity';
import DragDropWordMatch, { DragDropWordMatchContent } from './activity-types/DragDropWordMatch';
import ReadingComprehensionMatch, { ReadingComprehensionContent } from './activity-types/ReadingComprehensionMatch';
import DragDropFillInBlank, { DragDropFillInBlankContent } from './activity-types/DragDropFillInBlank';
import DragDropTextSort, { DragDropTextSortContent } from './activity-types/DragDropTextSort';
import MultiDragDropFillInBlank, { MultiDragDropFillInBlankContent } from './activity-types/MultiDragDropFillInBlank';

interface ActivityRendererProps {
    activityTypeId: number;
    content: any; // The already-parsed JSON object or array
}

const ActivityRenderer: React.FC<ActivityRendererProps> = ({ activityTypeId, content }) => {
    // --- Step 3: Use the detailed, working switch statement logic ---
    switch (activityTypeId) {
        case 1:
            return <Flashcard content={content as FlashcardContent} />;
        case 2: // VocabularySpotlight
            return <MediaSpotlightMultiple content={content as MediaSpotlightMultipleContent} />;
        case 3:
            return <MediaSpotlightSingle content={content as MediaSpotlightSingleContent} />;
        case 4: // Letter Spotlight
            return <EquationFillInTheBlank content={content as Equation} />;
        case 5: // ConversationPlayer
            return <ConversationPlayer content={content as ConversationContent} />;
        case 6: // SongPlayer
            return <SongPlayer content={content as SongContent} />;
        case 7: // RecognitionGrid
            return <RecognitionGrid content={content as RecognitionGridContent} />;
        case 8: // CharacterGrid
            return <CharacterGrid content={content as CharacterGridContent} />;
        case 9: // WordPairMCQ
            return <WordPairMCQ content={content as WordPairQuestion} />;
        case 10: // WordFinder
            return <WordFinder content={content as WordFinderChallenge} />;
        case 11: // SceneFinder
            return <SceneFinder content={content as SceneFinderContent} />;
        case 12: // StoryPlayer
            return <StoryPlayer content={content as StoryContent} />;
        case 13: // MultipleChoiceQuestion
            // The MCQ component is smart enough to handle a single object or an array of questions.
            return <MCQActivity content={content as MCQContent} />;
        case 14: // AudioTextImageSelection
            return <AudioTextImageSelection content={content as AudioTextImageSelectionContent} />;
        case 15: // DragDropImageMatching
            return <DragDropImageMatching content={content as DragDropImageMatchingContent} />;
        case 20: // InteractiveImageLearning
            return <InteractiveImageLearning content={content as InteractiveImageLearningContent} />;
        case 23: // LettersDisplay
            return <LettersDisplay content={content as LettersDisplayContent} />;
        case 24: // EquationLern
            return <EquationLern content={content as EquationLernContent} />;
        case 26: // EquationLern
            return <SentenceBuilder content={content as SentenceBuilderContent} />;
        case 28: // PronunciationPractice
            return <PronunciationPractice content={content as PronunciationPracticeContent} />;
        case 29: // RiddleActivity
            return <RiddleActivity content={content as RiddleContent} />;
        case 30: // DragDropWordMatch
            return <DragDropWordMatch content={content as DragDropWordMatchContent} />;
        case 31: // ReadingComprehensionMatch
            return <ReadingComprehensionMatch content={content as ReadingComprehensionContent} />;
        case 34: // DragDropFillInBlank
            return <DragDropFillInBlank content={content as DragDropFillInBlankContent} />;
        case 35: // DragDropTextSort
            return <DragDropTextSort content={content as DragDropTextSortContent} />;
        case 36: // MultiDragDropFillInBlank
            return <MultiDragDropFillInBlank content={content as MultiDragDropFillInBlankContent} />;
        default:
            return <Typography p={2} color="text.secondary">Preview for Activity Type ID #{activityTypeId} is not implemented.</Typography>;
    }
};

export default ActivityRenderer; 