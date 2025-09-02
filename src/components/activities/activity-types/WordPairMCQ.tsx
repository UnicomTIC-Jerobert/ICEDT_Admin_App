import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { WordPairQuestion } from '../../../types/activityContentTypes';

// interface WordPairProps {
//     content: WordPairMCQContent;
// }

// This is a "mini-player" that will be managed by the parent ActivityPlayerModal
const WordPairMCQ: React.FC<{ question: WordPairQuestion }> = ({ question }) => {
    const [userAnswer, setUserAnswer] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Reset state when the question changes
        setUserAnswer(null);
        // Autoplay the prompt sound
        const timer = setTimeout(() => playAudio(), 500);
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
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">Listen to the sound and choose the correct word:</Typography>
                <IconButton onClick={playAudio}><VolumeUpIcon fontSize="large" color="primary" /></IconButton>
            </Paper>

            <Box display="flex" justifyContent="space-around" alignItems="center">
                {question.choices.map(choice => {
                    const isSelected = userAnswer === choice;
                    const isCorrect = choice === question.correctAnswer;
                    let color: "success" | "error" | "primary" = "primary";
                    if (isSelected && isCorrect) color = "success";
                    if (isSelected && !isCorrect) color = "error";

                    return (
                        <Button
                            key={choice}
                            variant={userAnswer ? 'contained' : 'outlined'}
                            color={color}
                            onClick={() => handleAnswer(choice)}
                            disabled={!!userAnswer && !isSelected}
                            sx={{ fontSize: '2rem', padding: '20px 40px', textTransform: 'none' }}
                        >
                            {choice}
                            {isSelected && isCorrect && <CheckCircleIcon sx={{ ml: 1 }} />}
                            {isSelected && !isCorrect && <CancelIcon sx={{ ml: 1 }} />}
                        </Button>
                    );
                })}
            </Box>

             {userAnswer && ! (userAnswer === question.correctAnswer) && (
                <Typography variant="h6" color="success.main" mt={2}>
                    Correct Answer: {question.correctAnswer}
                </Typography>
            )}
        </Box>
    );
};

// You can then use this inside the ActivityPlayerModal's flow if your ContentJson
// is an array of questions.

export default WordPairMCQ;