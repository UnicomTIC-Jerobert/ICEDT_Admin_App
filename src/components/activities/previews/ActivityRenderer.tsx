import React from 'react';
import { Typography } from '@mui/material';
// Import all your specific preview components here
// import MCQPreview from './MCQPreview';
// import MatchingPreview from './MatchingPreview';

// --- Placeholder for now ---
const Placeholder = ({ data }: { data: any }) => <pre><code>{JSON.stringify(data, null, 2)}</code></pre>;

interface ActivityRendererProps {
    activityTypeId: number;
    contentJson: string;
    currentQuestionIndex?: number; // For paginated activities
}

const ActivityRenderer: React.FC<ActivityRendererProps> = ({ activityTypeId, contentJson, currentQuestionIndex = 0 }) => {
    let content;
    try {
        content = JSON.parse(contentJson);
    } catch {
        return <Typography color="error">Invalid JSON</Typography>;
    }
    
    // Determine if we are rendering the whole object or a specific question
    const dataToRender = Array.isArray(content.questions) ? content.questions[currentQuestionIndex] : content;

    switch (activityTypeId) {
        // case 13: // MCQ
        //     return <MCQPreview content={dataToRender} />;
        
        // case 4: // Matching (not paginated, so it gets the whole `content` object)
        //     return <MatchingPreview content={content} />;
            
        default:
            return <Placeholder data={dataToRender} />;
    }
};

export default ActivityRenderer;