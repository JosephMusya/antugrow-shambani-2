import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import { UserProvider } from './providers/UserAuthProvider.tsx';
import { FarmProvider } from './providers/FarmProvider.tsx';
import { TooltipProvider } from '@radix-ui/react-tooltip';

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <TooltipProvider>
    <FarmProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FarmProvider>
    </TooltipProvider>
  </UserProvider>
);
