import React from 'react';
import { Box, TextField, Button, IconButton, Checkbox, FormControlLabel, Typography, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { MCQQuestion, MCQOption } from '../../../types/activityContentTypes';

interface MCQActivityFormProps {
    questionData: MCQQuestion;
    onDataChange: (updatedData: MCQQuestion) => void;
}

const MCQActivityForm: React.FC<MCQActivityFormProps> = ({ questionData, onDataChange }) => {

    // --- HANDLERS FOR UPDATING PARENT STATE ---

    const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDataChange({ ...questionData, prompt: e.target.value });
    };

    const handleOptionTextChange = (optionIndex: number, newText: string) => {
        const newOptions = [...questionData.options];
        newOptions[optionIndex] = { ...newOptions[optionIndex], text: newText };
        onDataChange({ ...questionData, options: newOptions });
    };

    const handleCorrectChange = (optionIndex: number) => {
        // This logic ensures only one option can be correct at a time.
        const newOptions = questionData.options.map((opt, index) => ({
            ...opt,
            isCorrect: index === optionIndex
        }));
        onDataChange({ ...questionData, options: newOptions });
    };

    const handleAddOption = () => {
        const newOption: MCQOption = {
            id: `opt-${Date.now()}`, // Simple unique ID
            text: '',
            isCorrect: false
        };
        const newOptions = [...questionData.options, newOption];
        // If this is the first option, make it the correct one by default
        if (newOptions.length === 1) {
            newOptions[0].isCorrect = true;
        }
        onDataChange({ ...questionData, options: newOptions });
    };

    const handleDeleteOption = (optionIndex: number) => {
        const wasCorrect = questionData.options[optionIndex].isCorrect;
        const newOptions = questionData.options.filter((_, index) => index !== optionIndex);
        
        // If the deleted option was the correct one, and there are still options left,
        // default the first remaining option to be the correct one.
        if (wasCorrect && newOptions.length > 0) {
            newOptions[0].isCorrect = true;
        }

        onDataChange({ ...questionData, options: newOptions });
    };

    return (
        <Box>
            <TextField
                label="Question Prompt"
                fullWidth
                variant="outlined"
                value={questionData.prompt || ''}
                onChange={handlePromptChange}
                margin="normal"
            />

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                Options (select one correct answer)
            </Typography>

            <Divider />

            {questionData.options.map((option, index) => (
                <Box key={option.id || index} display="flex" alignItems="center" gap={1} mt={1}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={option.isCorrect}
                                onChange={() => handleCorrectChange(index)}
                                name={`correct-option-${index}`}
                            />
                        }
                        label={`Option ${index + 1}`}
                        sx={{ flexShrink: 0 }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Enter option text"
                        value={option.text}
                        onChange={(e) => handleOptionTextChange(index, e.target.value)}
                    />
                    <IconButton 
                        onClick={() => handleDeleteOption(index)} 
                        color="error" 
                        title="Delete this option"
                        disabled={questionData.options.length <= 1} // Cannot delete the last option
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}

            <Button
                variant="text"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddOption}
                sx={{ mt: 2 }}
            >
                Add Option
            </Button>
        </Box>
    );
};

export default MCQActivityForm;