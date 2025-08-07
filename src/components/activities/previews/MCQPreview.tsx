import React, { useState } from 'react';
import { Box, Typography, Paper, Radio, FormControlLabel, RadioGroup, styled, PaperProps } from '@mui/material'; // <-- Import PaperProps
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { MCQQuestion } from '../../../types/activityContentTypes';

interface MCQPreviewProps {
    question: MCQQuestion;
}

// --- THIS IS THE FIX ---
// 1. Define an interface for our custom props.
interface OptionPaperProps extends PaperProps {
    selected: boolean;
    correct: boolean;
}

// 2. Use this interface with the styled component.
const OptionPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'correct',
})<OptionPaperProps>(({ theme, selected, correct }) => ({
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s, border-color 0.3s',
    border: '2px solid transparent',
    backgroundColor: '#f5f5f5',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
    ...(selected && {
        borderColor: correct ? theme.palette.success.main : theme.palette.error.main,
        backgroundColor: correct ? '#e8f5e9' : '#fdecea',
    }),
}));


const MCQPreview: React.FC<MCQPreviewProps> = ({ question }) => {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isAnswered) {
            setSelectedValue(event.target.value);
            setIsAnswered(true);
        }
    };

    const correctAnswer = question.options.find(opt => opt.isCorrect)?.text;

    return (
        <Box 
            sx={{ 
                p: 2, 
                fontFamily: 'sans-serif', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column' 
            }}
        >
            <Typography variant="h6" component="h2" gutterBottom sx={{ flexShrink: 0 }}>
                {question.prompt || "No question prompt provided."}
            </Typography>
            
            <Box sx={{ mt: 2, flexGrow: 1, overflowY: 'auto' }}>
                <RadioGroup value={selectedValue} onChange={handleOptionChange}>
                    {(question.options || []).map((option, index) => {
                        const isSelected = selectedValue === option.text;
                        const isCorrectAnswer = option.isCorrect;
                        
                        return (
                            <OptionPaper
                                key={option.id || index}
                                elevation={isAnswered && isSelected ? 4 : 2}
                                selected={isAnswered && isSelected}
                                correct={isCorrectAnswer}
                                onClick={() => handleOptionChange({ target: { value: option.text } } as any)}
                            >
                                <FormControlLabel
                                    value={option.text}
                                    control={<Radio checked={isSelected} disabled={isAnswered} />}
                                    label={option.text || `Option ${index + 1}`}
                                    sx={{ width: '100%' }}
                                    disabled={isAnswered}
                                />
                                {isAnswered && (
                                    isCorrectAnswer ? 
                                    <CheckCircleIcon color="success" /> : 
                                    (isSelected && <CancelIcon color="error" />)
                                )}
                            </OptionPaper>
                        );
                    })}
                </RadioGroup>
            </Box>

            {isAnswered && (
                 <Box sx={{ mt: 2, p: 2, borderRadius: 1, backgroundColor: selectedValue === correctAnswer ? 'success.light' : 'error.light', flexShrink: 0 }}>
                    <Typography>
                        {selectedValue === correctAnswer 
                            ? "Correct!" 
                            : `Incorrect. The correct answer is: ${correctAnswer}`}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default MCQPreview;