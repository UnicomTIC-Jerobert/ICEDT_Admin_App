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
} from '../../types/activityContentTypes';
import ConversationPlayer, { ConversationContent } from './activity-types/ConversationPlayer';
import SongPlayer, { SongContent } from './activity-types/SongPlayer';
import RecognitionGrid, { RecognitionGridContent } from './activity-types/RecognitionGrid';
import CharacterGrid, { CharacterGridContent } from './activity-types/CharacterGrid';
import WordFinder, { WordFinderChallenge } from './activity-types/WordFinder';
import WordPairMCQ, { WordPairQuestion } from './activity-types/WordPairMCQ';
import SceneFinder, { SceneFinderContent } from './activity-types/SceneFinder';
import StoryPlayer, { StoryContent } from './activity-types/StoryPlayer';
import MatchingActivity from './activity-types/MatchingActivity';
import ImageChoiceActivity from './activity-types/Matching';
import ListenMatchActivity, { ListenMatchContent } from './activity-types/Listen&match';
import Keddal, { KeddalContent } from './activity-types/Keddal';
import VideoPlayerActivity from './activity-types/VideoPlayer';
import LetterFillActivity, { LetterFillContent } from './activity-types/LetterFill';
import DragAndDropActivity, { DragDropContent } from './activity-types/DragandDropActivity';
import LetterShapeActivity, { LetterShapeContent } from './activity-types/LetterShapeMatching';
import WordScrambleActivity, { WordScrambleContent } from './activity-types/WordScrambleExercise';
import SentenceScrambleActivity, { SentenceScrambleContent } from './activity-types/SentenceScrambleExercise';


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
    // "content.pages" ஐ அனுப்பவும், அதனுடன் "title" ஐயும் சேர்க்கவும்
    const gridContent = {
        title: content.title,
        ...content.pages
    };
    return <RecognitionGrid content={gridContent} />;
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
            return <ImageChoiceActivity title={content.title} options={content.options} />;
        default:
            return <Typography p={2} color="text.secondary">Preview for Activity Type ID #{activityTypeId} is not implemented.</Typography>;
        case 14: // Listen & Match
    // பழைய அமைப்பில் இருந்து புதிய அமைப்புக்கு தரவை மாற்றுகிறோம்
    const transformedContent = {
        title: content.title,
        spotlightLetter: '', // தேவைப்படும் ஒரு property
        items: [{ // "items" வரிசையை உருவாக்குகிறோம்
            text: content.question.text,
            imageUrl: content.question.imageUrl,
            audioUrl: content.question.audioUrl
        }],
        solliyangkal: [content.question.solliyangal], // ஸ்டிரிங்கை வரிசையாக மாற்றுகிறோம்
        vinaakkal: [content.question.vinaakkal]      // ஸ்டிரிங்கை வரிசையாக மாற்றுகிறோம்
    };
    return <ListenMatchActivity content={transformedContent} />;
        case 15: // Keddal
            return <Keddal content={content as KeddalContent} />;
        case 16: // Video Player
            return <VideoPlayerActivity content={content as any} />;
        case 17: // LetterFill
            return <LetterFillActivity content={content as LetterFillContent} />;
        case 19: // Drag and Drop Activity 
            return <DragAndDropActivity content={content as DragDropContent} />;
        case 21 : // Letter Shape Matching
            return <LetterShapeActivity content={content as LetterShapeContent} />;
        case 22: // wordScrambleExercise
            return <WordScrambleActivity content={content as WordScrambleContent} />;
        case 25: // sentenceScrambleExercise
            return <SentenceScrambleActivity content={content as SentenceScrambleContent} />;
    }
};

export default ActivityRenderer;