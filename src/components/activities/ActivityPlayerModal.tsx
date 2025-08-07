import React, { useState, useEffect } from 'react';
import { Box, Modal, Paper, Typography, ToggleButtonGroup, ToggleButton, IconButton, Button } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

import { Activity } from '../../types/activity';
import ActivityRenderer from './previews/ActivityRenderer';

interface ActivityPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity;
}

const ActivityPlayerModal: React.FC<ActivityPlayerModalProps> = ({ isOpen, onClose, activity }) => {
    const [device, setDevice] = useState<'phone' | 'tablet'>('phone');
    // State for navigating between EXERCISES
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
    // State for navigating between QUESTIONS (if applicable)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    // --- Data Parsing and Logic ---
    let exercises: any[] = [];
    try {
        const parsedContent = JSON.parse(activity.contentJson);
        exercises = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    } catch {
        exercises = [{ error: "Invalid Activity JSON format." }];
    }

    const currentExerciseData = exercises[currentExerciseIndex] || {};
    const questions = Array.isArray(currentExerciseData.questions) ? currentExerciseData.questions : [];
    
    // Determine if the CURRENT exercise has inner pagination
    const isExercisePaginated = questions.length > 1;
    // Determine if the WHOLE activity has outer pagination
    const isActivityPaginated = exercises.length > 1;

    // --- State Resets and Navigation ---
    useEffect(() => {
        if (isOpen) {
            setCurrentExerciseIndex(0);
            setCurrentQuestionIndex(0);
        }
    }, [isOpen, activity.activityId]);

    // When the exercise changes, reset the question index
    useEffect(() => {
        setCurrentQuestionIndex(0);
    }, [currentExerciseIndex]);
    
    // Outer navigation (Exercises)
    const goToNextExercise = () => setCurrentExerciseIndex(prev => Math.min(prev + 1, exercises.length - 1));
    const goToPrevExercise = () => setCurrentExerciseIndex(prev => Math.max(prev - 1, 0));
    
    // Inner navigation (Questions)
    const goToNextQuestion = () => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
    const goToPrevQuestion = () => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));


    const deviceStyles = {
        phone: { width: '375px', height: '667px' },
        tablet: { width: '540px', height: '720px' }
    };
    const currentExerciseJson = JSON.stringify(currentExerciseData);

    return (
        <Modal open={isOpen} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
                {/* ... Device Toggle Buttons ... */}
                <Box display="flex" justifyContent="center" mb={2}>
                    <ToggleButtonGroup value={device} exclusive onChange={(e, newDevice) => newDevice && setDevice(newDevice)} sx={{ bgcolor: 'background.paper' }}>
                        <ToggleButton value="phone" aria-label="phone"><PhoneIphoneIcon /></ToggleButton>
                        <ToggleButton value="tablet" aria-label="tablet"><TabletMacIcon /></ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                
                <Paper elevation={8} sx={{...deviceStyles[device], borderRadius: '40px', border: '12px solid #333', bgcolor: 'white', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', transition: 'width 0.3s, height 0.3s'}}>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10, color: '#aaa', background: 'rgba(0,0,0,0.2)' }}><CloseIcon /></IconButton>
                    
                    {/* Header */}
                    <Box sx={{ p: 2, borderBottom: '1px solid #eee', textAlign: 'center', flexShrink: 0 }}>
                        <Typography variant="subtitle1" fontWeight="bold">{currentExerciseData.activityTitle || activity.title}</Typography>
                        {isActivityPaginated && <Typography variant="caption" color="text.secondary">Exercise {currentExerciseIndex + 1} of {exercises.length}</Typography>}
                    </Box>

                    {/* Content Area */}
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <ActivityRenderer
                                activityTypeId={activity.activityTypeId}
                                contentJson={currentExerciseJson}
                                currentQuestionIndex={currentQuestionIndex}
                            />
                        </Box>
                        {/* Inner Pagination for QUESTIONS (only shown if needed) */}
                        {isExercisePaginated && (
                            <Box sx={{ mt: 2, p: 1, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                                <Button onClick={goToPrevQuestion} disabled={currentQuestionIndex === 0} startIcon={<ArrowBackIosNewIcon />}>Prev</Button>
                                <Typography variant="caption">Question {currentQuestionIndex + 1} of {questions.length}</Typography>
                                <Button onClick={goToNextQuestion} disabled={currentQuestionIndex >= questions.length - 1} endIcon={<ArrowForwardIosIcon />}>Next</Button>
                            </Box>
                        )}
                    </Box>
                    
                    {/* Footer with OUTER pagination for EXERCISES (only shown if needed) */}
                    {isActivityPaginated && (
                        <Box sx={{ p: 1, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, bgcolor: '#f9f9f9' }}>
                            <Button onClick={goToPrevExercise} disabled={currentExerciseIndex === 0} startIcon={<ArrowBackIosNewIcon />}>Prev Exercise</Button>
                            <Button onClick={goToNextExercise} disabled={currentExerciseIndex >= exercises.length - 1} endIcon={<ArrowForwardIosIcon />}>Next Exercise</Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Modal>
    );
};

export default ActivityPlayerModal;