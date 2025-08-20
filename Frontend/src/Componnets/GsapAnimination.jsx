"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PortfolioScroll = () => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef([]);
  const contactRef = useRef(null);

  useEffect(() => {
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power3.out",
    });

    gsap.from(aboutRef.current, {
      scrollTrigger: { trigger: aboutRef.current, start: "top 85%" },
      opacity: 0,
      y: 60,
      duration: 1,
      ease: "power2.out",
    });

    projectsRef.current.forEach((proj, i) => {
      gsap.from(proj, {
        scrollTrigger: {
          trigger: proj,
          start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power2.out",
      });
    });

    gsap.from(contactRef.current, {
      scrollTrigger: { trigger: contactRef.current, start: "top 85%" },
      opacity: 0,
      y: 60,
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  return (
    <main className="bg-black text-white min-h-screen font-sans">
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="h-screen flex flex-col justify-center items-center text-center px-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Rajan Dhamala</h1>
        <p className="text-gray-400 text-xl max-w-2xl">
          I'm a full-stack developer passionate about building elegant, performant web applications using React, Node.js, and MongoDB.
        </p>
        <div className="mt-10 text-gray-500 animate-bounce">↓ Scroll</div>
      </section>

      {/* ABOUT SECTION */}
      <section
        ref={aboutRef}
        className="px-6 py-20 max-w-4xl mx-auto text-center space-y-6"
      >
        <h2 className="text-3xl font-semibold">About Me</h2>
        <p className="text-gray-400 leading-relaxed">
          I'm a self-taught developer with 3+ years of experience building full-stack applications. I focus on clean code, reusability, and performance. My tech stack includes React, Tailwind CSS, Express, MongoDB, and GSAP for beautiful animations. I'm also familiar with Docker, CI/CD, and RESTful API design.
        </p>
        <p className="text-gray-400">
          I enjoy solving real-world problems, collaborating on open source, and turning complex ideas into sleek, user-friendly apps.
        </p>
      </section>

      {/* PROJECTS SECTION */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "ReportTrackr",
              description:
                "A citizen-driven reporting platform with geolocation, image uploads, and admin dashboard. Built with React, Leaflet, Express, and MongoDB.",
              tech: ["React", "Tailwind", "Leaflet", "Node.js"],
            },
            {
              title: "DevSync",
              description:
                "A real-time collaboration tool for developers. Supports live code sharing, chat, and version control sync. Uses WebSockets and JWT auth.",
              tech: ["Socket.IO", "React", "MongoDB", "Express"],
            },
            {
              title: "QuickVault",
              description:
                "Secure password manager with encryption, multi-device sync, and a sleek dark UI. Supports biometric login (demo).",
              tech: ["React", "IndexedDB", "Node.js", "Crypto"],
            },
            {
              title: "BudgetWise",
              description:
                "Personal finance tracker with charts, category filters, and recurring income/expense support. Visualized with Recharts.",
              tech: ["React", "Recharts", "Express", "MongoDB"],
            },
          ].map((project, i) => (
            <div
              key={i}
              ref={(el) => (projectsRef.current[i] = el)}
              className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl"
            >
              <h3 className="text-xl font-medium mb-2">{project.title}</h3>
              <p className="text-gray-400 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tech.map((tech, j) => (
                  <span
                    key={j}
                    className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        ref={contactRef}
        className="px-6 py-20 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl font-semibold mb-4">Get In Touch</h2>
        <p className="text-gray-400 mb-6">
          Have a project, opportunity, or just want to say hi? I'm always open to chat. Let's build something amazing together.
        </p>
        <a
          href="mailto:rajan@example.com"
          className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Contact Me
        </a>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-600 py-10 border-t border-gray-800">
        © {new Date().getFullYear()} Rajan Dhamala. Built with React, Tailwind & GSAP.
      </footer>
    </main>
  );
};

export default PortfolioScroll;
