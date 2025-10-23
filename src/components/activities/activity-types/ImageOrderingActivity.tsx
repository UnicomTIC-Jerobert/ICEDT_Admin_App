import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardMedia,
    Chip,
    Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export interface ImageOrderingItem {
    id: number;
    imageUrl: string;
    audioUrl: string;
    letter: string;
    name: string;
}

export interface ImageOrderingContent {
    title: string;
    description?: string;
    items: ImageOrderingItem[];
    targetOrder: string[];
}

const ImageOrderingActivity: React.FC<{ content: ImageOrderingContent }> = ({ content }) => {
    const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';
    const [items, setItems] = useState<ImageOrderingItem[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [draggedItem, setDraggedItem] = useState<ImageOrderingItem | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const shuffled = [...content.items].sort(() => Math.random() - 0.5);
        setItems(shuffled);
    }, [content.items]);

    useEffect(() => {
        const currentOrder = items.map(item => item.letter);
        const isCorrectOrder = JSON.stringify(currentOrder) === JSON.stringify(content.targetOrder);
        setIsCorrect(isCorrectOrder);
    }, [items, content.targetOrder]);

    const handleDragStart = (e: React.DragEvent, item: ImageOrderingItem) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        setDragOverIndex(null);

        if (!draggedItem) return;

        const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
        if (draggedIndex !== targetIndex) {
            const newItems = [...items];
            [newItems[draggedIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[draggedIndex]];
            setItems(newItems);
        }

        setDraggedItem(null);
    };

    const handlePlayAudio = (audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = `${mediaBaseUrl}${audioUrl}`;
            audioRef.current.play().catch(err => console.error('Audio play error:', err));
        }
    };

    const handleReset = () => {
        const shuffled = [...content.items].sort(() => Math.random() - 0.5);
        setItems(shuffled);
        setIsCorrect(false);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {content.title}
                </Typography>
                {content.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {content.description}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    {content.targetOrder.map((letter, idx) => (
                        <Chip
                            key={idx}
                            label={letter}
                            sx={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                padding: '20px 12px',
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {isCorrect && (
                <Alert severity="success" sx={{ mb: 3, fontSize: '16px', fontWeight: 'bold' }}>
                    🎉 Perfect! You've arranged the images in the correct order!
                </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
                {items.map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                        <Card
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            sx={{
                                cursor: 'grab',
                                transition: 'all 0.3s ease',
                                boxShadow: dragOverIndex === index ? 6 : 2,
                                backgroundColor: dragOverIndex === index ? '#e3f2fd' : 'white',
                                border: dragOverIndex === index ? '3px dashed #1976d2' : '2px solid transparent',
                                '&:active': { cursor: 'grabbing' },
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'scale(1.02)',
                                },
                                opacity: draggedItem?.id === item.id ? 0.5 : 1,
                            }}
                        >
                            <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={`${mediaBaseUrl}${item.imageUrl}`}
                                    alt={item.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {item.letter}
                                </Box>
                                <Button
                                    size="small"
                                    startIcon={<PlayArrowIcon />}
                                    onClick={() => handlePlayAudio(item.audioUrl)}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        left: 8,
                                        backgroundColor: 'rgba(33, 150, 243, 0.9)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(33, 150, 243, 1)',
                                        },
                                    }}
                                >
                                    Play
                                </Button>
                            </Box>
                            <Box sx={{ p: 1, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {item.name}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    startIcon={<RestartAltIcon />}
                    onClick={handleReset}
                    sx={{
                        backgroundColor: '#ff9800',
                        '&:hover': {
                            backgroundColor: '#f57c00',
                        },
                    }}
                >
                    Reset
                </Button>
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Container>
    );
};

export default ImageOrderingActivity;
