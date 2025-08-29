import React from 'react';
import { Typography } from '@mui/material';

// --- Step 1: Import ALL activity components and their content types ---
import MCQActivity from './activity-types/MCQActivity';
import EquationFillInTheBlank from './activity-types/Equations';
import MediaSpotlightSingle from './activity-types/MediaSpotlightSingle';
import WordBankCompletion from './activity-types/WordBankCompletion';
import DropdownCompletion from './activity-types/DropdownCompletion';
import Flashcard from './activity-types/Flashcard';
import MediaSpotlightMultiple from './activity-types/MediaSpotlightMultiple';

import {
    MCQContent,
    MediaSpotlightSingleContent,
    WordBankCompletionContent,
    DropdownCompletionContent,
    Equation,
    FlashcardContent,
    MediaSpotlightMultipleContent,
    ConversationContent,
    SongContent
} from '../../types/activityContentTypes';
import ConversationPlayer from './activity-types/ConversationPlayer';
import SongPlayer from './activity-types/SongPlayer';

interface ActivityRendererProps {
    activityTypeId: number;
    content: any; // The already-parsed JSON object or array
}

const ActivityRenderer: React.FC<ActivityRendererProps> = ({ activityTypeId, content }) => {
    console.log(content)
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

        case 7: // All FillInTheBlanks variations
            if ('sentences' in content && 'wordBank' in content) {
                return <WordBankCompletion content={content as WordBankCompletionContent} />;
            }
            if ('sentences' in content) { // No wordBank, so it must be Dropdown
                return <DropdownCompletion content={content as DropdownCompletionContent} />;
            }
            

            return <Typography p={2} color="error">Invalid JSON structure for FillInTheBlanks Activity.</Typography>;

        case 13: // MultipleChoiceQuestion
            // The MCQ component is smart enough to handle a single object or an array of questions.
            return <MCQActivity content={content as MCQContent} />;

        default:
            return <Typography p={2} color="text.secondary">Preview for Activity Type ID #{activityTypeId} is not implemented.</Typography>;
    }
};

export default ActivityRenderer;