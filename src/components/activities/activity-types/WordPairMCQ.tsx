import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// --- COLOCATED TYPES ---
export interface WordPairQuestion {
    id: number;
    promptAudioUrl: string; 
    choices: [string, string];
    correctAnswer: string;
}

// This is the top-level structure.
// The ActivityPlayerModal will loop through the 'questions' array.
export interface WordPairMCQContent {
    title: string;
    questions: WordPairQuestion[];
}

// --- PROPS INTERFACE ---
// The component receives a SINGLE question object.
interface WordPairProps {
    content: WordPairQuestion;
}

const WordPairMCQ: React.FC<WordPairProps> = ({ content: question }) => {
    const [userAnswer, setUserAnswer] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Reset state and autoplay sound when the question prop changes
    useEffect(() => {
        setUserAnswer(null);
        const timer = setTimeout(() => playAudio(), 300);
        return () => clearTimeout(timer);
    }, [question]);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error(e));
        }
    };

    const handleAnswer = (choice: string) => {
        if (userAnswer) return; // Already answered
        setUserAnswer(choice);
    };

    return (
        <Box p={2} textAlign="center">
            <audio ref={audioRef} src={question.promptAudioUrl} />
            <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6">Listen and choose the correct word:</Typography>
                <IconButton onClick={playAudio}><VolumeUpIcon fontSize="large" color="primary" /></IconButton>
            </Paper>

            <Box display="flex" justifyContent="space-around" alignItems="center">
                {question.choices.map(choice => {
                    const isSelected = userAnswer === choice;
                    const isCorrect = choice === question.correctAnswer;
                    let color: "success" | "error" | "primary" = "primary";
                    if (isSelected) {
                        color = isCorrect ? "success" : "error";
                    }

                    return (
                        <Button
                            key={choice}
                            variant={userAnswer ? 'contained' : 'outlined'}
                            color={color}
                            onClick={() => handleAnswer(choice)}
                            disabled={!!userAnswer && !isSelected}
                            sx={{ fontSize: '2rem', padding: '20px 40px', textTransform: 'none', minWidth: '180px' }}
                        >
                            {choice}
                            {isSelected && isCorrect && <CheckCircleIcon sx={{ ml: 2 }} />}
                            {isSelected && !isCorrect && <CancelIcon sx={{ ml: 2 }} />}
                        </Button>
                    );
                })}
            </Box>

            {userAnswer && !(userAnswer === question.correctAnswer) && (
                <Typography variant="h6" color="success.main" mt={3}>
                    Correct Answer: {question.correctAnswer}
                </Typography>
            )}
        </Box>
    );
};

export default WordPairMCQ;