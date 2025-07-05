import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/Index";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <>
    {/* yo provider //redux toolkit ko lagi */}
      <Provider store={store}> 
        {/* yo // yo router ko lagi */}
        <RouterProvider router={router} /> 
      </Provider>
    </>
  );
};

export default App;
