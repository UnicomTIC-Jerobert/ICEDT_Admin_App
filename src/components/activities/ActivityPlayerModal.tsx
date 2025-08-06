import React, { useState } from 'react';
import { Box, Modal, Paper, Typography, ToggleButtonGroup, ToggleButton, IconButton, Button } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

import { Activity } from '../../types/activity';
import ActivityRenderer from './previews/ActivityRenderer'; // A new component to render the specific activity UI

interface ActivityPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity;
}

const ActivityPlayerModal: React.FC<ActivityPlayerModalProps> = ({ isOpen, onClose, activity }) => {
    const [device, setDevice] = useState<'phone' | 'tablet'>('phone');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    // Parse the JSON content safely
    let content;
    try {
        content = JSON.parse(activity.contentJson);
    } catch {
        content = { activityTitle: "Error", questions: [{ prompt: "Invalid JSON Content" }] };
    }

    const questions = content.questions || [];
    const isPaginated = Array.isArray(questions) && questions.length > 1;

    const handleDeviceChange = (event: React.MouseEvent<HTMLElement>, newDevice: 'phone' | 'tablet' | null) => {
        if (newDevice !== null) setDevice(newDevice);
    };
    
    const goToNext = () => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
    const goToPrev = () => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));

    // Reset index when modal opens for a new activity
    React.useEffect(() => {
        if (isOpen) {
            setCurrentQuestionIndex(0);
        }
    }, [isOpen]);

    const deviceStyles = {
        phone: { width: '375px', height: '667px' },
        tablet: { width: '540px', height: '720px' }
    };

    return (
        <Modal open={isOpen} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
                <Box display="flex" justifyContent="center" mb={2}>
                     <ToggleButtonGroup value={device} exclusive onChange={handleDeviceChange} sx={{ bgcolor: 'background.paper' }}>
                        <ToggleButton value="phone"><PhoneIphoneIcon /></ToggleButton>
                        <ToggleButton value="tablet"><TabletMacIcon /></ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                
                <Paper
                    elevation={8}
                    sx={{
                        width: deviceStyles[device].width,
                        height: deviceStyles[device].height,
                        borderRadius: '40px',
                        border: '12px solid #333',
                        bgcolor: 'white',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>

                    {/* Header */}
                    <Box sx={{ p: 2, borderBottom: '1px solid #eee', textAlign: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold">{content.activityTitle || activity.title}</Typography>
                        {isPaginated && <Typography variant="caption" color="text.secondary">Question {currentQuestionIndex + 1} of {questions.length}</Typography>}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                        <ActivityRenderer
                            activityTypeId={activity.activityTypeId}
                            contentJson={activity.contentJson}
                            currentQuestionIndex={currentQuestionIndex}
                        />
                    </Box>
                    
                    {/* Footer with Pagination */}
                    {isPaginated && (
                        <Box sx={{ p: 1, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button onClick={goToPrev} disabled={currentQuestionIndex === 0} startIcon={<ArrowBackIosNewIcon />}>
                                Prev
                            </Button>
                            <Button onClick={goToNext} disabled={currentQuestionIndex >= questions.length - 1} endIcon={<ArrowForwardIosIcon />}>
                                Next
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Modal>
    );
};

export default ActivityPlayerModal;