import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';

// Import your page components
import LevelsPage from './pages/LevelsPage';
import MainActivityPage from './pages/MainActivityPage';
import ActivityTypesPage from './pages/ActivityTypesPage';
import LessonsPage from './pages/LessonsPage';
import ActivitiesListPage from './pages/ActivitiesListPage';
import ActivityEditorPage from './pages/ActivityEditorPage';

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
            <Router>
                {/* Simple Navigation Header */}
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Tamil App Admin
                        </Typography>
                        <Button component={RouterLink} to="/levels" color="inherit">Levels</Button>
                        <Button component={RouterLink} to="/main-activities" color="inherit">Main Activities</Button>
                        <Button component={RouterLink} to="/activity-types" color="inherit">Activity Types</Button> {/* <-- ADD NEW LINK */}
                    </Toolbar>
                </AppBar>

                {/* Main Content Area */}
                 <Container component="main" maxWidth={false} sx={{ mt: 4, px: 2 }}>
                    <Routes>
                        {/* Define the route for each page */}
                        <Route path="/" element={<Typography variant="h5">Welcome to the Admin Panel!</Typography>} />
                        <Route path="/levels" element={<LevelsPage />} />
                        <Route path="/lessons" element={<LessonsPage />} />
                        <Route path="/main-activities" element={<MainActivityPage />} />
                        <Route path="/activity-types" element={<ActivityTypesPage />} />
                        <Route path="/activities" element={<ActivitiesListPage />} />
                        <Route path="/activity-edit" element={<ActivityEditorPage />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;