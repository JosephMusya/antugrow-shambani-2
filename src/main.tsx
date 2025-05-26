import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './utils/wallets/config.ts'

import { UserProvider } from './providers/UserAuthProvider.tsx';
import { FarmProvider } from './providers/FarmProvider.tsx';
import { TooltipProvider } from '@radix-ui/react-tooltip';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <RainbowKitProvider theme={darkTheme({
                    accentColor: "#0E76FD",
                    accentColorForeground: "white",
                    borderRadius: "large",
                    fontStack: "system",
                    overlayBlur: "small",
                })} >
                    <UserProvider>
                        <TooltipProvider>
                            <FarmProvider>
                                <App />
                            </FarmProvider>
                        </TooltipProvider>
                    </UserProvider>
                </RainbowKitProvider>
            </WagmiProvider>
        </QueryClientProvider>
    </BrowserRouter>
);
