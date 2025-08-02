import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LevelsPage from './pages/LevelsPage';

// You can define a theme for your admin panel
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Later, you will add routing here to switch between pages */}
            <main>
                <LevelsPage />
            </main>
        </ThemeProvider>
    );
}

export default App;