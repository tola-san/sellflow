import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { TelegramMiniAppProvider } from "./components/telegram/TelegramMiniAppContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <TelegramMiniAppProvider>
            <App />
        </TelegramMiniAppProvider>
    </BrowserRouter>
);
