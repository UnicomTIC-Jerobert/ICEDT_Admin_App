import React, { useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Card, CardMedia, CardContent } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { FlashcardContent } from '../../../types/activityContentTypes';

// The component now expects props for a SINGLE flashcard.
interface FlashcardProps {
    content: FlashcardContent;
}

const Flashcard: React.FC<FlashcardProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Automatically play the sound when the component is displayed
    useEffect(() => {
        // Add a small delay to allow the card to render before playing
        const timer = setTimeout(() => {
            playAudio();
        }, 300);
        return () => clearTimeout(timer);
    }, [content]); // Rerun effect if the content (the specific card) changes

    const playAudio = () => {
        if (content?.audioUrl && audioRef.current) {
            audioRef.current.src = `https://icedt-tamilapp-media.s3.eu-north-1.amazonaws.com/${content.audioUrl}`;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    if (!content) {
        return <Typography color="error">No flashcard content to display.</Typography>;
    }

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" component="h2" mb={3}>{content.title}</Typography>
            
            <Card sx={{ width: 320, boxShadow: 6 }}>
                <CardMedia
                    component="img"
                    height="240"
                    image={`https://icedt-tamilapp-media.s3.eu-north-1.amazonaws.com/${content.imageUrl}`}
                    alt={content.word}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                     <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="h3" component="div">
                           {content.word}
                        </Typography>
                         {content.audioUrl && (
                             <IconButton onClick={playAudio} color="primary" sx={{ ml: 1 }}>
                                 <VolumeUpIcon fontSize="large" />
                             </IconButton>
                         )}
                     </Box>
                </CardContent>
            </Card>

            {/* Hidden audio element for playback */}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default Flashcard;