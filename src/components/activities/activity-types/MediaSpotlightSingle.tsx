import React, { useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Card, CardMedia, CardContent } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { MediaSpotlightSingleContent } from '../../../types/activityContentTypes';

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
    content: MediaSpotlightSingleContent;
}

const MediaSpotlightSingle: React.FC<MediaSpotlightProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Automatically play audio when the component is shown
    useEffect(() => {
        const timer = setTimeout(() => playAudio(), 300);
        return () => clearTimeout(timer);
    }, [content]); // Rerun if the content object changes

    const playAudio = () => {
        if (content.item.audioUrl && audioRef.current) {
            audioRef.current.src = content.item.audioUrl;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };
    
    if (!content || !content.item) {
        return <Typography color="error">Invalid MediaSpotlight content.</Typography>;
    }

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Paper
                elevation={4}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '120px',
                    height: '120px',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    mb: 3
                }}
            >
                <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 'bold' }}>
                    {content.spotlightLetter}
                </Typography>
            </Paper>

            {/* --- REMOVED NAVIGATION BUTTONS --- */}
            {/* The component now renders only the single 'item' it receives */}
            <Box display="flex" alignItems="center" justifyContent="center">
                <Card sx={{ minWidth: 250, mx: 1 }}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={`${process.env.REACT_APP_MEDIA_URL}/${content.item.imageUrl}`}
                        alt={content.item.text}
                        sx={{ objectFit: 'contain', p: 1 }}
                    />
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <HighlightedWord word={content.item.text} letter={content.spotlightLetter} />
                         {content.item.audioUrl && (
                             <IconButton onClick={playAudio} color="primary" sx={{ ml: 1 }}>
                                 <VolumeUpIcon />
                             </IconButton>
                         )}
                    </CardContent>
                </Card>
            </Box>

            {/* --- REMOVED PROGRESS INDICATOR --- */}
            {/* The parent (ActivityPlayerModal) is responsible for showing progress */}

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default MediaSpotlightSingle;