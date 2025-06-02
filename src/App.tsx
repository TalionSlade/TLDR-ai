import React from 'react';
import Layout from './components/Layout';
import { ChatProvider } from './context/ChatContext';
import { PDFProvider } from './context/PDFContext';

function App() {
  return (
    <PDFProvider>
      <ChatProvider>
        <Layout />
      </ChatProvider>
    </PDFProvider>
  );
}

export default App;