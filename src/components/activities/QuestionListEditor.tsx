import React, { useMemo } from 'react';
import { Box, Button, Typography, Paper, IconButton, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import MCQActivityForm from './activity-types/MCQActivity'; // Your existing component
// Import other activity-type forms here as you create them

interface QuestionListEditorProps {
    activityTypeId: number;
    contentJson: string;
    onContentJsonChange: (newJson: string) => void;
    onPreviewQuestion: (questionData: any) => void; // Function to trigger preview
}

const QuestionListEditor: React.FC<QuestionListEditorProps> = ({
    activityTypeId,
    contentJson,
    onContentJsonChange,
    onPreviewQuestion,
}) => {
    // Safely parse the JSON and provide a default structure
    const content = useMemo(() => {
        try {
            const parsed = JSON.parse(contentJson);
            return {
                activityTitle: parsed.activityTitle || '',
                questions: Array.isArray(parsed.questions) ? parsed.questions : []
            };
        } catch {
            return { activityTitle: '', questions: [] };
        }
    }, [contentJson]);

    // Helper to update the parent's state
    const updateParentJson = (newContent: any) => {
        onContentJsonChange(JSON.stringify(newContent, null, 2));
    };
    
    // --- Handlers for the list ---
    
    const handleAddQuestion = () => {
        let newQuestion;
        switch (activityTypeId) {
            case 13: // MCQ
                newQuestion = { prompt: '', options: [{ text: '', isCorrect: false }] };
                break;
            // Add default structures for other activity types here
            default:
                newQuestion = {};
        }
        const newContent = { ...content, questions: [...content.questions, newQuestion] };
        updateParentJson(newContent);
    };

    const handleDeleteQuestion = (indexToDelete: number) => {
        const newQuestions = content.questions.filter((_, index) => index !== indexToDelete);
        const newContent = { ...content, questions: newQuestions };
        updateParentJson(newContent);
    };
    
    // This function is called by the child form when it changes
    const handleQuestionDataChange = (indexToChange: number, updatedQuestionData: any) => {
        const newQuestions = [...content.questions];
        newQuestions[indexToChange] = updatedQuestionData;
        const newContent = { ...content, questions: newQuestions };
        updateParentJson(newContent);
    };

    const renderQuestionForm = (questionData: any, index: number) => {
        // This is the router that selects which mini-form to render
        switch (activityTypeId) {
            case 13: // MCQ
                return (
                    <MCQActivityForm 
                        questionData={questionData}
                        onDataChange={(updatedData) => handleQuestionDataChange(index, updatedData)}
                    />
                );
            // Add cases for other types here
            default:
                return <Typography>No editor for this activity type yet.</Typography>;
        }
    };

    return (
        <Box>
            {/* The main activity title is edited here */}
            <TextField 
                label="Activity Title (Overall)" 
                fullWidth 
                margin="normal" 
                value={content.activityTitle}
                onChange={(e) => updateParentJson({ ...content, activityTitle: e.target.value })}
            />

            {content.questions.map((q, index) => (
                <Paper key={index} elevation={2} sx={{ p: 2, mb: 2, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                        <IconButton onClick={() => onPreviewQuestion(q)} color="info" size="small" title="Preview this question">
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteQuestion(index)} color="error" size="small" title="Delete this question">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="h6" gutterBottom>Question #{index + 1}</Typography>
                    {renderQuestionForm(q, index)}
                </Paper>
            ))}

            <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddQuestion}
            >
                Add Question
            </Button>
        </Box>
    );
};

export default QuestionListEditor;