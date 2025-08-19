import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid, Button, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Activity } from '../types/activity';
import * as activityApi from '../api/activityApi';

import ActivityForm from '../components/activities/ActivityForm';
import DevicePreview from '../components/activities/DevicePreview';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// A constant for the top offset to easily adjust if your app's header height changes
const TOP_OFFSET = 100; // in pixels

const ActivityEditorPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const activityId = query.get('activityId');
    const lessonId = query.get('lessonId');
    const isEditMode = !!activityId;

    const [activity, setActivity] = useState<Partial<Activity> | null>(null);
    const [previewContent, setPreviewContent] = useState<Partial<Activity> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // State to control which accordion is expanded. `false` means all are closed, a number means that index is open.
    const [expandedExercise, setExpandedExercise] = useState<number | false>(0);

    const backUrl = `/activities?lessonId=${activity?.lessonId || lessonId}`;

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            let loadedActivity: Partial<Activity>;
            if (isEditMode && activityId) {
                loadedActivity = await activityApi.getActivityById(activityId);
            } else {
                loadedActivity = {
                    title: '',
                    sequenceOrder: 1,
                    mainActivityId: 0,
                    activityTypeId: 0,
                    contentJson: '[{}]',
                    lessonId: parseInt(lessonId || '0', 10)
                };
            }

            let exercises: any[] = [];
            try {
                const parsedContent = JSON.parse(loadedActivity.contentJson || '[]');
                exercises = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
                if (exercises.length === 0) exercises.push({});
            } catch {
                exercises = [{}];
            }

            loadedActivity.contentJson = JSON.stringify(exercises, null, 2);
            setActivity(loadedActivity);

            setPreviewContent({
                ...loadedActivity,
                contentJson: JSON.stringify(exercises[0], null, 2)
            });

        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    }, [activityId, isEditMode, lessonId]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleFormChange = (updatedActivityData: Partial<Activity>) => {
        setActivity(updatedActivityData);
    };

    const handlePreviewExercise = (exerciseJsonString: string) => {
        if (!activity) return;
        setPreviewContent({ ...activity, contentJson: exerciseJsonString });
    };

    const handleSave = async () => {
        if (!activity || !activity.contentJson) return;
        // 1. Validate the JSON content before proceeding.
        try {
            // This ensures the string is valid JSON, but we use the string itself in the payload.
            JSON.parse(activity.contentJson);
        } catch (error) {
            alert("An exercise contains invalid JSON. Please fix it before saving.");
            return;
        }

        // 2. Construct the payload with the exact shape the API expects (ActivityCreateDto/UpdateDto).
        const payload = {
            title: activity.title || null, // Ensure title is not undefined
            sequenceOrder: Number(activity.sequenceOrder),
            contentJson: activity.contentJson,
            lessonId: Number(activity.lessonId),
            activityTypeId: Number(activity.activityTypeId),
            mainActivityId: Number(activity.mainActivityId)
        };

        // 3. Validate that required IDs are present.
        if (!payload.lessonId || !payload.activityTypeId || !payload.mainActivityId) {
            alert("Lesson, Activity Type, and Main Activity must be selected.");
            return;
        }

        try {
            // const payload = { ...activity };
            // // Ensure types are correct
            // payload.sequenceOrder = Number(payload.sequenceOrder);
            // payload.mainActivityId = Number(payload.mainActivityId);
            // payload.activityTypeId = Number(payload.activityTypeId);
            // payload.lessonId = Number(payload.lessonId);

            if (isEditMode && activityId) {
                await activityApi.update(activityId, payload as any);
            } else {
                await activityApi.create(payload as any);
            }
            alert('Activity saved successfully!');
            navigate(backUrl);
        } catch (error) {
            console.error("Failed to save activity", error);
            alert("An error occurred while saving.");
        }
    };

    // Handler passed to the form to control accordion expansion from the parent
    const handleExpansionChange = (panelIndex: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedExercise(isExpanded ? panelIndex : false);
    };

    // Handler to programmatically set the expanded accordion (e.g., when adding a new one)
    const handleSetExpanded = (index: number) => {
        setExpandedExercise(index);
    };


    if (isLoading || !activity) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">
                    {isEditMode ? `Edit Activity #${activityId}` : `Add New Activity`}
                </Typography>
                <Button onClick={() => navigate(backUrl)} startIcon={<ArrowBackIcon />}>Back to List</Button>
            </Box>

            <Grid container spacing={4}>
                {/* Left Column: The SCROLLABLE Form */}
                <Grid size={{ xs: 12, md: 7 }} sx={{
                    height: `calc(100vh - ${TOP_OFFSET}px)`,
                    overflowY: 'auto',
                    pr: 2 // padding-right for scrollbar gap
                }}>
                    <ActivityForm
                        activityData={activity}
                        onDataChange={handleFormChange}
                        onSave={handleSave}
                        onPreviewExercise={handlePreviewExercise}
                        expandedExercise={expandedExercise}
                        onExpansionChange={handleExpansionChange}
                        onSetExpanded={handleSetExpanded}
                    />
                </Grid>

                {/* Right Column: The STICKY Preview */}
                <Grid size={{ xs: 12, md: 5 }} sx={{
                    position: 'sticky',
                    top: `24px`,
                    height: `calc(100vh - ${TOP_OFFSET}px)`,
                }}>
                    {previewContent && <DevicePreview activityData={previewContent} />}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ActivityEditorPage;