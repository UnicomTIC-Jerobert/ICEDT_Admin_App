import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails, TextField, Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Activity } from '../../types/activity';
import { getActivityTemplate } from './activityTemplates';

interface ExerciseEditorProps {
    activityData: Partial<Activity>;
    onDataChange: (updatedData: Partial<Activity>) => void;
    onPreviewExercise: (exerciseJson: string) => void;
    expandedExercise: number | false;
    onExpansionChange: (panelIndex: number) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    onSetExpanded: (index: number) => void;
}

const ExerciseEditor: React.FC<ExerciseEditorProps> = ({
    activityData, onDataChange, onPreviewExercise,
    expandedExercise, onExpansionChange, onSetExpanded
}) => {
    const [exercises, setExercises] = useState<string[]>(['{}']);
    const [jsonErrors, setJsonErrors] = useState<string[]>(['']);
    const [formatErrors, setFormatErrors] = useState<string[]>(['']);

    useEffect(() => {
        try {
            const parsed = JSON.parse(activityData.contentJson || '[]');
            const exerciseArray = Array.isArray(parsed) ? parsed : [parsed];
            const stringifiedExercises = exerciseArray.map(ex => JSON.stringify(ex, null, 2));
            setExercises(stringifiedExercises);
            setJsonErrors(new Array(stringifiedExercises.length).fill(''));
            setFormatErrors(new Array(stringifiedExercises.length).fill(''));
        } catch {
            setExercises(['{}']);
            setJsonErrors(['']);
            setFormatErrors(['']);
        }
    }, [activityData.contentJson]);

    const validateAgainstTemplate = useCallback((template: any, value: any, path: string): string[] => {
        if (template === null || template === undefined) return [];
        if (Array.isArray(template)) {
            if (!Array.isArray(value)) return [`${path} must be an array`];
            if (template.length === 0) return [];
            const itemTemplate = template[0];
            const errs: string[] = [];
            value.forEach((it: any, idx: number) => {
                errs.push(...validateAgainstTemplate(itemTemplate, it, `${path}[${idx}]`));
            });
            return errs;
        }

        const templateType = typeof template;
        if (templateType !== 'object') {
            if (typeof value !== templateType) return [`${path} must be a ${templateType}`];
            return [];
        }

        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            return [`${path} must be an object`];
        }

        const errs: string[] = [];
        for (const k of Object.keys(template)) {
            if (!(k in value)) {
                errs.push(`${path}.${k} is required`);
                continue;
            }
            errs.push(...validateAgainstTemplate((template as any)[k], (value as any)[k], `${path}.${k}`));
        }
        return errs;
    }, []);

    const getTemplateObject = useCallback(() => {
        try {
            const tplStr = getActivityTemplate(activityData.activityTypeId || 0);
            return JSON.parse(tplStr);
        } catch {
            return null;
        }
    }, [activityData.activityTypeId]);

    const triggerParentUpdateIfValid = useCallback((updatedExercises: string[]) => {
        try {
            const parsedObjects = updatedExercises.map(exStr => JSON.parse(exStr));
            const combinedJsonString = JSON.stringify(parsedObjects, null, 2);
            onDataChange({ ...activityData, contentJson: combinedJsonString });
        } catch {
            return;
        }
    }, [activityData, onDataChange]);

    const handleExerciseChange = (index: number, value: string) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = value;
        setExercises(updatedExercises);

        const updatedErrors = [...jsonErrors];
        const updatedFormatErrors = [...formatErrors];
        try {
            const parsed = JSON.parse(value);
            updatedErrors[index] = '';

            const tplObj = getTemplateObject();
            if (!tplObj) {
                updatedFormatErrors[index] = '';
            } else {
                const errs = validateAgainstTemplate(tplObj, parsed, '$');
                updatedFormatErrors[index] = errs.length ? errs.slice(0, 3).join(' | ') : '';
            }
        } catch {
            updatedErrors[index] = 'Invalid JSON';
            updatedFormatErrors[index] = '';
        }
        setJsonErrors(updatedErrors);
        setFormatErrors(updatedFormatErrors);

        const hasAnyJsonError = updatedErrors.some(Boolean);
        if (!hasAnyJsonError) {
            triggerParentUpdateIfValid(updatedExercises);
        }
    };

    const addExercise = () => {
        const newExercises = [...exercises, '{}'];
        setExercises(newExercises);
        setJsonErrors([...jsonErrors, '']);
        setFormatErrors([...formatErrors, '']);
        triggerParentUpdateIfValid(newExercises);
        onSetExpanded(newExercises.length - 1);
    };

    const removeExercise = (index: number) => {
        if (exercises.length <= 1) {
            alert("An activity must have at least one exercise.");
            return;
        }
        const newExercises = exercises.filter((_, i) => i !== index);
        const newErrors = jsonErrors.filter((_, i) => i !== index);
        const newFormatErrors = formatErrors.filter((_, i) => i !== index);
        setExercises(newExercises);
        setJsonErrors(newErrors);
        setFormatErrors(newFormatErrors);
        triggerParentUpdateIfValid(newExercises);
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Exercises</Typography>
            {exercises.map((exerciseJson, index) => (
                <Accordion key={index} expanded={expandedExercise === index} onChange={onExpansionChange(index)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} component="div">
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                            <Typography fontWeight="bold">Exercise #{index + 1}</Typography>
                            <Box>
                                <Button
                                    variant="outlined" size="small" startIcon={<PreviewIcon />}
                                    onClick={(e) => { e.stopPropagation(); onPreviewExercise(exerciseJson); }}
                                    sx={{ mr: 1 }} disabled={!!jsonErrors[index] || !!formatErrors[index]}
                                >
                                    Preview
                                </Button>
                                <IconButton
                                    onClick={(e) => { e.stopPropagation(); removeExercise(index); }}
                                    color="error" disabled={exercises.length <= 1}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                        <TextField
                            fullWidth multiline rows={15}
                            value={exerciseJson}
                            onChange={(e) => handleExerciseChange(index, e.target.value)}
                            required error={!!jsonErrors[index] || !!formatErrors[index]}
                            helperText={jsonErrors[index] || formatErrors[index]}
                            variant="outlined" sx={{ fontFamily: 'monospace' }}
                        />
                    </AccordionDetails>
                </Accordion>
            ))}
            <Button fullWidth variant="outlined" onClick={addExercise} startIcon={<AddCircleOutlineIcon />} sx={{ mt: 2 }}>
                Add Another Exercise
            </Button>
        </Paper>
    );
};

export default ExerciseEditor;