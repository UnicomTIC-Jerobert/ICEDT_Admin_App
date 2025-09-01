import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, IconButton, Fab, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { RecognitionGridContent } from '../../../types/activityContentTypes';

interface RecognitionGridProps {
    content: RecognitionGridContent;
}

const RecognitionGrid: React.FC<RecognitionGridProps> = ({ content }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [foundItems, setFoundItems] = useState<number[]>([]);
    const [currentItemToFindIndex, setCurrentItemToFindIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentPage = content.pages[currentPageIndex];
    const currentCorrectIds = currentPage.correctItemIds;
    const currentItemToFind = currentPage.gridItems.find(item => item.id === currentCorrectIds[currentItemToFindIndex]);

    // Reset state when the whole activity changes or a new page starts
    useEffect(() => {
        setFoundItems([]);
        setCurrentItemToFindIndex(0);
    }, [currentPageIndex, content]);

    // Automatically play the sound for the next item to find
    useEffect(() => {
        if (currentItemToFind?.audioUrl) {
            const timer = setTimeout(() => playAudio(currentItemToFind.audioUrl), 500);
            return () => clearTimeout(timer);
        }
    }, [currentItemToFind]);

    const playAudio = (audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    const handleImageClick = (clickedItemId: number) => {
        // Ignore clicks on already found items or if the current page is complete
        if (foundItems.includes(clickedItemId) || !currentItemToFind) return;

        if (clickedItemId === currentItemToFind.id) {
            // Correct guess
            const newFoundItems = [...foundItems, clickedItemId];
            setFoundItems(newFoundItems);

            // Move to the next item to find on this page
            if (currentItemToFindIndex < currentCorrectIds.length - 1) {
                setCurrentItemToFindIndex(prev => prev + 1);
            } else {
                // Page is complete
                setCurrentItemToFindIndex(prev => prev + 1); // Go "out of bounds" to signify completion
            }
        } else {
            // Incorrect guess - maybe add a visual shake effect here in the future
            console.log("Incorrect guess");
        }
    };

    const goToNextPage = () => {
        if (currentPageIndex < content.pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
        }
    };

    const isPageComplete = foundItems.length === currentCorrectIds.length;
    const isActivityComplete = isPageComplete && currentPageIndex === content.pages.length - 1;

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h1" gutterBottom>{content.title}</Typography>
            
            {/* Audio Prompt Area */}
            <Paper elevation={2} sx={{ p: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="h6">Listen:</Typography>
                <IconButton onClick={() => currentItemToFind && playAudio(currentItemToFind.audioUrl)} disabled={isPageComplete}>
                    <VolumeUpIcon fontSize="large" color="primary" />
                </IconButton>
            </Paper>

            {/* Image Grid */}
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    {currentPage.gridItems.map(item => (
                        <Grid key={item.id} size ={{xs:6, sm:4}}>
                            <Paper
                                onClick={() => handleImageClick(item.id)}
                                sx={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    border: '2px solid transparent',
                                    transition: 'transform 0.2s, border-color 0.2s',
                                    '&:hover': { transform: 'scale(1.05)' }
                                }}
                            >
                                <img src={item.imageUrl} alt={`item ${item.id}`} style={{ width: '100%', display: 'block' }} />
                                {foundItems.includes(item.id) && (
                                    <Box
                                        sx={{
                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                            backgroundColor: 'rgba(46, 204, 113, 0.7)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ fontSize: 60, color: 'white' }} />
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            
            {/* Completion / Navigation Area */}
            <Box sx={{ height: '80px', mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isPageComplete && !isActivityComplete && (
                    <Fab color="primary" variant="extended" onClick={goToNextPage}>
                        Next Page
                        <ArrowForwardIcon sx={{ ml: 1 }} />
                    </Fab>
                )}
                {isActivityComplete && (
                    <Box textAlign="center">
                        <Typography variant="h5" color="success.main">Well Done!</Typography>
                        <Button startIcon={<ReplayIcon />} onClick={() => setCurrentPageIndex(0)}>
                            Play Again
                        </Button>
                    </Box>
                )}
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default RecognitionGrid;