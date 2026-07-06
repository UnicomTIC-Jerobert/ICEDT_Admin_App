import React from 'react';
import { Button, Box } from '@mui/material';
import * as mediaApi from '../../api/mediaApi';

interface ImageUploadCellProps {
    value: string | null;
    onUrlChange: (newUrl: string) => void;
}

const MEDIA_BASE_URL = (process.env.REACT_APP_MEDIA_URL || '').replace(/\/+$/, '');

const ImageUploadCell: React.FC<ImageUploadCellProps> = ({ value, onUrlChange }) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const response = await mediaApi.uploadSingleFile(file, 'levels');

            let relativePath = response.url;
            if (MEDIA_BASE_URL && relativePath.startsWith(MEDIA_BASE_URL)) {
                relativePath = relativePath.slice(MEDIA_BASE_URL.length);
                if (!relativePath.startsWith('/')) relativePath = '/' + relativePath;
            }

            onUrlChange(relativePath);

        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed.");
        }
    };

    return (
        <Box>
            {value && <img src={value} alt="preview" width="50" style={{ marginRight: '10px' }} />}
            <Button variant="outlined" component="label" size="small">
                Upload
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
        </Box>
    );
};

export default ImageUploadCell;