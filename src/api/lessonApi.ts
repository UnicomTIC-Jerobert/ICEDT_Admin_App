import { Lesson } from '../types/lesson'; // Create lesson.ts type file next

const API_BASE_URL = '/api';

export type LessonGetDto = Omit<Lesson, 'level'>; // DTO for getting lessons
export type LessonCreateDto = Omit<Lesson, 'lessonId' | 'level'>; // DTO for creating/updating

// GET lessons for a specific level
export const getLessonsByLevelId = async (levelId: number | string): Promise<Lesson[]> => {
    // This endpoint should return a direct array: [ { lessonId: 1, ... }, { lessonId: 2, ... } ]
    const response = await fetch(`/api/levels/${levelId}/lessons`);
    if (!response.ok) {
        throw new Error('Failed to fetch lessons');
    }
    return response.json();
};


// POST a new lesson
export const create = async (newItem: LessonCreateDto): Promise<Lesson> => {
    const response = await fetch(`${API_BASE_URL}/levels/${newItem.levelId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
    });
    if (!response.ok) {
        throw new Error('Failed to create lesson');
    }
    return response.json();
};

// PUT (update) an existing lesson
export const update = async (id: number | string, itemToUpdate: Partial<LessonCreateDto>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToUpdate)
    });
    if (!response.ok) {
        throw new Error('Failed to update lesson');
    }
};

// DELETE a lesson
export const deleteItem = async (id: number | string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete lesson');
    }
};

export const getLessonById = async (lessonId: number | string): Promise<Lesson> => {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch lesson details');
    }
    return response.json();
};
