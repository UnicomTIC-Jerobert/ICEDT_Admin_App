import React, { useState, useEffect } from 'react';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import { Activity } from '../../types/activity';
import { MainActivity } from '../../types/mainActivity';
import { ActivityType } from '../../types/activityType';
import * as mainActivityApi from '../../api/mainActivityApi';
import * as activityTypeApi from '../../api/activityTypeApi';

interface ActivityFormProps {
    activityData: Partial<Activity>;
    onDataChange: (updatedData: Partial<Activity>) => void;
    onSave: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activityData, onDataChange, onSave }) => {
    const [mainActivities, setMainActivities] = useState<MainActivity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [jsonError, setJsonError] = useState<string>('');

    useEffect(() => {
        // Load dropdown data
        const loadDropdowns = async () => {
            const [mainActs, actTypes] = await Promise.all([
                mainActivityApi.getAll(),
                activityTypeApi.getAll()
            ]);
            setMainActivities(mainActs);
            setActivityTypes(actTypes);
        };
        loadDropdowns();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>) => {
        const { name, value } = e.target;

        if (name === 'contentJson') {
            try {
                JSON.parse(value as string);
                setJsonError('');
            } catch {
                setJsonError('Invalid JSON format');
            }
        }
        onDataChange({ ...activityData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (jsonError) {
            alert("Please fix the JSON content before saving.");
            return;
        }
        onSave();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 18 }}>
                    <TextField fullWidth label="Activity Title" name="title" value={activityData.title || ''} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth type="number" label="Sequence Order" name="sequenceOrder" value={activityData.sequenceOrder || ''} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel>Main Activity Category</InputLabel>
                        <Select name="mainActivityId" value={activityData.mainActivityId || ''} onChange={handleChange} label="Main Activity Category">
                            {mainActivities.map(ma => <MenuItem key={ma.id} value={ma.id}>{ma.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel>Activity Type</InputLabel>
                        <Select name="activityTypeId" value={activityData.activityTypeId || ''} onChange={handleChange} label="Activity Type">
                            {activityTypes.map(at => <MenuItem key={at.activityTypeId} value={at.activityTypeId}>{at.activityName}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={15}
                        label="Content JSON"
                        name="contentJson"
                        value={activityData.contentJson || ''}
                        onChange={handleChange}
                        required
                        error={!!jsonError}
                        helperText={jsonError}
                        variant="outlined"
                        sx={{ fontFamily: 'monospace', '& .MuiOutlinedInput-root': { height: '100%' } }}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" color="primary" size="large">Save Activity</Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ActivityForm;