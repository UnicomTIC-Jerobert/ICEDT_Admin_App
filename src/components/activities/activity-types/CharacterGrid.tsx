import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, Fab, Button, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CharacterGridContent } from '../../../types/activityContentTypes';

interface CharacterGridProps {
    content: CharacterGridContent;
}

const CharacterGrid: React.FC<CharacterGridProps> = ({ content }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [foundItems, setFoundItems] = useState<number[]>([]);
    const [currentItemToFindIndex, setCurrentItemToFindIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentPage = content.pages[currentPageIndex];
    const currentCorrectIds = currentPage.correctItemIds;
    const currentItemToFind = currentPage.gridItems.find((item: { id: any; }) => item.id === currentCorrectIds[currentItemToFindIndex]);

    useEffect(() => {
        setFoundItems([]);
        setCurrentItemToFindIndex(0);
    }, [currentPageIndex, content]);

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

    const handleCharacterClick = (clickedItemId: number) => {
        if (foundItems.includes(clickedItemId) || !currentItemToFind) return;

        if (clickedItemId === currentItemToFind.id) {
            const newFoundItems = [...foundItems, clickedItemId];
            setFoundItems(newFoundItems);
            if (currentItemToFindIndex < currentCorrectIds.length - 1) {
                setCurrentItemToFindIndex(prev => prev + 1);
            } else {
                setCurrentItemToFindIndex(prev => prev + 1);
            }
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
            
            <Paper elevation={2} sx={{ p: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="h6">Listen:</Typography>
                <IconButton onClick={() => currentItemToFind && playAudio(currentItemToFind.audioUrl)} disabled={isPageComplete}>
                    <VolumeUpIcon fontSize="large" color="primary" />
                </IconButton>
            </Paper>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1} justifyContent="center" alignItems="center">
                    {currentPage.gridItems.map(item => {
                         const isFound = foundItems.includes(item.id);
                         return (
                            <Grid key={item.id} size ={{xs:3, sm:2}} >
                                <Paper
                                    onClick={() => handleCharacterClick(item.id)}
                                    sx={{
                                        aspectRatio: '1 / 1', // Make it a square
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        border: '2px solid',
                                        borderColor: isFound ? 'success.main' : 'grey.300',
                                        backgroundColor: isFound ? 'success.light' : 'white',
                                        transition: 'transform 0.2s, background-color 0.2s',
                                        '&:hover': { transform: 'scale(1.1)' }
                                    }}
                                >
                                    <Typography variant="h3" fontWeight="bold">
                                        {item.character}
                                    </Typography>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
            
            <Box sx={{ height: '80px', mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isPageComplete && !isActivityComplete && (
                    <Fab color="primary" variant="extended" onClick={goToNextPage}>
                        Next Page <ArrowForwardIcon sx={{ ml: 1 }} />
                    </Fab>
                )}
                {isActivityComplete && (
                     <Box textAlign="center">
                        <Typography variant="h5" color="success.main">Well Done!</Typography>
                        <Button startIcon={<ReplayIcon />} onClick={() => setCurrentPageIndex(0)}>Play Again</Button>
                    </Box>
                )}
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default CharacterGrid;