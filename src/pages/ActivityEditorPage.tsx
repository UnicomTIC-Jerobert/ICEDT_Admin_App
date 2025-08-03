import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Grid, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Activity } from '../types/activity';
import * as activityApi from '../api/activityApi';

import ActivityForm from '../components/activities/ActivityForm'; // Left Column
import DevicePreview from '../components/activities/DevicePreview'; // Right Column

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ActivityEditorPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const activityId = query.get('activityId');
    const lessonId = query.get('lessonId');
    const isEditMode = !!activityId;

    // The central state for the entire page
    const [activity, setActivity] = useState<Partial<Activity> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const backUrl = `/activities?lessonId=${activity?.lessonId || lessonId}`;

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (isEditMode && activityId) {
                const actData = await activityApi.getActivityById(activityId);
                // Pretty-print JSON for the editor
                try {
                    actData.contentJson = JSON.stringify(JSON.parse(actData.contentJson), null, 2);
                } catch { /* ignore if not valid json */ }
                setActivity(actData);
            } else {
                // Default state for a new activity
                setActivity({
                    title: '',
                    sequenceOrder: 1, // Default to 1
                    mainActivityId: 0,
                    activityTypeId: 0,
                    contentJson: '{}',
                    lessonId: parseInt(lessonId || '0', 10)
                });
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    }, [activityId, isEditMode, lessonId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFormChange = (updatedActivityData: Partial<Activity>) => {
        setActivity(updatedActivityData);
    };

    const handleSave = async () => {
        if (!activity) return;

        try {
            const payload = { ...activity };
            // Ensure numbers are numbers
            payload.sequenceOrder = Number(payload.sequenceOrder);
            payload.mainActivityId = Number(payload.mainActivityId);
            payload.activityTypeId = Number(payload.activityTypeId);
            payload.lessonId = Number(payload.lessonId);

            if (isEditMode && activityId) {
                await activityApi.updateActivity(activityId, payload as any);
            } else {
                await activityApi.createActivity(payload as any);
            }
            alert('Activity saved successfully!');
            navigate(backUrl);
        } catch (error) {
            console.error("Failed to save activity", error);
            alert("An error occurred while saving.");
        }
    };

    if (isLoading || !activity) {
        return <CircularProgress />;
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">
                    {isEditMode ? `Edit Activity #${activityId}` : `Add New Activity`}
                </Typography>
                <Button onClick={() => navigate(backUrl)} startIcon={<ArrowBackIcon />}>Back to List</Button>
            </Box>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Grid container spacing={4}>
                    {/* Left Column: The Form */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ActivityForm
                            activityData={activity}
                            onDataChange={handleFormChange}
                            onSave={handleSave}
                        />
                    </Grid>

                    {/* Right Column: The Preview */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DevicePreview
                            activityData={activity}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ActivityEditorPage;