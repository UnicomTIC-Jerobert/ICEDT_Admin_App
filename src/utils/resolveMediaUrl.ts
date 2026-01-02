export function resolveMediaUrl(input?: string, baseUrl?: string): string {
    const value = (input || '').trim();
    if (!value) return '';

    if (/^(https?:)?\/\//i.test(value) || /^data:/i.test(value) || /^blob:/i.test(value)) {
        return value;
    }

    const rawBase = (baseUrl ?? process.env.REACT_APP_MEDIA_URL ?? '').trim();
    if (!rawBase) return value;

    const normalizedBase = rawBase.replace(/\/+$/, '');
    const normalizedPath = value.replace(/^\/+/, '');

    return `${normalizedBase}/${normalizedPath}`;
}
