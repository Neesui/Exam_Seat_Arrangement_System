import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/Index";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    // provider chahi redux ko lagi use hunxa
    // routerprovider chahi router lai use hunxa
    <Provider store={store}> 
      <RouterProvider router={router} /> 

      {/*Toast container to show notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </Provider>
  );
};

export default App;
