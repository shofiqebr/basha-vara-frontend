import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="min-h-screen">
    <Navbar/>
    <div className="max-w-[1600px] mx-auto min-h-[700px]">

    {children}
    </div>
    <Footer/>
    <ToastContainer />
    </div>;
};

export default Layout;
