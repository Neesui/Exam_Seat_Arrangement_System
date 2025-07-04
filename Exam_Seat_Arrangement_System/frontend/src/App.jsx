import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/Index";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
};

export default App;
