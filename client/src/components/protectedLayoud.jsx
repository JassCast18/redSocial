// src/components/ProtectedLayout.jsx
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

function ProtectedLayout() {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedLayout;
