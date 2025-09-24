// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import "./assets/Color/Color-Theme.css"
// import { ThemeProvider } from './Context/ThemeProvider';


// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <ThemeProvider>
//       <App />
//     </ThemeProvider>
//   </StrictMode>
// )



import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './assets/Color/Color-Theme.css';
import { ThemeProvider } from './Context/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // اضافه کردن react-query

// ساخت QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);