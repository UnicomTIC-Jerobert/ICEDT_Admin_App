import React, { useState } from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import { Activity } from '../../types/activity';
import ActivityRenderer from './previews/ActivityRenderer';

interface DevicePreviewProps {
    activityData: Partial<Activity>;
    // This prop will receive a single question object when the admin
    // clicks a "Preview" button in the QuestionListEditor.
    overridePreviewData?: any; 
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ activityData, overridePreviewData }) => {
    const [device, setDevice] = useState<'phone' | 'tablet'>('phone');

    const handleDeviceChange = (event: React.MouseEvent<HTMLElement>, newDevice: 'phone' | 'tablet' | null) => {
        if (newDevice !== null) {
            setDevice(newDevice);
        }
    };
    
    // Parse the full JSON to get the overall activity title for the header
    let contentTitle = 'Activity Preview';
    try {
        if (activityData.contentJson) {
            const parsedContent = JSON.parse(activityData.contentJson);
            if (parsedContent.activityTitle) {
                contentTitle = parsedContent.activityTitle;
            }
        }
    } catch {
        // Ignore parsing errors for the title, the renderer will handle the full error
    }

    // Define the dimensions for our simulated devices
    // These are scaled down to fit nicely on a typical monitor.
    const deviceStyles = {
        phone: { width: '375px', height: '667px' },
        tablet: { width: '540px', height: '720px' }
    };

    return (
        <Box sx={{ position: 'sticky', top: '20px' }}> {/* Makes the preview stay in view on scroll */}
            <Typography variant="h6" align="center" gutterBottom>Live Preview</Typography>
            <Box display="flex" justifyContent="center" mb={2}>
                 <ToggleButtonGroup
                    value={device}
                    exclusive
                    onChange={handleDeviceChange}
                    aria-label="device preview size"
                >
                    <ToggleButton value="phone" aria-label="phone">
                        <PhoneIphoneIcon />
                        <Typography variant="caption" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>Phone</Typography>
                    </ToggleButton>
                    <ToggleButton value="tablet" aria-label="tablet">
                        <TabletMacIcon />
                        <Typography variant="caption" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>Tablet</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            
            <Box display="flex" justifyContent="center">
                <Paper
                    elevation={8}
                    sx={{
                        width: deviceStyles[device].width,
                        height: deviceStyles[device].height,
                        borderRadius: '40px',
                        border: '12px solid #333',
                        bgcolor: '#111',
                        p: '2px',
                        boxSizing: 'content-box',
                        transition: 'width 0.3s ease, height 0.3s ease',
                        position: 'relative'
                    }}
                >
                    {/* The content area of the simulated device */}
                    <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        bgcolor: 'white', 
                        borderRadius: '28px', 
                        overflow: 'hidden', 
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                         {/* The "notch" at the top of the phone */}
                         <Box sx={{
                            width: '40%', height: '20px', background: '#111',
                            borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px',
                            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 2
                         }}/>
                         
                         {/* Header inside the device */}
                         <Box sx={{ p: 2, borderBottom: '1px solid #eee', textAlign: 'center', flexShrink: 0, mt: '20px' }}>
                             <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                 {contentTitle || activityData.title}
                             </Typography>
                         </Box>
                         
                         {/* Main content area where the activity is rendered */}
                         <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            <ActivityRenderer
                                activityTypeId={activityData.activityTypeId || 0}
                                contentJson={activityData.contentJson || '{}'}
                                // Pass the specific question data if it exists
                                overridePreviewData={overridePreviewData}
                            />
                         </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default DevicePreview;