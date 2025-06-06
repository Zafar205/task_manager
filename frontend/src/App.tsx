import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import Home from "./pages/Home"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<Signin />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;