import { http, createStorage, cookieStorage } from 'wagmi'
import { scrollSepolia } from 'wagmi/chains'
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'

const projectId = import.meta.env.VITE_PROJECT_ID;

const supportedChains: Chain[] = [scrollSepolia];

export const config = getDefaultConfig({
    appName: "WalletConnection",
    projectId,
    chains: supportedChains as any,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {})
});