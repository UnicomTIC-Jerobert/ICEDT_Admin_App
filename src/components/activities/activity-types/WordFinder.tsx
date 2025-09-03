import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';

// --- COLOCATED TYPES ---
export interface WordFinderChallenge {
    targetLetter: string;
    wordGrid: string[];
    correctWords: string[];
}

export interface WordFinderContent {
    title: string;
    challenges: WordFinderChallenge[];
}

// --- PROPS INTERFACE for the "DUMB" component ---
// It receives a SINGLE challenge to render.
interface WordFinderProps {
    content: WordFinderChallenge;
}

const WordFinder: React.FC<WordFinderProps> = ({ content }) => {
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);

    // Reset the state whenever a new challenge (content prop) is passed in
    useEffect(() => {
        setFoundWords([]);
        setIncorrectGuesses([]);
    }, [content]);

    const handleWordClick = (word: string) => {
        // Don't allow clicking an already found word
        if (foundWords.includes(word)) return;

        if (content.correctWords.includes(word)) {
            setFoundWords(prev => [...prev, word]);
        } else {
            setIncorrectGuesses(prev => [...prev, word]);
            // Give feedback by clearing the incorrect guess after a moment
            setTimeout(() => {
                setIncorrectGuesses(prev => prev.filter(w => w !== word));
            }, 500);
        }
    };
    
    const handleReset = () => {
        setFoundWords([]);
        setIncorrectGuesses([]);
    };

    const isComplete = foundWords.length === content.correctWords.length;

    const getChipColor = (word: string): "success" | "error" | "primary" => {
        if (foundWords.includes(word)) return "success";
        if (incorrectGuesses.includes(word)) return "error";
        return "primary";
    };

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Paper elevation={4} sx={{ p: 2, mb: 4, backgroundColor: 'secondary.main', color: 'white' }}>
                <Typography variant="h6">Find all words with this letter:</Typography>
                <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
                    {content.targetLetter}
                </Typography>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {content.wordGrid.map(word => (
                    <Chip
                        key={word}
                        label={word}
                        onClick={() => handleWordClick(word)}
                        disabled={foundWords.includes(word)}
                        sx={{ fontSize: '1.5rem', padding: '24px 12px', cursor: 'pointer' }}
                        color={getChipColor(word)}
                        variant="outlined"
                    />
                ))}
            </Box>

            {isComplete && (
                <Box mt={4} textAlign="center">
                    <Typography variant="h5" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <CheckCircleIcon fontSize="large" /> Great Job!
                    </Typography>
                    <Button sx={{ mt: 2 }} variant="outlined" startIcon={<ReplayIcon />} onClick={handleReset}>
                        Reset this round
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default WordFinder;