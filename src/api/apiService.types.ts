export interface CrudApiService<T, TCreateDto> {
    getAll: () => Promise<T[]>;
    create: (newItem: TCreateDto) => Promise<T>;
    update: (id: number | string, itemToUpdate: Partial<TCreateDto>) => Promise<void>;
    delete: (id: number | string) => Promise<void>;
}