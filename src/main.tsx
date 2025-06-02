import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { PDFContextProvider } from './context/PDFContext';
import { ChatContextProvider } from './context/ChatContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PDFContextProvider>
        <ChatContextProvider>
          <App />
        </ChatContextProvider>
      </PDFContextProvider>
    </BrowserRouter>
  </StrictMode>
);