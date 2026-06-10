/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Vote } from "./pages/Vote";
import { About } from "./pages/About";
import { Help } from "./pages/Help";
import { ReviewPage } from "./pages/Review";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ng-bg flex flex-col font-sans border-t-8 border-primary">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/review" element={<ReviewPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
