import { ToastContainer } from "react-toastify";
import AppRouter from "./routes";

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="text-sm sm:text-base font-semibold p-2 sm:p-4 rounded-md"
      />
    </>
  );
}

export default App;

