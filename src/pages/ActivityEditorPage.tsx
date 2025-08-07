import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Grid, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Activity } from '../types/activity';
import * as activityApi from '../api/activityApi';

import ActivityForm from '../components/activities/ActivityForm';
import DevicePreview from '../components/activities/DevicePreview';

// Helper hook to read URL query parameters
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ActivityEditorPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const activityId = query.get('activityId');
    const lessonId = query.get('lessonId');
    const isEditMode = !!activityId;

    // The single source of truth for the activity being edited.
    const [activity, setActivity] = useState<Partial<Activity> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // State to hold a single question object for the single-question preview feature
    const [previewQuestionData, setPreviewQuestionData] = useState<any>(null);

    // Memoize the back URL to prevent unnecessary recalculations
    const backUrl = React.useMemo(() => {
        // The lessonId from the loaded activity is the most reliable source in edit mode.
        return `/activities?lessonId=${activity?.lessonId || lessonId}`;
    }, [activity?.lessonId, lessonId]);

    // Fetches initial data when the component mounts or the activityId changes
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (isEditMode && activityId) {
                const actData = await activityApi.getActivityById(activityId);
                
                // Attempt to pretty-print the JSON for better readability in the editor
                try {
                   actData.contentJson = JSON.stringify(JSON.parse(actData.contentJson), null, 2);
                } catch { 
                    // If JSON is invalid, leave it as is for the admin to fix.
                }
                setActivity(actData);
            } else {
                // This is the default state for creating a new activity
                setActivity({
                    title: '',
                    sequenceOrder: 1,
                    mainActivityId: 0,
                    activityTypeId: 0,
                    contentJson: '{\n  "activityTitle": "",\n  "questions": []\n}', // Provide a helpful default structure
                    lessonId: parseInt(lessonId || '0', 10)
                });
            }
        } catch (error) {
            console.error("Failed to load data", error);
            alert("Failed to load activity data. You will be redirected.");
            navigate('/lessons'); // Redirect on critical error
        } finally {
            setIsLoading(false);
        }
    }, [activityId, isEditMode, lessonId, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);
    
    // Callback function passed to the form to update this component's state
    const handleFormChange = (updatedActivityData: Partial<Activity>) => {
        setActivity(updatedActivityData);
        // When the form's core data changes, we reset the single-question preview
        // to avoid showing a stale preview.
        setPreviewQuestionData(null);
    };

    // Callback passed to the QuestionListEditor to set a specific question for preview
    const handlePreviewQuestion = (questionData: any) => {
        setPreviewQuestionData(questionData);
    };

    // Handles the final save operation (Create or Update)
    const handleSave = async () => {
        if (!activity) {
            alert("No activity data to save.");
            return;
        }

        try {
            // Prepare a clean payload for the API
            const payload = { ...activity };

            // Ensure numeric fields are correctly typed
            payload.sequenceOrder = Number(payload.sequenceOrder);
            payload.mainActivityId = Number(payload.mainActivityId);
            payload.activityTypeId = Number(payload.activityTypeId);
            payload.lessonId = Number(payload.lessonId);

            // Ensure JSON is minified before sending to the database
            try {
                payload.contentJson = JSON.stringify(JSON.parse(payload.contentJson || '{}'));
            } catch {
                alert("The Content JSON is invalid and cannot be saved.");
                return;
            }

            if (isEditMode && activityId) {
                await activityApi.updateActivity(activityId, payload as any);
            } else {
                await activityApi.createActivity(payload as any);
            }
            
            alert('Activity saved successfully!');
            navigate(backUrl);

        } catch (error) {
            console.error("Failed to save activity", error);
            alert("An error occurred while saving the activity. Please check the console.");
        }
    };
    
    // Render loading spinner until initial data is fetched
    if (isLoading || !activity) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                 <Typography variant="h4" component="h1">
                    {isEditMode ? `Edit Activity #${activityId}` : `Add New Activity`}
                </Typography>
                 <Button onClick={() => navigate(backUrl)} startIcon={<ArrowBackIcon />}>Back to List</Button>
            </Box>
           
            <Paper elevation={2} sx={{ p: { xs: 2, md: 3 } }}>
                <Grid container spacing={4}>
                    {/* Left Column: The Form */}
                    <Grid item xs={12} lg={6}>
                        <ActivityForm 
                            activityData={activity}
                            onDataChange={handleFormChange}
                            onSave={handleSave}
                            onPreviewQuestion={handlePreviewQuestion}
                        />
                    </Grid>
                    
                    {/* Right Column: The Preview */}
                    <Grid item xs={12} lg={6}>
                        <DevicePreview 
                            activityData={activity}
                            overridePreviewData={previewQuestionData}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ActivityEditorPage;