import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/color-mode";
import theme from "./theme.ts";
import UserContext from "./context/AccountContext.tsx";
import { HashRouter } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider theme={theme}>
    <HashRouter>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <UserContext>
        <App />
      </UserContext>
    </HashRouter>
  </ChakraProvider>
);
