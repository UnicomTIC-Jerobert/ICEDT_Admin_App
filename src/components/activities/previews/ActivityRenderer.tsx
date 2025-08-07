import React from 'react';
import { Typography } from '@mui/material';

// Import all your specific, REAL preview components here
import MCQPreview from './MCQPreview';
// import MatchingPreview from './MatchingPreview'; 
// import FillInTheBlanksPreview from './FillInTheBlanksPreview';

// Import the TypeScript types for the content of each activity
import { MCQContent, MCQQuestion, MatchingContent} from '../../../types/activityContentTypes';

// A generic placeholder for activity types you haven't built a preview for yet
const PlaceholderPreview = ({ data }: { data: any }) => (
    <pre style={{ margin: '16px', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
);

interface ActivityRendererProps {
    activityTypeId: number;
    contentJson: string;

    // This is for the "slideshow" player on the list page
    currentQuestionIndex?: number; 
    
    // This is for the single-question preview in the editor
    overridePreviewData?: any; 
}

const ActivityRenderer: React.FC<ActivityRendererProps> = ({
    activityTypeId,
    contentJson,
    currentQuestionIndex = 0, // Default to the first question
    overridePreviewData,
}) => {
    let content;
    try {
        content = JSON.parse(contentJson);
    } catch (e) {
        // If JSON is invalid, show a clear error message in the preview.
        return <Typography p={2} color="error">Invalid JSON format. Preview cannot be displayed.</Typography>;
    }

    // --- THIS IS THE NEW CORE LOGIC ---
    let dataToRender;

    if (overridePreviewData) {
        // If override data is provided (from the editor), we use it directly.
        // This is for previewing a single, specific question as it's being edited.
        dataToRender = overridePreviewData;
    } else {
        // If no override, we are in "player" mode (from the list page modal).
        // We figure out what to render based on the activity structure.
        const isPaginated = Array.isArray(content.questions) && content.questions.length > 0;
        
        if (isPaginated) {
            // For paginated activities, render the question at the current index.
            dataToRender = content.questions[currentQuestionIndex];
        } else {
            // For non-paginated activities (like Matching), render the whole content object.
            dataToRender = content;
        }
    }
    
    // If, after all that, we have no data to render, show a message.
    if (!dataToRender) {
        return <Typography p={2} color="text.secondary">No content to display for this step.</Typography>
    }

    // --- RENDER THE CORRECT COMPONENT BASED ON TYPE ---
    switch (activityTypeId) {
        case 13: // MultipleChoiceQuestion
            // The MCQPreview should be simple; it just knows how to render one question.
            return <MCQPreview question={dataToRender as MCQQuestion['options'][0]} />;

        // case 4: // Matching (this is a non-paginated example)
        //     // The MatchingPreview gets the whole content object.
        //     return <MatchingPreview content={dataToRender as MatchingContent} />;
            
        // case 7: // FillInTheBlanks
        //     return <FillInTheBlanksPreview question={dataToRender as FillInTheBlanksContent['questions'][0]} />;

        default:
            // Fallback for unimplemented types
            return (
                <div>
                    <Typography p={2} color="text.secondary">
                        Preview not implemented for Activity Type ID: {activityTypeId}. Showing raw data:
                    </Typography>
                    <PlaceholderPreview data={dataToRender} />
                </div>
            );
    }
};

export default ActivityRenderer;