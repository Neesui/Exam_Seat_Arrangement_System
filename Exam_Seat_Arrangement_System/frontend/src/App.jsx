import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/Index";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <>
      <Provider store={store}> //redux toolkit ko lagi
        <RouterProvider router={router} /> // yo router ko lagi
      </Provider>
    </>
  );
};

export default App;
