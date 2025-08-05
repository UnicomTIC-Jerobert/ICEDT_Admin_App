import React, { useState } from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import { Activity } from '../../types/activity';

import MCQActivity from './activity-types/MCQActivity';
import { MCQContent } from '../../types/activityContentTypes';

import MatchingActivity from './activity-types/MatchingActivity';
import { MatchingContent } from '../../types/activityContentTypes';

import EquationFillInTheBlank from './activity-types/EquationFillInTheBlank';
// Import the REFINED type
import { SimpleEquationContent } from '../../types/activityContentTypes';

import FirstLetterMatch from './activity-types/FirstLetterMatch';
import { FirstLetterMatchContent } from '../../types/activityContentTypes';

interface DevicePreviewProps {
    activityData: Partial<Activity>;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ activityData }) => {
    const [device, setDevice] = useState<'phone' | 'tablet'>('phone');

    const handleDeviceChange = (event: React.MouseEvent<HTMLElement>, newDevice: 'phone' | 'tablet' | null) => {
        if (newDevice !== null) {
            setDevice(newDevice);
        }
    };

    const renderActivityComponent = () => {
        if (!activityData.activityTypeId || !activityData.contentJson) {
            return <Typography p={2} color="text.secondary">Please select an activity type and provide JSON content.</Typography>;
        }

        let content;
        try {
            content = JSON.parse(activityData.contentJson);
        } catch (e) {
            return <Typography p={2} color="error">Invalid JSON format. Preview is paused.</Typography>;
        }

        switch (activityData.activityTypeId) {
            case 4: // Matching (Assuming ID from your DB)
                if ('words' in content) {
                     return <FirstLetterMatch content={content as FirstLetterMatchContent} />;
                 }
                 if ('columnA' in content) {
                     return <MatchingActivity content={content as MatchingContent} />;
                 }
                 return <Typography p={2} color="error">Invalid JSON structure for Matching activity.</Typography>;
            case 7: // FillInTheBlanks
                return <EquationFillInTheBlank content={content as SimpleEquationContent} />;
            case 13: // MultipleChoiceQuestion (ID from your DB seeder)
                // Type assertion tells TypeScript to trust us that the content matches the MCQContent interface
                return <MCQActivity content={content as MCQContent} />;
            // Add cases for all 18 activity types here
            default:
                return <Typography p={2} color="text.secondary">Preview for this activity type is not yet implemented.</Typography>;
        }
    };

    const deviceStyles = {
        phone: { width: '375px', height: '667px' },
        tablet: { width: '768px', height: '1024px' }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="center" mb={2}>
                <ToggleButtonGroup
                    value={device}
                    exclusive
                    onChange={handleDeviceChange}
                    aria-label="device orientation"
                >
                    <ToggleButton value="phone" aria-label="phone">
                        <PhoneIphoneIcon />
                    </ToggleButton>
                    <ToggleButton value="tablet" aria-label="tablet">
                        <TabletMacIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box display="flex" justifyContent="center">
                <Paper
                    elevation={6}
                    sx={{
                        width: deviceStyles[device].width,
                        height: deviceStyles[device].height,
                        borderRadius: '36px',
                        border: '10px solid black',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        transition: 'width 0.3s, height 0.3s',
                        position: 'relative',
                        backgroundColor: '#fff'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute', top: 0, left: 0, right: 0,
                            height: '25px', background: 'black',
                            borderTopLeftRadius: '25px', borderTopRightRadius: '25px'
                        }}
                    >
                        <Box sx={{
                            width: '40%', height: '5px', background: '#333',
                            borderRadius: '5px', position: 'absolute',
                            top: '10px', left: '50%', transform: 'translateX(-50%)'
                        }} />
                    </Box>
                    <Box sx={{ paddingTop: '25px', height: '100%', overflowY: 'auto' }}>
                        {renderActivityComponent()}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default DevicePreview;