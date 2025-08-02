import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, CircularProgress, Paper,
    Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Activity } from '../types/activity';
import { MainActivity } from '../types/mainActivity';
import { ActivityType } from '../types/activityType';

import * as activityApi from '../api/activityApi';
import * as mainActivityApi from '../api/mainActivityApi';
import * as activityTypeApi from '../api/activityTypeApi';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ActivityEditPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const activityId = query.get('activityId');
    const lessonId = query.get('lessonId');
    const isEditMode = !!activityId;

    const [activity, setActivity] = useState<Partial<Activity>>({
        title: '',
        sequenceOrder: 0,
        mainActivityId: 0,
        activityTypeId: 0,
        contentJson: '{}',
        lessonId: parseInt(lessonId || '0', 10)
    });
    const [mainActivities, setMainActivities] = useState<MainActivity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [jsonError, setJsonError] = useState<string>('');

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const mainActivitiesPromise = mainActivityApi.getAll();
                const activityTypesPromise = activityTypeApi.getAll();
                let activityPromise = Promise.resolve(null);

                if (isEditMode && activityId) {
                    activityPromise = activityApi.getActivityById(activityId);
                }

                const [mainActs, actTypes, actData] = await Promise.all([
                    mainActivitiesPromise, activityTypesPromise, activityPromise
                ]);

                setMainActivities(mainActs);
                setActivityTypes(actTypes);

                if (isEditMode && actData) {
                    // Pretty-print JSON for editing
                    try {
                       actData.contentJson = JSON.stringify(JSON.parse(actData.contentJson), null, 2);
                    } catch { /* ignore if not valid json */ }
                    setActivity(actData);
                }
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [activityId, isEditMode]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'contentJson') {
            try {
                JSON.parse(value);
                setJsonError('');
            } catch {
                setJsonError('Invalid JSON format');
            }
        }

        setActivity(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        setActivity(prev => ({ ...prev, [name]: Number(value) }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (jsonError) {
            alert("Please fix the JSON content before saving.");
            return;
        }

        const payload = {
            ...activity,
            sequenceOrder: Number(activity.sequenceOrder),
            mainActivityId: Number(activity.mainActivityId),
            activityTypeId: Number(activity.activityTypeId),
            lessonId: Number(activity.lessonId || lessonId)
        };

        try {
            if (isEditMode && activityId) {
                await activityApi.updateActivity(activityId, payload as activityApi.ActivityUpdateDto);
            } else {
                await activityApi.createActivity(payload as activityApi.ActivityCreateDto);
            }
            navigate(`/activities?lessonId=${payload.lessonId}`);
        } catch (error) {
            console.error("Failed to save activity", error);
            alert("An error occurred while saving.");
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Box p={3} component={Paper}>
            <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                <ArrowBackIcon />
                <Typography variant="button" sx={{ ml: 1 }}>Back</Typography>
            </IconButton>
            <Typography variant="h4" component="h1" mb={3}>
                {isEditMode ? `Edit Activity #${activityId}` : `Add New Activity for Lesson #${lessonId}`}
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <TextField fullWidth label="Activity Title" name="title" value={activity.title} onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth type="number" label="Sequence Order" name="sequenceOrder" value={activity.sequenceOrder} onChange={handleInputChange} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Main Activity Category</InputLabel>
                            <Select name="mainActivityId" value={activity.mainActivityId || ''} onChange={handleSelectChange} label="Main Activity Category">
                                {mainActivities.map(ma => <MenuItem key={ma.id} value={ma.id}>{ma.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                         <FormControl fullWidth>
                            <InputLabel>Activity Type</InputLabel>
                            <Select name="activityTypeId" value={activity.activityTypeId || ''} onChange={handleSelectChange} label="Activity Type">
                                {activityTypes.map(at => <MenuItem key={at.id} value={at.id}>{at.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={12}
                            label="Content JSON"
                            name="contentJson"
                            value={activity.contentJson}
                            onChange={handleInputChange}
                            required
                            error={!!jsonError}
                            helperText={jsonError}
                            variant="outlined"
                            sx={{ fontFamily: 'monospace' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">Save Activity</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default ActivityEditPage;