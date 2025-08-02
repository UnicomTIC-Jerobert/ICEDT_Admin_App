import { Activity } from '../types/activity';

const API_BASE_URL = '/api';

export type ActivityCreateDto = Omit<Activity, 'activityId' | 'activityType' | 'mainActivity'>;
export type ActivityUpdateDto = Omit<Activity, 'activityId' | 'activityType' | 'mainActivity'>;

// GET activities for a specific lesson
export const getActivitiesByLessonId = async (lessonId: number | string): Promise<Activity[]> => {
    // NOTE: This assumes your backend API can populate the ActivityType and MainActivity names.
    // If not, we would need to fetch them separately and map them on the client.
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/activities`);
    if (!response.ok) throw new Error('Failed to fetch activities');
    return response.json();
};

// GET a single activity by its ID
export const getActivityById = async (activityId: number | string): Promise<Activity> => {
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}`);
    if (!response.ok) throw new Error('Failed to fetch activity');
    return response.json();
};

// POST a new activity
export const createActivity = async (newItem: ActivityCreateDto): Promise<Activity> => {
    const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
    });
    if (!response.ok) throw new Error('Failed to create activity');
    return response.json();
};

// PUT (update) an existing activity
export const updateActivity = async (id: number | string, itemToUpdate: ActivityUpdateDto): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToUpdate)
    });
    if (!response.ok) throw new Error('Failed to update activity');
};

// DELETE an activity
export const deleteActivity = async (id: number | string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete activity');
};