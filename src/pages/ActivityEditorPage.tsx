import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid, Button, Container, Paper, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, IconButton, LinearProgress, Breadcrumbs } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save'; // Import the Save icon
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { Activity } from '../types/activity';
import { MainActivity } from '../types/mainActivity';
import { ActivityType } from '../types/activityType';

import * as activityApi from '../api/activityApi';
import * as mainActivityApi from '../api/mainActivityApi';
import * as activityTypeApi from '../api/activityTypeApi';

import ActivityForm from '../components/activities/ActivityForm';
import DevicePreview from '../components/activities/DevicePreview';
import { getActivityTemplate } from '../components/activities/activityTemplates'; // Import the new helper
import ExerciseEditor from '../components/activities/ExerciseEditor';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const TOP_OFFSET = 88; // Adjusted for a standard AppBar

type MediaSearchResult = {
    name: string;
    url: string;
};

type UploadInitResponse = {
    uploadUrl: string;
    key: string;
};

const ActivityEditorPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const activityId = query.get('activityId');
    const lessonId = query.get('lessonId');
    const isEditMode = !!activityId;

    const [activity, setActivity] = useState<Partial<Activity> | null>(null);
    const [previewContent, setPreviewContent] = useState<Partial<Activity> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expandedExercise, setExpandedExercise] = useState<number | false>(0);
    const [copySnackbarOpen, setCopySnackbarOpen] = useState<boolean>(false);

    const [mediaSearchOpen, setMediaSearchOpen] = useState<boolean>(false);
    const [mediaSearchQuery, setMediaSearchQuery] = useState<string>('');
    const [mediaSearchResults, setMediaSearchResults] = useState<MediaSearchResult[]>([]);
    const [mediaSearchLoading, setMediaSearchLoading] = useState<boolean>(false);
    const [mediaSearchError, setMediaSearchError] = useState<string>('');
    const [selectedMedia, setSelectedMedia] = useState<MediaSearchResult | null>(null);
    const [mediaCopySnackbarText, setMediaCopySnackbarText] = useState<string>('');

    const [mediaUploadOpen, setMediaUploadOpen] = useState<boolean>(false);
    const [uploadFolder, setUploadFolder] = useState<string>('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadError, setUploadError] = useState<string>('');
    const [uploadSuccessKey, setUploadSuccessKey] = useState<string>('');

    const [availableFolders, setAvailableFolders] = useState<string[]>([]);
    const [foldersLoading, setFoldersLoading] = useState<boolean>(false);
    const [foldersError, setFoldersError] = useState<string>('');
    const [folderBrowserPrefix, setFolderBrowserPrefix] = useState<string>('');

    const [mainActivities, setMainActivities] = useState<MainActivity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

    const backUrl = `/activities?lessonId=${activity?.lessonId || lessonId}`;

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const mainActivitiesPromise = mainActivityApi.getAll();
            const activityTypesPromise = activityTypeApi.getAll();
            let activityPromise: Promise<Partial<Activity>>;

            if (isEditMode && activityId) {
                activityPromise = activityApi.getActivityById(activityId);
            } else {
                activityPromise = Promise.resolve({
                    title: '', sequenceOrder: 1, mainActivityId: 0,
                    activityTypeId: 0, contentJson: '[{}]',
                    lessonId: parseInt(lessonId || '0', 10)
                });
            }

            const [mainActs, actTypes, loadedActivity] = await Promise.all([mainActivitiesPromise, activityTypesPromise, activityPromise]);

            setMainActivities(mainActs);
            setActivityTypes(actTypes);

            let exercises: any[] = [];
            try {
                const parsedContent = JSON.parse(loadedActivity.contentJson || '[]');
                exercises = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
                if (exercises.length === 0) exercises.push({});
            } catch { exercises = [{}]; }

            loadedActivity.contentJson = JSON.stringify(exercises, null, 2);
            setActivity(loadedActivity);

            setPreviewContent({ ...loadedActivity, contentJson: JSON.stringify(exercises[0] || {}, null, 2) });
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

            if (isEditMode && activityId) {
                await activityApi.update(activityId, payload as any);
                await activityApi.update(activityId, payload as any);
            } else {
                await activityApi.create(payload as any);
                await activityApi.create(payload as any);
            }
            alert('Activity saved successfully!');
            navigate(backUrl);

        } catch (error) {
            console.error("Failed to save activity", error);
            alert("An error occurred while saving.");
        }
    };

    const handleExpansionChange = (panelIndex: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedExercise(isExpanded ? panelIndex : false);
    };
    const handleSetExpanded = (index: number) => {
        setExpandedExercise(index);
    };

    const handleCopyTemplate = async () => {
        try {
            const templateJson = getActivityTemplate(activity?.activityTypeId || 0);
            await navigator.clipboard.writeText(templateJson);
            setCopySnackbarOpen(true);
        } catch (error) {
            console.error('Failed to copy template:', error);
            // Fallback for browsers that don't support clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = getActivityTemplate(activity?.activityTypeId || 0);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySnackbarOpen(true);
        }
    };

    const handleCloseCopySnackbar = () => {
        setCopySnackbarOpen(false);
    };

    const handleOpenMediaSearch = () => {
        setMediaSearchOpen(true);
        setMediaSearchError('');
    };

    const handleCloseMediaSearch = () => {
        setMediaSearchOpen(false);
        setMediaSearchQuery('');
        setMediaSearchResults([]);
        setSelectedMedia(null);
        setMediaSearchError('');
        setMediaSearchLoading(false);
    };

    const handleOpenMediaUpload = () => {
        setMediaUploadOpen(true);
        setUploadError('');
        setUploadProgress(0);
        setUploadSuccessKey('');
        setFoldersError('');
        setFolderBrowserPrefix('');
    };

    const handleCloseMediaUpload = () => {
        setMediaUploadOpen(false);
        setUploadFolder('');
        setUploadFile(null);
        setUploadLoading(false);
        setUploadProgress(0);
        setUploadError('');
        setUploadSuccessKey('');
        setFoldersLoading(false);
        setFoldersError('');
        setFolderBrowserPrefix('');
    };

    const mediaSearchBaseUrl = (process.env.REACT_APP_AWS_S3_SEARCH_URL || 'https://3673ppiw1l.execute-api.us-east-1.amazonaws.com').replace(/\/$/, '');
    const mediaUploadBaseUrl = (process.env.REACT_APP_AWS_S3_UPLOAD_URL || mediaSearchBaseUrl || 'https://3673ppiw1l.execute-api.us-east-1.amazonaws.com').replace(/\/$/, '');
    const mediaPublicBaseUrl = (process.env.REACT_APP_MEDIA_URL || '').replace(/\/$/, '');

    const getPublicMediaUrl = useCallback((name: string) => {
        if (!mediaPublicBaseUrl) return '';
        const trimmed = (name || '').replace(/^\//, '');
        return `${mediaPublicBaseUrl}/${trimmed}`;
    }, [mediaPublicBaseUrl]);

    const fetchFolders = useCallback(async (prefix: string) => {
        setFoldersLoading(true);
        setFoldersError('');
        try {
            const normalizedPrefix = (prefix || '').replace(/^\//, '').replace(/\/*$/, '');
            const prefixParam = normalizedPrefix ? `${normalizedPrefix}/` : '';
            const url = prefixParam
                ? `${mediaSearchBaseUrl}/folders?prefix=${encodeURIComponent(prefixParam)}`
                : `${mediaSearchBaseUrl}/folders`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to load folders (${res.status})`);
            const data = await res.json();
            const rawList: string[] = Array.isArray(data) ? data : (Array.isArray(data?.prefixes) ? data.prefixes : []);
            const normalized = rawList
                .map(p => (p || '').replace(/^\//, '').replace(/\/+$/, ''))
                .filter(Boolean);
            setAvailableFolders(Array.from(new Set(normalized)).sort());
        } catch (e: any) {
            setFoldersError(e?.message || 'Failed to load folders');
            setAvailableFolders([]);
        } finally {
            setFoldersLoading(false);
        }
    }, [mediaSearchBaseUrl]);

    useEffect(() => {
        if (!mediaUploadOpen) return;
        void fetchFolders(folderBrowserPrefix);
    }, [mediaUploadOpen, folderBrowserPrefix, fetchFolders]);

    const doMediaSearch = useCallback(async (q: string) => {
        const trimmed = q.trim();
        if (!trimmed) {
            setMediaSearchResults([]);
            setSelectedMedia(null);
            setMediaSearchError('');
            return;
        }
        setMediaSearchLoading(true);
        setMediaSearchError('');
        try {
            const url = `${mediaSearchBaseUrl}/search?q=${encodeURIComponent(trimmed)}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Search failed (${res.status})`);
            }
            const data = await res.json();
            const results: MediaSearchResult[] = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
            setMediaSearchResults(results);
            if (results.length > 0) setSelectedMedia(results[0]);
        } catch (e: any) {
            setMediaSearchError(e?.message || 'Search failed');
            setMediaSearchResults([]);
            setSelectedMedia(null);
        } finally {
            setMediaSearchLoading(false);
        }
    }, [mediaSearchBaseUrl]);

    useEffect(() => {
        if (!mediaSearchOpen) return;
        const t = window.setTimeout(() => {
            void doMediaSearch(mediaSearchQuery);
        }, 350);
        return () => window.clearTimeout(t);
    }, [mediaSearchOpen, mediaSearchQuery, doMediaSearch]);

    const getMediaKind = (nameOrUrl: string): 'image' | 'audio' | 'unknown' => {
        const v = (nameOrUrl || '').toLowerCase();
        if (v.match(/\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/)) return 'image';
        if (v.match(/\.(mp3|wav|ogg|m4a)(\?.*)?$/)) return 'audio';
        return 'unknown';
    };

    const copyToClipboard = async (text: string, snackbarText: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setMediaCopySnackbarText(snackbarText);
            setCopySnackbarOpen(true);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setMediaCopySnackbarText(snackbarText);
            setCopySnackbarOpen(true);
        }
    };
    const uploadFileToPresignedUrl = useCallback(
        async (presignedUrl: string, file: File, contentType: string): Promise<void> => {
            setUploadProgress(0);

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', presignedUrl);
                xhr.setRequestHeader('Content-Type', contentType);

                xhr.upload.onprogress = (evt) => {
                    if (!evt.lengthComputable) return;
                    const pct = Math.round((evt.loaded / evt.total) * 100);
                    setUploadProgress(pct);
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) resolve();
                    else reject(new Error(`S3 upload failed (${xhr.status}): ${xhr.responseText || ''}`));
                };
                xhr.onerror = () => reject(new Error('S3 upload failed'));
                xhr.send(file);
            });
        },
        []
    );

    const handleUpload = useCallback(async () => {
        setUploadError('');
        setUploadSuccessKey('');

        if (!uploadFile) {
            setUploadError('Please select a file.');
            return;
        }
        if (!uploadFolder.trim()) {
            setUploadError('Please enter/select a folder.');
            return;
        }

        const folderNormalized = uploadFolder.trim().replace(/^\/+/, '').replace(/\/+$/, '');
        const fileNameWithFolder = `${folderNormalized}/${uploadFile.name}`;
        const effectiveContentType = uploadFile.type || 'application/octet-stream';

        setUploadLoading(true);
        setUploadProgress(0);

        try {
            const initRes = await fetch(`${mediaUploadBaseUrl}/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: fileNameWithFolder,
                    fileType: effectiveContentType,
                }),
            });

            if (!initRes.ok) {
                const txt = await initRes.text();
                throw new Error(`Upload init failed (${initRes.status}): ${txt}`);
            }

            const initData: UploadInitResponse = await initRes.json();
            if (!initData?.uploadUrl || !initData?.key) {
                throw new Error('Upload init failed: missing uploadUrl/key');
            }

            await uploadFileToPresignedUrl(initData.uploadUrl, uploadFile, effectiveContentType);

            setUploadSuccessKey(initData.key);
            setUploadProgress(100);
            setMediaCopySnackbarText('Upload successful!');
            setCopySnackbarOpen(true);
        } catch (e: any) {
            setUploadError(e?.message || 'Upload failed');
        } finally {
            setUploadLoading(false);
        }
    }, [mediaUploadBaseUrl, uploadFile, uploadFolder, uploadFileToPresignedUrl]);

    if (isLoading || !activity) {
        return <CircularProgress />;
    }

    return (
        // Use a wider container for the 3-column layout
        <Container maxWidth={false} sx={{ mt: 3, px: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">
                    {isEditMode ? `Edit Activity #${activityId}` : `Add New Activity`}
                </Typography>

                <Box>
                    <Button
                        onClick={() => navigate(backUrl)}
                        startIcon={<ArrowBackIcon />}
                        sx={{ mr: 2 }}
                    >
                        Back to List
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<SearchIcon />}
                        onClick={handleOpenMediaSearch}
                        sx={{ mr: 2 }}
                    >
                        Search Media
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                        onClick={handleOpenMediaUpload}
                        sx={{ mr: 2 }}
                    >
                        Upload Media
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                    >
                        Save Entire Activity
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* --- COLUMN 1: Metadata Form & Template Viewer --- */}
                <Grid size={{ xs: 12, lg: 3 }}>
                    <Paper sx={{ p: 2, position: 'sticky', top: '24px' }}>
                        {/* The form no longer needs the onSave prop */}
                        <ActivityForm
                            activityData={activity}
                            mainActivities={mainActivities}
                            activityTypes={activityTypes}
                            onDataChange={handleFormChange}
                        />
                        {/* JSON Template Viewer */}

                    </Paper>
                </Grid>

                {/* --- COLUMN 2: Exercises Accordion Editor --- */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    {/* This component will be created next */}

                    <Box mt={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6">JSON Template</Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ContentCopyIcon />}
                                onClick={handleCopyTemplate}
                                disabled={!activity?.activityTypeId}
                            >
                                Copy Template
                            </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            This is the required structure for the selected Activity Type.
                        </Typography>
                        <Paper variant="outlined" sx={{ mt: 1, p: 2, maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                <code>
                                    {getActivityTemplate(activity.activityTypeId || 0)}
                                </code>
                            </pre>
                        </Paper>
                    </Box>

                    <ExerciseEditor
                        activityData={activity}
                        onDataChange={handleFormChange}
                        onPreviewExercise={handlePreviewExercise}
                        expandedExercise={expandedExercise}
                        onExpansionChange={handleExpansionChange}
                        onSetExpanded={handleSetExpanded}
                    />


                </Grid>

                {/* --- COLUMN 3: The STICKY Device Preview --- */}
                <Grid size={{ xs: 12, lg: 4 }} sx={{
                    position: 'sticky',
                    top: `24px`,
                    height: `calc(100vh - ${TOP_OFFSET}px)`,
                }}>
                    {previewContent && <DevicePreview activityData={previewContent} />}
                </Grid>
            </Grid>

            {/* Snackbar for copy confirmation */}
            <Snackbar
                open={copySnackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseCopySnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseCopySnackbar} severity="success" sx={{ width: '100%' }}>
                    {mediaCopySnackbarText || 'Template JSON copied to clipboard!'}
                </Alert>
            </Snackbar>

            <Dialog open={mediaSearchOpen} onClose={handleCloseMediaSearch} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Search Media</span>
                    <IconButton onClick={handleCloseMediaSearch} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Search by name"
                        value={mediaSearchQuery}
                        onChange={(e) => setMediaSearchQuery(e.target.value)}
                        placeholder="e.g. aaduthal"
                        autoFocus
                    />

                    <Box mt={2} display="flex" gap={2}>
                        <Box flex={1} minWidth={0}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Results
                            </Typography>
                            {mediaSearchLoading && <Typography variant="body2">Loading...</Typography>}
                            {!!mediaSearchError && <Typography variant="body2" color="error">{mediaSearchError}</Typography>}
                            {!mediaSearchLoading && !mediaSearchError && mediaSearchResults.length === 0 && mediaSearchQuery.trim() && (
                                <Typography variant="body2">No results</Typography>
                            )}
                            <Paper variant="outlined" sx={{ maxHeight: 360, overflowY: 'auto' }}>
                                <List dense>
                                    {mediaSearchResults.map((r) => (
                                        <ListItem
                                            key={`${r.name}-${r.url}`}
                                            onClick={() => setSelectedMedia(r)}
                                            sx={{ cursor: 'pointer', alignItems: 'flex-start' }}
                                            divider
                                        >
                                            <Box width="100%">
                                                <ListItemText
                                                    primary={r.name}
                                                    secondary={getMediaKind(r.name) !== 'unknown' ? getMediaKind(r.name) : ''}
                                                    primaryTypographyProps={{
                                                        sx: {
                                                            wordBreak: 'break-word',
                                                            lineHeight: 1.2,
                                                        }
                                                    }}
                                                    secondaryTypographyProps={{ sx: { lineHeight: 1.1 } }}
                                                    sx={{ m: 0 }}
                                                />
                                                <Box
                                                    mt={1}
                                                    display="flex"
                                                    gap={1}
                                                    flexWrap="wrap"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ whiteSpace: 'nowrap' }}
                                                        onClick={() => {
                                                            const normalizedPath = `/${(r.name || '').replace(/^\//, '')}`;
                                                            void copyToClipboard(normalizedPath, 'Media path copied!');
                                                        }}
                                                    >
                                                        Copy Path
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ whiteSpace: 'nowrap' }}
                                                        disabled={!mediaPublicBaseUrl}
                                                        onClick={() => {
                                                            const publicUrl = getPublicMediaUrl(r.name);
                                                            void copyToClipboard(publicUrl, 'Public media URL copied!');
                                                        }}
                                                    >
                                                        Copy Public URL
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ whiteSpace: 'nowrap' }}
                                                        onClick={() => { void copyToClipboard(r.url, 'Signed URL copied!'); }}
                                                    >
                                                        Copy Signed URL
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Box>

                        <Box flex={1} minWidth={0}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Preview
                            </Typography>
                            {!selectedMedia && <Typography variant="body2">Select a result to preview</Typography>}
                            {selectedMedia && (
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                        {selectedMedia.name}
                                    </Typography>
                                    {!!getPublicMediaUrl(selectedMedia.name) && (
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-all', mt: 0.5 }}>
                                            {getPublicMediaUrl(selectedMedia.name)}
                                        </Typography>
                                    )}

                                    <Box mt={2}>
                                        {getMediaKind(getPublicMediaUrl(selectedMedia.name) || selectedMedia.url) === 'image' && (
                                            <img
                                                src={getPublicMediaUrl(selectedMedia.name) || selectedMedia.url}
                                                alt={selectedMedia.name}
                                                style={{ maxWidth: '100%', maxHeight: 260, display: 'block', margin: '0 auto' }}
                                            />
                                        )}
                                        {getMediaKind(getPublicMediaUrl(selectedMedia.name) || selectedMedia.url) === 'audio' && (
                                            <audio controls src={getPublicMediaUrl(selectedMedia.name) || selectedMedia.url} style={{ width: '100%' }} />
                                        )}
                                        {getMediaKind(getPublicMediaUrl(selectedMedia.name) || selectedMedia.url) === 'unknown' && (
                                            <Typography variant="body2" color="text.secondary">
                                                No preview available for this file type.
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMediaSearch}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={mediaUploadOpen} onClose={handleCloseMediaUpload} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Upload Media</span>
                    <IconButton onClick={handleCloseMediaUpload} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Select folder
                    </Typography>

                    <Breadcrumbs sx={{ mb: 1 }}>
                        <Button
                            size="small"
                            variant={folderBrowserPrefix ? 'text' : 'outlined'}
                            onClick={() => setFolderBrowserPrefix('')}
                            disabled={uploadLoading}
                        >
                            Root
                        </Button>
                        {(folderBrowserPrefix || '').split('/').filter(Boolean).map((seg, idx, arr) => {
                            const nextPrefix = arr.slice(0, idx + 1).join('/');
                            const isLast = idx === arr.length - 1;
                            return (
                                <Button
                                    key={`${seg}-${idx}`}
                                    size="small"
                                    variant={isLast ? 'outlined' : 'text'}
                                    onClick={() => setFolderBrowserPrefix(nextPrefix)}
                                    disabled={uploadLoading}
                                >
                                    {seg}
                                </Button>
                            );
                        })}
                    </Breadcrumbs>

                    <Paper variant="outlined" sx={{ maxHeight: 220, overflowY: 'auto', mb: 1 }}>
                        <List dense>
                            {foldersLoading && (
                                <ListItem>
                                    <ListItemText primary="Loading folders..." />
                                </ListItem>
                            )}
                            {!!foldersError && !foldersLoading && (
                                <ListItem>
                                    <ListItemText primary={foldersError} primaryTypographyProps={{ color: 'error' }} />
                                </ListItem>
                            )}
                            {!foldersLoading && !foldersError && availableFolders.length === 0 && (
                                <ListItem>
                                    <ListItemText primary="No subfolders" />
                                </ListItem>
                            )}

                            {!foldersLoading && !foldersError && availableFolders.map((fullPrefix) => {
                                const current = (folderBrowserPrefix || '').replace(/\/+$/, '');
                                const child = current
                                    ? fullPrefix.replace(new RegExp(`^${current.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?`), '')
                                    : fullPrefix;
                                const childName = child.split('/').filter(Boolean)[0] || fullPrefix;
                                const nextPrefix = current ? `${current}/${childName}` : childName;

                                return (
                                    <ListItem
                                        key={fullPrefix}
                                        onClick={() => setFolderBrowserPrefix(nextPrefix)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <ListItemText primary={childName} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>

                    <Box display="flex" gap={1} flexWrap="wrap" alignItems="center" sx={{ mb: 1 }}>
                        <Button
                            size="small"
                            variant="outlined"
                            disabled={uploadLoading || !folderBrowserPrefix}
                            onClick={() => {
                                setUploadFolder(folderBrowserPrefix);
                                setUploadError('');
                                setUploadSuccessKey('');
                            }}
                        >
                            Use this folder
                        </Button>
                        <Button
                            size="small"
                            variant="text"
                            disabled={uploadLoading}
                            onClick={() => void fetchFolders(folderBrowserPrefix)}
                        >
                            Refresh
                        </Button>
                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                            Selected: {uploadFolder ? uploadFolder : '(none)'}
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth
                        label="Folder (manual)"
                        value={uploadFolder}
                        onChange={(e) => {
                            setUploadFolder(e.target.value);
                            setUploadSuccessKey('');
                        }}
                        placeholder="e.g. aandu_01/naan/lesson01/image"
                        helperText={'The uploaded file will be stored as: <folder>/<fileName>'}
                        disabled={uploadLoading}
                    />

                    <Box mt={2}>
                        <Button variant="outlined" component="label" disabled={uploadLoading}>
                            Choose File
                            <input
                                type="file"
                                hidden
                                onChange={(e) => {
                                    const f = e.target.files?.[0] || null;
                                    setUploadFile(f);
                                    setUploadError('');
                                    setUploadSuccessKey('');
                                    setUploadProgress(0);
                                }}
                            />
                        </Button>
                        <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-all' }}>
                            {uploadFile ? `${uploadFile.name} (${uploadFile.type || 'unknown type'})` : 'No file selected'}
                        </Typography>
                    </Box>

                    {uploadLoading && (
                        <Box mt={2}>
                            <Typography variant="body2">Uploading... {uploadProgress}%</Typography>
                            <LinearProgress variant="determinate" value={uploadProgress} />
                        </Box>
                    )}

                    {!!uploadError && (
                        <Box mt={2}>
                            <Alert severity="error">{uploadError}</Alert>
                        </Box>
                    )}

                    {!!uploadSuccessKey && (
                        <Box mt={2}>
                            <Alert severity="success">Upload completed</Alert>
                            <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-all' }}>
                                /{uploadSuccessKey.replace(/^\//, '')}
                            </Typography>

                            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                        const normalizedPath = `/${uploadSuccessKey.replace(/^\//, '')}`;
                                        void copyToClipboard(normalizedPath, 'Media path copied!');
                                    }}
                                >
                                    Copy Path
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    disabled={!mediaPublicBaseUrl}
                                    onClick={() => {
                                        const publicUrl = getPublicMediaUrl(uploadSuccessKey);
                                        void copyToClipboard(publicUrl, 'Public media URL copied!');
                                    }}
                                >
                                    Copy Public URL
                                </Button>
                            </Box>

                            <Box mt={2}>
                                {getMediaKind(getPublicMediaUrl(uploadSuccessKey) || uploadSuccessKey) === 'image' && (
                                    <img
                                        src={getPublicMediaUrl(uploadSuccessKey) || ''}
                                        alt={uploadSuccessKey}
                                        style={{ maxWidth: '100%', maxHeight: 260, display: 'block', margin: '0 auto' }}
                                    />
                                )}
                                {getMediaKind(getPublicMediaUrl(uploadSuccessKey) || uploadSuccessKey) === 'audio' && (
                                    <audio controls src={getPublicMediaUrl(uploadSuccessKey) || ''} style={{ width: '100%' }} />
                                )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMediaUpload} disabled={uploadLoading}>Close</Button>
                    <Button
                        variant="contained"
                        onClick={() => { void handleUpload(); }}
                        disabled={uploadLoading || !!uploadSuccessKey}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ActivityEditorPage;