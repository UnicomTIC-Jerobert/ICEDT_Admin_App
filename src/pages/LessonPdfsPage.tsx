import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, CircularProgress, TextField, Chip,
    Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { LessonPdf } from '../types/lessonPdf';
import { Lesson } from '../types/lesson';
import * as lessonPdfApi from '../api/lessonPdfApi';
import * as lessonApi from '../api/lessonApi';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const LessonPdfsPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const lessonId = query.get('lessonId');

    const [pdfs, setPdfs] = useState<LessonPdf[]>([]);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Upload state
    const [isUploading, setIsUploading] = useState(false);
    const [uploadTitle, setUploadTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!lessonId) {
            setError('No Lesson ID provided.');
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [lessonData, pdfsData] = await Promise.all([
                    lessonApi.getLessonById(lessonId),
                    lessonPdfApi.getPdfsByLessonId(lessonId),
                ]);
                setLesson(lessonData);
                setPdfs(pdfsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [lessonId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setSelectedFile(file);
        setUploadError(null);
    };

    const handleUpload = async () => {
        if (!lessonId || !selectedFile || !uploadTitle.trim()) {
            setUploadError('Please provide a title and select a PDF file.');
            return;
        }
        if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
            setUploadError('Only PDF files are allowed.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        try {
            const newPdf = await lessonPdfApi.uploadPdf(lessonId, uploadTitle.trim(), selectedFile);
            setPdfs(prev => [...prev, newPdf]);
            setUploadTitle('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (lessonPdfId: number) => {
        if (!lessonId) return;
        if (!window.confirm('Are you sure you want to delete this PDF? This cannot be undone.')) return;
        try {
            await lessonPdfApi.deletePdf(lessonId, lessonPdfId);
            setPdfs(prev => prev.filter(p => p.lessonPdfId !== lessonPdfId));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete PDF.');
        }
    };

    const backUrl = lesson ? `/lessons?levelId=${lesson.levelId}` : '/levels';

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
                <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} onClick={() => navigate('/levels')}>
                    Back to Levels
                </Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <IconButton onClick={() => navigate(backUrl)} sx={{ mb: 2 }} disabled={isLoading}>
                <ArrowBackIcon />
                <Typography variant="button" sx={{ ml: 1 }}>Back to Lessons</Typography>
            </IconButton>

            <Typography variant="h4" component="h1" mb={3}>
                {isLoading ? 'Loading...' : `PDFs for: "${lesson?.lessonName}"`}
            </Typography>

            {/* Upload Panel */}
            <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" mb={2}>Upload New PDF</Typography>
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <TextField
                        label="PDF Title"
                        value={uploadTitle}
                        onChange={e => setUploadTitle(e.target.value)}
                        size="small"
                        sx={{ minWidth: 260 }}
                        disabled={isUploading}
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PictureAsPdfIcon />}
                        disabled={isUploading}
                    >
                        {selectedFile ? selectedFile.name : 'Choose PDF'}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={isUploading ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
                        onClick={handleUpload}
                        disabled={isUploading || !selectedFile || !uploadTitle.trim()}
                    >
                        {isUploading ? 'Uploading…' : 'Upload'}
                    </Button>
                </Box>
                {uploadError && (
                    <Typography color="error" variant="body2" mt={1}>{uploadError}</Typography>
                )}
            </Paper>

            {/* PDF List */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Uploaded</TableCell>
                            <TableCell>File</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : pdfs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No PDFs uploaded for this lesson yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pdfs.map(pdf => (
                                <TableRow key={pdf.lessonPdfId}>
                                    <TableCell>{pdf.lessonPdfId}</TableCell>
                                    <TableCell>{pdf.title}</TableCell>
                                    <TableCell>
                                        {new Date(pdf.uploadedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={<PictureAsPdfIcon />}
                                            label="View / Download"
                                            component={Link}
                                            href={pdf.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            clickable
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleDelete(pdf.lessonPdfId)}
                                            color="error"
                                            title="Delete PDF"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default LessonPdfsPage;
