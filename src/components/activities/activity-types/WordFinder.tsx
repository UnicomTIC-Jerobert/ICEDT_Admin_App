import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { WordFinderChallenge } from '../../../types/activityContentTypes';

interface WordFinderProps {
    // This component receives a SINGLE challenge object from the renderer
    content: WordFinderChallenge;
}

const WordFinder: React.FC<WordFinderProps> = ({ content }) => {
    // This component can be stateless or have state for user interaction feedback
    // For this version, let's make it a simple presentation. The final app would add state.
    
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
                        // In a stateful version, onClick would handle guesses
                        sx={{ fontSize: '1.5rem', padding: '24px 12px' }}
                        color="primary"
                        variant="outlined"
                    />
                ))}
            </Box>

             <Paper elevation={2} sx={{ p: 2, mt: 4, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1" fontWeight="bold">Correct Answers for this round:</Typography>
                <Typography variant="body2" color="text.secondary">{content.correctWords.join(', ')}</Typography>
            </Paper>
        </Box>
    );
};

// NOTE: This is a simplified, non-interactive version for the previewer.
// The final Flutter app would add state to track user guesses, found words, etc.

export default WordFinder;