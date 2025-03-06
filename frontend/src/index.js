// index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Update to React 18
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import App from "./App";
import "./index.css"; // Make sure CSS is imported after persist setup
import Loader from "./components/loader/Loader";

const root = ReactDOM.createRoot(document.getElementById("root")); // Update to React 18

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);