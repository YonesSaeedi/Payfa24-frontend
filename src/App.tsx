import { ToastContainer } from "react-toastify";
import AppRouter from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient() // we instantiate it once, here; to avoid creating query client on every render (if its instantiation is taken inside the client={})

  return (
    // provider for using react query
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;

