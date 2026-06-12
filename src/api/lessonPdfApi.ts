import axiosClient from './axiosClient';
import { apiClient } from './apiClient';
import { LessonPdf } from '../types/lessonPdf';

/**
 * GET all PDFs for a lesson.
 */
export const getPdfsByLessonId = (lessonId: number | string): Promise<LessonPdf[]> => {
    return apiClient.get<LessonPdf[]>(`/lessons/${lessonId}/pdfs`);
};

/**
 * POST — upload a PDF with a title for a lesson.
 * Uses axiosClient directly because the body is multipart/form-data.
 */
export const uploadPdf = async (lessonId: number | string, title: string, file: File): Promise<LessonPdf> => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    const response = await axiosClient.post(`/lessons/${lessonId}/pdfs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Backend wraps the response — unwrap result
    return response.data?.result ?? response.data;
};

/**
 * DELETE a PDF by its ID.
 */
export const deletePdf = (lessonId: number | string, lessonPdfId: number): Promise<void> => {
    return apiClient.delete(`/lessons/${lessonId}/pdfs/${lessonPdfId}`);
};
