import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './assets/color/color-Theme.css';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // اضافه کردن react-query
import { GoogleOAuthProvider } from '@react-oauth/google';

// ساخت QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);