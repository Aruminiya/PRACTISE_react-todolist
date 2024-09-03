import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss'

import { ThemeProvider } from '@mui/system';
import muiCustomTheme from './muiCustomTheme.ts';

createRoot(document.getElementById('root')!).render( // `!` 符號被稱為「非空斷言運算符」（non-null assertion operator）。它告訴 TypeScript 編譯器，你確信這個值不會是 `null` 或 `undefined`
  <StrictMode>
    <ThemeProvider theme={muiCustomTheme}>
      <App />  
    </ThemeProvider>
  </StrictMode>,
)
