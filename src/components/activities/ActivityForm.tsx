import React, { useState, useEffect } from 'react';
import {
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Typography,
    Box,
    Divider
} from '@mui/material';

import { Activity } from '../../types/activity';
import { MainActivity } from '../../types/mainActivity';
import { ActivityType } from '../../types/activityType';
import * as mainActivityApi from '../../api/mainActivityApi';
import * as activityTypeApi from '../../api/activityTypeApi';
import QuestionListEditor from './QuestionListEditor'; // This is the next component we'll build

interface ActivityFormProps {
    activityData: Partial<Activity>;
    onDataChange: (updatedData: Partial<Activity>) => void;
    onSave: () => void;
    onPreviewQuestion: (questionData: any) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
    activityData,
    onDataChange,
    onSave,
    onPreviewQuestion,
}) => {
    const [mainActivities, setMainActivities] = useState<MainActivity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

    // Fetch data for the dropdowns when the component mounts
    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const [mainActs, actTypes] = await Promise.all([
                    mainActivityApi.getAll(),
                    activityTypeApi.getAll(),
                ]);
                setMainActivities(mainActs);
                setActivityTypes(actTypes);
            } catch (error) {
                console.error("Failed to load dropdown data:", error);
                // Handle error state if necessary
            }
        };
        loadDropdownData();
    }, []);

    // Generic handler for simple text/number inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onDataChange({ ...activityData, [name]: value });
    };

    // Handler for MUI Select components
    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        onDataChange({ ...activityData, [name]: Number(value) });
    };

    // Handler specifically for changes coming from the QuestionListEditor
    const handleContentJsonChange = (newJson: string) => {
        onDataChange({ ...activityData, contentJson: newJson });
    };

    // Form submission handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                {/* --- Top-level Activity Fields --- */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                        fullWidth
                        label="Activity Title"
                        name="title"
                        value={activityData.title || ''}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Sequence Order"
                        name="sequenceOrder"
                        value={activityData.sequenceOrder || ''}
                        onChange={handleInputChange}
                        required
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth required>
                        <InputLabel id="main-activity-select-label">Main Activity Category</InputLabel>
                        <Select
                            labelId="main-activity-select-label"
                            name="mainActivityId"
                            value={activityData.mainActivityId || ''}
                            onChange={handleSelectChange}
                            label="Main Activity Category"
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {mainActivities.map((ma) => (
                                <MenuItem key={ma.id} value={ma.id}>{ma.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth required>
                        <InputLabel id="activity-type-select-label">Activity Type</InputLabel>
                        <Select
                            labelId="activity-type-select-label"
                            name="activityTypeId"
                            value={activityData.activityTypeId || ''}
                            onChange={handleSelectChange}
                            label="Activity Type"
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {activityTypes.map((at) => (
                                <MenuItem key={at.activityTypeId} value={at.activityTypeId}>{at.activityName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* --- Dynamic Question Editor Section --- */}
                <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 2 }}>
                        <Typography variant="overline">Content Editor</Typography>
                    </Divider>

                    {/* The QuestionListEditor will replace the raw textarea */}
                    <QuestionListEditor
                        activityTypeId={activityData.activityTypeId || 0}
                        contentJson={activityData.contentJson || '{}'}
                        onContentJsonChange={handleContentJsonChange}
                        onPreviewQuestion={onPreviewQuestion}
                    />
                </Grid>

                {/* --- Form Action Button --- */}
                <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" color="primary" size="large">
                        Save Activity
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ActivityForm;