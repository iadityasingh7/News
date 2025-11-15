import * as React from "react";
import Box from "@mui/material/Box";

import { Provider } from "react-redux";
import { store } from "./store";

// components import
import Header from "./components/Header";
import MainScreen from "./components/MainScreen";

import NetworkStatus from "./components/NetworkStatus";

function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <Box>
          <NetworkStatus />
          <Header />
          <MainScreen />
        </Box>
      </Provider>
    </React.Fragment>
  );
}

export default App;
