import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import { WordBankCompletionContent, SentenceWithBlank } from '../../../types/activityContentTypes';

interface WordBankProps {
    content: WordBankCompletionContent;
}

// Helper to shuffle the word bank
const shuffleArray = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

const WordBankCompletion: React.FC<WordBankProps> = ({ content }) => {
    // State to hold the user's answers, mapping sentence ID to the chosen word
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [shuffledWordBank, setShuffledWordBank] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    useEffect(() => {
        handleReset();
    }, [content]);

    const handleReset = () => {
        setAnswers({});
        setShuffledWordBank(shuffleArray(content.wordBank));
        setIsComplete(false);
    };

    const handleDrop = (sentenceId: number, word: string) => {
        // Simple click-based drop for now
        setAnswers(prev => ({ ...prev, [sentenceId]: word }));
    };

    const handleCheckAnswers = () => {
        setIsComplete(true);
    };

    const isAllCorrect = content.sentences.every(s => answers[s.id] === s.correctAnswer);

    const renderSentence = (sentence: SentenceWithBlank) => {
        const userAnswer = answers[sentence.id];
        const isCorrect = userAnswer === sentence.correctAnswer;
        
        let blankStyle = {
            border: '1px dashed grey',
            backgroundColor: '#eee',
            color: 'blue',
        };
        
        if (isComplete) {
            blankStyle.border = `2px solid ${isCorrect ? 'green' : 'red'}`;
            blankStyle.backgroundColor = isCorrect ? '#e8f5e9' : '#ffebee';
            blankStyle.color = isCorrect ? 'green' : 'red';
        }

        return (
            <Box key={sentence.id} display="flex" alignItems="center" my={2} flexWrap="wrap">
                <Typography variant="body1" component="span">{sentence.prefix}&nbsp;</Typography>
                <Chip
                    label={userAnswer || '...........'}
                    sx={{ ...blankStyle, minWidth: '120px', height: '40px', fontSize: '1rem' }}
                />
                <Typography variant="body1" component="span">&nbsp;{sentence.suffix}</Typography>
            </Box>
        );
    };
    
    // For a simple click-to-fill interaction:
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    const handleWordBankClick = (word: string) => {
        if(isWordUsed(word)) return;
        setSelectedWord(word);
    };

    const handleBlankClick = (sentenceId: number) => {
        if (selectedWord) {
            setAnswers(prev => ({...prev, [sentenceId]: selectedWord}));
            setSelectedWord(null);
        }
    };
    
    const isWordUsed = (word: string) => Object.values(answers).includes(word);

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif' }}>
            <Typography variant="h6" textAlign="center" mb={2}>{content.title}</Typography>

            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                {content.sentences.map(sentence => (
                     <Box key={sentence.id} display="flex" alignItems="center" my={2} flexWrap="wrap">
                        <Typography variant="body1" component="span">{sentence.prefix}&nbsp;</Typography>
                        <Chip
                            onClick={() => handleBlankClick(sentence.id)}
                            label={answers[sentence.id] || '...........'}
                            sx={{
                                minWidth: '120px', height: '40px', fontSize: '1rem', cursor: 'pointer',
                                border: isComplete ? `2px solid ${answers[sentence.id] === sentence.correctAnswer ? 'green' : 'red'}` : '1px dashed grey',
                                backgroundColor: isComplete ? (answers[sentence.id] === sentence.correctAnswer ? '#e8f5e9' : '#ffebee') : '#eee'
                            }}
                        />
                        <Typography variant="body1" component="span">&nbsp;{sentence.suffix}</Typography>
                    </Box>
                ))}
            </Paper>

            <Typography variant="body1" textAlign="center" mb={1}>Click a word, then click a blank space.</Typography>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {shuffledWordBank.map(word => (
                    <Chip
                        key={word}
                        label={word}
                        onClick={() => handleWordBankClick(word)}
                        disabled={isWordUsed(word) || isComplete}
                        color={selectedWord === word ? 'secondary' : 'primary'}
                        variant={isWordUsed(word) ? 'filled' : 'outlined'}
                        sx={{ fontSize: '1.1rem', cursor: 'pointer' }}
                    />
                ))}
            </Paper>

            <Box textAlign="center" mt={4}>
                {!isComplete ? (
                    <Button variant="contained" onClick={handleCheckAnswers}>Check Answers</Button>
                ) : (
                    <Button variant="outlined" startIcon={<ReplayIcon />} onClick={handleReset}>Try Again</Button>
                )}
            </Box>
            
            {isComplete && (
                 <Typography variant="h6" color={isAllCorrect ? 'success.main' : 'error.main'} textAlign="center" mt={2}>
                    {isAllCorrect ? 'Excellent! All correct.' : 'Some answers are incorrect. Please try again.'}
                </Typography>
            )}
        </Box>
    );
};

export default WordBankCompletion;