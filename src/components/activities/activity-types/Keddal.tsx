import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { ListenMatchContent } from './Listen&match';

export interface KeddalItem {
  text: string;
  imageUrl: string;
  audioUrl?: string;
}

export interface KeddalContent {
  title: string;
  solliyangkal: string[];
  vinaakkal: string[];
  items: KeddalItem[];
}

const KeddalDragDrop: React.FC<{ content: KeddalContent }> = ({ content }) => {
  const [questions, setQuestions] = useState<{ id: string; text: string; answer: string | null }[]>(
    content.vinaakkal.map((q, index) => ({ id: `q-${index}`, text: q, answer: null }))
  );

  const [numbers, setNumbers] = useState(
    content.items.map((_, index) => ({ id: `n-${index}`, number: index + 1 }))
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const questionIndex = parseInt(destination.droppableId.replace('question-', ''), 10);
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[questionIndex].answer = draggableId;
      return newQuestions;
    });

    setNumbers(prev => prev.filter(n => n.id !== draggableId));
  };

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error(e));
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>{content.title}</Typography>

      <Typography variant="h5">படங்கள்</Typography>
      <Grid container spacing={2}>
        {content.items.map((item, i) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }}key={i}>
            <Card>
              <CardMedia
                component="img"
                height="120"
                image={item.imageUrl}
                alt={item.text}
                sx={{ objectFit: 'contain', p: 1 }}
              />
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{item.text}</Typography>
                {item.audioUrl && (
                  <IconButton onClick={() => playAudio(item.audioUrl)} size="small" color="primary">
                    <VolumeUpIcon />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant="h5">வினாக்கள்</Typography>
        <DragDropContext onDragEnd={onDragEnd}>
          {questions.map((q, i) => (
            <Droppable droppableId={`question-${i}`} key={q.id}>
              {(provided) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ p: 2, mb: 2, minHeight: 60, backgroundColor: '#f0f0f0' }}
                >
                  <Typography>{i + 1}. {q.text}</Typography>
                  {q.answer && (
                    <Typography mt={1}>நம்பர்: {q.answer.replace('n-', '')}</Typography>
                  )}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}

          <Typography variant="h5" mt={4}>நம்பர்கள்</Typography>
          <Droppable droppableId="numbers" direction="horizontal">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {numbers.map((n, i) => (
                  <Draggable draggableId={n.id} index={i} key={n.id}>
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'grab' }}
                      >
                        {n.number}
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Box>
  );
};

export default KeddalContent;
