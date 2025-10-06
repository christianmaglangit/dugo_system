"use client";

import { useState, useEffect } from "react";
import SignupModal from "@/app/homecomponents/SignupModal";
import LoginModal from "@/app/homecomponents/LoginModal";
import { Menu, X } from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [modalType, setModalType] = useState<'signup' | 'login' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = (role: string) => {
    setModalType(null); // close modal

    // redirect based on user role
    if(role === "donor") router.push("/dashdonor");
    else if(role === "hospital") router.push("/dashhospital");
    else if(role === "redcross") router.push("/dashredcross");
    else router.push("/"); // fallback
  }

  const renderAuthButtons = () => (
    <>
      <li>
        <button
          onClick={() => { setModalType('login'); setIsMenuOpen(false); }}
          className="w-full text-center rounded-lg border border-red-600 px-5 py-2.5 text-base font-semibold text-red-600 hover:bg-red-50 transition-all duration-300"
        >
          Log In
        </button>
      </li>
      <li>
        <button
          onClick={() => { setModalType('signup'); setIsMenuOpen(false); }}
          className="w-full text-center rounded-lg bg-red-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-red-700 transition-all duration-300"
        >
          Sign Up
        </button>
      </li>
    </>
  );

  // Slideshow
  const slides = [
    { image: "/images/homepage/homepage1.png", text: "Connecting donors, saving lives. Your journey to make a difference starts here." },
    { image: "/images/homepage/homepage3.png", text: "Be a Hero. Donate Blood. Create a ripple of hope." },
    { image: "/images/homepage/homepage2.png", text: "Streamlining the donation process for a greater impact." },
  ];

  const features = [
    { icon: "/images/homepage/blooddonation.png", title: "Track Your Donation", description: "Follow your blood's journey and see the impact you've made." },
    { icon: "/images/homepage/appointment.png", title: "Easy Scheduling", description: "Book and manage your donation appointments with ease." },
    { icon: "/images/homepage/donor.png", title: "Donor Resources", description: "Access information and resources to make your donation seamless." },
    { icon: "/images/homepage/wy.png", title: "Why Donate?", description: "Learn about the critical need for blood and how you can help." },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev === slides.length - 1 ? 0 : prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md text-gray-800 border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* UPDATED LOGO LAYOUT */}
          <div>
            <div className="text-3xl font-extrabold text-red-600">DUGO</div>
            <div className="text-xs text-gray-500">Donor Utility for Giving and Organizing</div>
          </div>

          <ul className="hidden md:flex items-center space-x-4">{renderAuthButtons()}</ul>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-[100] p-4">
            <div className="flex justify-end mb-8">
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <X size={24} className="text-gray-700" />
                </button>
            </div>
            <ul className="flex flex-col items-center space-y-4">
              {renderAuthButtons()}
            </ul>
          </div>
      )}

      {/* Slideshow */}
      <div className="relative w-full h-[70vh] md:h-[calc(100vh-80px)] flex items-center justify-center text-center text-white pt-[76px] overflow-hidden">
        <div className="absolute inset-0 transition-opacity duration-1000">
          <Image
            key={currentIndex} // Re-triggers animation
            src={slides[currentIndex].image}
            alt="Slide"
            fill
            priority
            className="object-cover animate-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-3xl p-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>{slides[currentIndex].text}</h1>
          <a href="#" onClick={() => setModalType('signup')} className="mt-8 inline-block px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300">
            Become a Donor
          </a>
        </div>
        <div className="absolute bottom-6 flex space-x-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? "bg-white scale-125" : "bg-white/40"}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">A Modern Approach to Blood Donation</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">We leverage technology to make donating blood simpler, faster, and more impactful for everyone involved.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="flex justify-center items-center h-20 w-20 bg-white rounded-full mx-auto shadow-md">
                    <Image src={feature.icon} alt={feature.title} width={48} height={48} />
                  </div>
                  <h3 className="mt-6 font-bold text-lg text-gray-800">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modals */}
      {modalType === 'signup' && (
        <SignupModal
          onClose={() => setModalType(null)}
          onSwitchToLogin={() => setModalType('login')}
        />
      )}
      {modalType === 'login' && (
        <LoginModal
          onClose={() => setModalType(null)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setModalType('signup')}
        />
      )}
    </div>
  );
}