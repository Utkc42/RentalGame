import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bodyBlue">
      <Header />
      {/* Placeholder voor onze navigatie in te gebruiken */}
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
