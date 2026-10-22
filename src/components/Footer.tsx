"use client";

import Link from "next/link";
import Image from "next/image";
import { FaXTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    "Find Donors": [
      { name: "Find by blood group", href: "/donors" },
      { name: "Find by location", href: "/donors" },
      { name: "Find by availability", href: "/donors" },
      { name: "Request for blood", href: "/blood-requesters" },
    ],
    "Emergency Services": [
      { name: "Find Emergency Service", href: "/emergency-service" },
      { name: "Find by Category", href: "/emergency-service" },
      { name: "Emergency ambulance", href: "/emergency-service" },
      { name: "Support", href: "/about" },
    ],
    "Dashboard": [
      { name: "Overview", href: "/login" },
      { name: "Donation requests", href: "/" },
      { name: "Blood requests", href: "/" },
      { name: "Manage services", href: "/" },
    ],
  };

  return (
    <footer className="relative w-full border-t border-black/10 overflow-hidden font-graphik py-10">
      {/* Background Watermark */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[15rem] md:text-[20rem] font-bold text-gray-200/40 leading-none select-none pointer-events-none whitespace-nowrap">
        Life Share
      </div>

      <div className="relative z-10 container-main">
        {/* Main Footer Card */}
        <div className="bg-white rounded-[2rem] border p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <Link href="/">
                <Image
                  src={"/logo-inv.svg"}
                  alt={"Logo"}
                  width={120}
                  height={120}
                  className="object-cover"
                />
              </Link>

              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Life Share was born from a simple belief: no one should lose their life waiting for blood. We bridge the gap between those who need help and those willing to give it.
              </p>

              <div className="flex items-center gap-4 text-gray-400">
                <Link
                  href="https://imran-alis-portfolio.vercel.app"
                  className="hover:text-gray-900 transition-colors"
                  aria-label="Portfolio"
                  target="_blank"
                >
                  <FaXTwitter className="w-5 h-5" />
                </Link>
                <Link
                  href="https://github.com/IGNIT3-xD"
                  className="hover:text-gray-900 transition-colors"
                  aria-label="Instagram"
                  target="_blank"
                >
                  <FaInstagram className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/imran-ali-mern/"
                  className="hover:text-gray-900 transition-colors"
                  aria-label="LinkedIn"
                  target="_blank"
                >
                  <FaLinkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="https://github.com/IGNIT3-xD"
                  className="hover:text-gray-900 transition-colors"
                  aria-label="GitHub"
                  target="_blank"
                >
                  <FaGithub className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Link Columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-3 lg:pl-12">
              {Object.entries(links).map(([category, items]) => (
                <div key={category} className="flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                    {category}
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-sm text-gray-500 hover:text-[#B15A36] transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 font-medium">
              © {currentYear} Life Share. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-xs text-gray-400 hover:text-gray-900 transition-colors underline decoration-gray-300 hover:decoration-gray-900 underline-offset-4"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-gray-400 hover:text-gray-900 transition-colors underline decoration-gray-300 hover:decoration-gray-900 underline-offset-4"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-gray-400 hover:text-gray-900 transition-colors underline decoration-gray-300 hover:decoration-gray-900 underline-offset-4"
              >
                Cookies Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}