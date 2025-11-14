import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Healers from "./pages/healers";
import Prophets from "./pages/prophets";
import Mediums from "./pages/mediums";
import Events from "./pages/Events";
import Support from "./pages/support";
import Store from "./pages/Store";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/healers" element={<Healers />} />
        <Route path="/prophets" element={<Prophets />} />
        <Route path="/mediums" element={<Mediums />} />
        <Route path="/events" element={<Events />} />
        <Route path="/support" element={<Support />} />
        <Route path="/store" element={<Store />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
