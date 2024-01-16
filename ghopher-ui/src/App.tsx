import React from 'react';
import logo from './logo.svg';
import './App.css';
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";

const config = createConfig(
    getDefaultConfig({
        // Required API Keys
        alchemyId: process.env.REACT_APP_ALCHEMY_KEY, // or infuraId
        walletConnectProjectId: process.env.REACT_APP_WC_KEY ?? "",

        // Required
        appName: "Your App Name",

        // Optional
        appDescription: "Your App Description",
        appUrl: "https://family.co", // your app's url
        appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);

function App() {
  return (
      <WagmiConfig config={config}>
          <ConnectKitProvider>
              
        /* Your App */
              <ConnectKitButton />
          </ConnectKitProvider>
      </WagmiConfig>
  );
}

export default App;
