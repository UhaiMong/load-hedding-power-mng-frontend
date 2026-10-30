"use client";
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { companyName, contactNo } from "@/lib/constants";

export default function FloatingButtons() {
  const [showPopup, setShowPopup] = useState(false);
  const message = "Hello! I am interested in your services. Can you help me?";
  const waUrl = `https://wa.me/${contactNo}?text=${encodeURIComponent(message)}`;

  // Listen to global open event from other WhatsApp buttons
  useEffect(() => {
    const handleOpen = () => {
      setShowPopup(true);
    };
    window.addEventListener("open-global-whatsapp", handleOpen);
    return () => {
      window.removeEventListener("open-global-whatsapp", handleOpen);
    };
  }, []);

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* WhatsApp Floating Icon */}
        <div className="group relative flex items-center">
          <span className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 ease-out bg-green-600 text-white px-3 py-1 rounded-full text-sm shadow">
            WhatsApp
          </span>
          <button
            type="button"
            onClick={() => {
              setShowPopup(true);
            }}
            className="flex items-center justify-center border border-white bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-green-700 transition cursor-pointer"
          >
            <FaWhatsapp className="w-8 h-8" />
          </button>
        </div>

        {/* Call Us Floating Icon */}
        <div className="group relative flex items-center">
          <span className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 ease-out bg-primary/80 text-white px-3 w-24 text-center py-1 rounded-full text-sm shadow">
            Call Us
          </span>
          <a
            href={`tel:${contactNo}`}
            className="flex items-center justify-center bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary/80 transition"
          >
            <Phone className="w-7 h-7" />
          </a>
        </div>
      </div>

      {/* WhatsApp Popup (Previous Design restored) */}
      {showPopup && (
        <div className="fixed bottom-34 right-6 w-80 bg-white rounded-lg shadow-xl z-50 animate-slideIn">
          {/* Header */}
          <div className="bg-[#075e54] text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/logo/logo.png"
                  alt={`${companyName} Logo`}
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                />
              </div>
              <span className="font-semibold leading-tight">{companyName}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="text-white font-bold cursor-pointer hover:text-gray-200 transition bg-transparent border-none outline-none"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="bg-gray-50 bg-[url('/utilsimg/whatsappbg.jpg')] bg-cover bg-center rounded-b-lg flex flex-col gap-4">
            <p className="text-gray-800 shadow bg-[#dcf8c6] m-5 rounded font-bold p-3 text-md leading-relaxed ">
              Hello.
              <br />
              Can we help you?
            </p>
            <div className="bg-white p-4 flex justify-center items-center w-full rounded-b-lg">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
                onClick={() => {
                  setShowPopup(false);
                }}
              >
                <FaWhatsapp className="w-5 h-5" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
