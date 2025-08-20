import React from 'react';
import { Typography } from '@mui/material';

// Import your specific activity components
import MCQActivity from '../activity-types/MCQActivity';
import MatchingActivity from '../activity-types/MatchingActivity';
import EquationFillInTheBlank from '../activity-types/EquationFillInTheBlank';
import FirstLetterMatch from '../activity-types/FirstLetterMatch';

import LetterSpotlight from '../activity-types/LetterSpotlight';


// Import the type definitions
import {
    MCQContent,
    MatchingContent,
    SimpleEquationContent,
    FirstLetterMatchContent,
    LetterSpotlightContent,
    MediaSpotlightContent
} from '../../../types/activityContentTypes';
import MediaSpotlight from '../activity-types/MediaSpotlight';

interface ActivityRendererProps {
    activityTypeId: number;
    contentJson: string; // The JSON for a SINGLE exercise
    currentQuestionIndex?: number; // Optional index for paginated exercises
}

const ActivityRenderer: React.FC<ActivityRendererProps> = ({ activityTypeId, contentJson, currentQuestionIndex = 0 }) => {
    let content;
    try {
        content = JSON.parse(contentJson);
    } catch {
        return <Typography color="error">Invalid JSON content for this exercise.</Typography>;
    }

    // --- THIS IS THE KEY LOGIC ---
    // Check if the content is paginated by looking for a 'questions' array.
    const isPaginated = Array.isArray(content.questions);

    // If it's paginated, we pass only the current question's data.
    // If not, we pass the entire content object.
    const dataToRender = isPaginated ? (content.questions[currentQuestionIndex] || {}) : content;

    switch (activityTypeId) {
        case 2:  // Can be LetterSpotlight OR MediaSpotlight
             if ('spotlightLetter' in content && 'items' in content) {
                 // This structure matches MediaSpotlight
                 return <MediaSpotlight content={content as MediaSpotlightContent} />;
             }
             if ('spotlightLetter' in content && 'words' in content) {
                 // This structure matches LetterSpotlight
                 return <LetterSpotlight content={content as LetterSpotlightContent} />;
             }
             return <Typography p={2} color="error">Invalid JSON for Activity Type 2.</Typography>;

        case 4: // Matching Type
            // For this type, we always pass the full content object.
            if ('words' in content) return <FirstLetterMatch content={content as FirstLetterMatchContent} />;
            if ('columnA' in content) return <MatchingActivity content={content as MatchingContent} />;
            return <Typography p={2} color="error">Invalid JSON for Matching/FirstLetter activity.</Typography>;

        case 7: // FillInTheBlanks (Equation)
            // This is paginated, so `dataToRender` will be a single question object.
            return <EquationFillInTheBlank content={dataToRender as SimpleEquationContent} />;

        case 13: // MultipleChoiceQuestion
            // This is paginated, so `dataToRender` will be a single question object.
            // We pass the full `content` so the component can access the `activityTitle`
            return <MCQActivity content={{ ...content, questions: [dataToRender] }} />;

        default:
            return <Typography p={2} color="text.secondary">Preview for activity type ({activityTypeId}) not implemented.</Typography>;
    }
};

export default ActivityRenderer;