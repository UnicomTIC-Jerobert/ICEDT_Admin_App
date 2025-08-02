import { Level } from '../types/level';

const API_BASE_URL = '/api/levels';

export type LevelCreateDto = Omit<Level, 'levelId'>;

// GET all levels
export const getAll = async (): Promise<Level[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch levels');
    return response.json();
};

// POST a new level
export const create = async (newItem: LevelCreateDto): Promise<Level> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
    });
    if (!response.ok) throw new Error('Failed to create level');
    return response.json();
};

// PUT (update) an existing level
export const update = async (id: number | string, itemToUpdate: Partial<LevelCreateDto>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToUpdate)
    });
    if (!response.ok) throw new Error('Failed to update level');
};

// DELETE a level
export const deleteItem = async (id: number | string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete level');
};