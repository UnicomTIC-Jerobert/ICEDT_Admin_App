import React, { useState, useEffect } from 'react';
import { 
    TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button, SelectChangeEvent, 
    Box, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Activity } from '../../types/activity';
import { MainActivity } from '../../types/mainActivity';
import { ActivityType } from '../../types/activityType';
import * as mainActivityApi from '../../api/mainActivityApi';
import * as activityTypeApi from '../../api/activityTypeApi';

interface ActivityFormProps {
    activityData: Partial<Activity>;
    onDataChange: (updatedData: Partial<Activity>) => void;
    onSave: () => void;
    onPreviewExercise: (exerciseJson: string) => void;
    expandedExercise: number | false;
    onExpansionChange: (panelIndex: number) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    onSetExpanded: (index: number) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
    activityData, onDataChange, onSave, onPreviewExercise,
    expandedExercise, onExpansionChange, onSetExpanded
}) => {
    const [mainActivities, setMainActivities] = useState<MainActivity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [exercises, setExercises] = useState<string[]>([]);
    const [jsonErrors, setJsonErrors] = useState<string[]>([]);

    useEffect(() => {
        try {
            const parsed = JSON.parse(activityData.contentJson || '[]');
            const exerciseArray = Array.isArray(parsed) ? parsed : [parsed];
            const stringifiedExercises = exerciseArray.map(ex => JSON.stringify(ex, null, 2));
            setExercises(stringifiedExercises);
            setJsonErrors(new Array(stringifiedExercises.length).fill(''));
        } catch {
            setExercises(['{}']);
            setJsonErrors(['']);
        }
    }, [activityData.contentJson]);

    useEffect(() => {
        const loadDropdowns = async () => {
            const [mainActs, actTypes] = await Promise.all([mainActivityApi.getAll(), activityTypeApi.getAll()]);
            setMainActivities(mainActs);
            setActivityTypes(actTypes);
        };
        loadDropdowns();
    }, []);

    const triggerParentUpdate = (updatedExercises: string[]) => {
        try {
            const combinedJsonString = `[${updatedExercises.join(',')}]`;
            JSON.parse(combinedJsonString);
            onDataChange({ ...activityData, contentJson: combinedJsonString });
        } catch (e) {
            onDataChange({ ...activityData, contentJson: `[${updatedExercises.join(',')}]` });
        }
    };
    
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>) => {
        onDataChange({ ...activityData, [e.target.name]: e.target.value });
    };

    const handleExerciseChange = (index: number, value: string) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = value;
        setExercises(updatedExercises);
        
        const updatedErrors = [...jsonErrors];
        try {
            JSON.parse(value);
            updatedErrors[index] = '';
        } catch {
            updatedErrors[index] = 'Invalid JSON';
        }
        setJsonErrors(updatedErrors);
        triggerParentUpdate(updatedExercises);
    };

    const addExercise = () => {
        const newExercises = [...exercises, '{}'];
        setExercises(newExercises);
        setJsonErrors([...jsonErrors, '']);
        triggerParentUpdate(newExercises);
        // Automatically expand the newly added exercise by calling the parent's handler
        onSetExpanded(newExercises.length - 1);
    };

    const removeExercise = (index: number) => {
        if (exercises.length <= 1) {
            alert("An activity must have at least one exercise.");
            return;
        }
        const newExercises = exercises.filter((_, i) => i !== index);
        const newErrors = jsonErrors.filter((_, i) => i !== index);
        setExercises(newExercises);
        setJsonErrors(newErrors);
        triggerParentUpdate(newExercises);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (jsonErrors.some(err => err)) {
            alert("Please fix the JSON errors before saving.");
            return;
        }
        onSave();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                {/* Standard form fields */}
                <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Activity Title" name="title" value={activityData.title || ''} onChange={handleFieldChange} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth type="number" label="Sequence Order" name="sequenceOrder" value={activityData.sequenceOrder || ''} onChange={handleFieldChange} required />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel>Main Activity Category</InputLabel>
                        <Select name="mainActivityId" value={activityData.mainActivityId || ''} onChange={handleFieldChange} label="Main Activity Category">
                            {mainActivities.map(ma => <MenuItem key={ma.id} value={ma.id}>{ma.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel>Activity Type</InputLabel>
                        <Select name="activityTypeId" value={activityData.activityTypeId || ''} onChange={handleFieldChange} label="Activity Type">
                            {activityTypes.map(at => <MenuItem key={at.activityTypeId} value={at.activityTypeId}>{at.activityName}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Accordion-based Exercise List */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Exercises</Typography>
                    {exercises.map((exerciseJson, index) => (
                        <Accordion key={index} expanded={expandedExercise === index} onChange={onExpansionChange(index)}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                    <Typography fontWeight="bold">Exercise #{index + 1}</Typography>
                                    <div>
                                        <Button
                                            variant="outlined" size="small" startIcon={<PreviewIcon />}
                                            onClick={(e) => { e.stopPropagation(); onPreviewExercise(exerciseJson); }}
                                            sx={{ mr: 1 }} disabled={!!jsonErrors[index]}
                                        >
                                            Preview
                                        </Button>
                                        <IconButton
                                            onClick={(e) => { e.stopPropagation(); removeExercise(index); }}
                                            color="error" disabled={exercises.length <= 1}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField
                                    fullWidth multiline rows={15}
                                    value={exerciseJson}
                                    onChange={(e) => handleExerciseChange(index, e.target.value)}
                                    required error={!!jsonErrors[index]}
                                    helperText={jsonErrors[index]}
                                    variant="outlined" sx={{ fontFamily: 'monospace' }}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Button fullWidth variant="outlined" onClick={addExercise} startIcon={<AddCircleOutlineIcon />}>
                        Add Another Exercise
                    </Button>
                </Grid>
                
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
                        Save Entire Activity
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ActivityForm;