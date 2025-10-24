import { createTheme } from '@mui/material/styles';

/**
 * Creates a theme instance for the entire application.
 * We're setting the 'mode' to 'light' to ensure
 * a consistent, light background regardless of the user's system settings.
 */
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default theme;