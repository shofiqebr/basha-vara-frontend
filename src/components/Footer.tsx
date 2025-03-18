"use client";

import { useRouter } from "next/navigation";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="bg-[#111827] text-white py-10 mt-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-bold">Contact Us</h2>
          <p className="mt-2">Email: support@basafinder.com</p>
          <p>Phone: +880 1234 567 890</p>
          <div className="flex gap-3 mt-3">
            <FaFacebook className="cursor-pointer text-xl" onClick={() => window.open("https://facebook.com", "_blank")} />
            <FaTwitter className="cursor-pointer text-xl" onClick={() => window.open("https://twitter.com", "_blank")} />
            <FaInstagram className="cursor-pointer text-xl" onClick={() => window.open("https://instagram.com", "_blank")} />
          </div>
        </div>

        {/* Additional Links */}
        <div>
          <h2 className="text-lg font-bold">Quick Links</h2>
          <ul className="mt-2">
            <li className="cursor-pointer hover:underline" onClick={() => router.push("/terms")}>Terms of Use</li>
            <li className="cursor-pointer hover:underline" onClick={() => router.push("/privacy")}>Privacy Policy</li>
            <li className="cursor-pointer hover:underline" onClick={() => router.push("/faq")}>FAQs</li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right">
          <p className="text-sm">© {new Date().getFullYear()} BasaFinder. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;