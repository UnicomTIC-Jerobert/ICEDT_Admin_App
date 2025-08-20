import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, IconButton, Card, CardMedia, CardContent } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { MediaSpotlightContent } from '../../../types/activityContentTypes';

// The HighlightedWord helper can be reused from LetterSpotlight.tsx
// Or copied here if you prefer to keep components fully separate.
const HighlightedWord: React.FC<{ word: string; letter: string }> = ({ word, letter }) => {
    const parts = word.split(new RegExp(`(${letter})`, 'gi'));
    return (
        <Typography variant="h4" component="span" fontWeight="bold">
            {parts.map((part, index) =>
                part.toLowerCase() === letter.toLowerCase() ? (
                    <Typography key={index} component="span" variant="h4" color="error" fontWeight="bold">
                        {part}
                    </Typography>
                ) : (
                    part
                )
            )}
        </Typography>
    );
};

interface MediaSpotlightProps {
    content: MediaSpotlightContent;
}

const MediaSpotlight: React.FC<MediaSpotlightProps> = ({ content }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentItem = content.items[currentIndex];

    const goToNext = () => {
        setCurrentIndex(prev => (prev + 1) % content.items.length); // Loop back to start
    };

    const goToPrev = () => {
        setCurrentIndex(prev => (prev - 1 + content.items.length) % content.items.length); // Loop back to end
    };

    const playAudio = () => {
        if (currentItem.audioUrl) {
            if (audioRef.current) {
                audioRef.current.src = currentItem.audioUrl;
                audioRef.current.play();
            }
        }
    };

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
             {/* Top section: The spotlight letter */}
            <Paper
                elevation={4}
                sx={{
                    display: 'inline-flex', // Use inline-flex to size to content
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '120px',
                    height: '120px',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%', // Make it a circle
                    mb: 3
                }}
            >
                <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 'bold' }}>
                    {content.spotlightLetter}
                </Typography>
            </Paper>

            {/* Middle section: The Image/Word Card */}
            <Box display="flex" alignItems="center" justifyContent="center">
                 <IconButton onClick={goToPrev} aria-label="previous item">
                    <ArrowBackIosNewIcon />
                </IconButton>

                <Card sx={{ minWidth: 250, mx: 1 }}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={currentItem.imageUrl}
                        alt={currentItem.text}
                        sx={{ objectFit: 'contain', p: 1 }}
                    />
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <HighlightedWord word={currentItem.text} letter={content.spotlightLetter} />
                         {currentItem.audioUrl && (
                             <IconButton onClick={playAudio} color="primary" sx={{ ml: 1 }}>
                                 <VolumeUpIcon />
                             </IconButton>
                         )}
                    </CardContent>
                </Card>

                <IconButton onClick={goToNext} aria-label="next item">
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            {/* Bottom section: Progress indicator */}
            <Typography variant="body2" color="text.secondary" mt={2}>
                {currentIndex + 1} / {content.items.length}
            </Typography>

            {/* Hidden audio element for playback */}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default MediaSpotlight;