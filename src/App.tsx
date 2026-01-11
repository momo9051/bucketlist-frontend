import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { SigninCallback } from "./pages/SigninCallback";
import { BucketlistTimeline } from "./pages/BucketlistTimeline";
import { BucketlistCreate } from "./pages/BucketlistCreate";
import { BucketlistEdit } from "./pages/BucketlistEdit";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/signin-callback" element={<SigninCallback />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/bucketlist"
              element={
                <ProtectedRoute>
                  <BucketlistTimeline />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bucketlist/create"
              element={
                <ProtectedRoute>
                  <BucketlistCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bucketlist/edit/:id"
              element={
                <ProtectedRoute>
                  <BucketlistEdit />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
