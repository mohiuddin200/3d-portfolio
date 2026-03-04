"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS, CONTACT } from "@/data/social";

/* ------------------------------------------------------------------ */
/* Inline SVG icons (no lucide import)                                 */
/* ------------------------------------------------------------------ */

const ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  phone: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ContactSection() {
  const { ref: sectionRef } = useSectionInView(0.1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  // Heading animation
  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = CONTACT.email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Build tile data: social links + resume + email
  const socialTiles = SOCIAL_LINKS.filter((s) => s.icon !== "mail");
  const emailLink = SOCIAL_LINKS.find((s) => s.icon === "mail");

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{ opacity: 0 }}
          >
            Get in Touch
            <span className="text-[#FFD700]">.</span>
          </h2>
          <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
            Let&apos;s connect and build something great
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto auto-rows-[180px]">
          {/* Email tile (large, spans 2 cols) */}
          <motion.button
            onClick={handleCopyEmail}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            whileTap={{ scale: 0.98 }}
            className="col-span-2 row-span-1 rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between cursor-pointer group hover:border-[#FFD700]/40 transition-colors duration-300 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="text-[#FFD700]">
                {ICONS.mail}
              </div>
              <span className="text-xs uppercase tracking-wider text-white/30 group-hover:text-white/50 transition-colors">
                {copied ? "Copied!" : "Click to copy"}
              </span>
            </div>
            <div>
              <p className="text-white/40 text-sm mb-1">Email</p>
              <p className="text-white text-lg font-medium truncate">
                {CONTACT.email}
              </p>
            </div>
          </motion.button>

          {/* Resume tile (spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            className="col-span-2 row-span-1 rounded-2xl border border-[#FFD700]/20 bg-[#FFD700]/5 p-6 flex flex-col justify-between group hover:border-[#FFD700]/50 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span className="text-xs uppercase tracking-wider text-[#FFD700]/50">
                Resume
              </span>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-3">
                Download my resume for the full picture
              </p>
              <Button
                asChild
                className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold w-full sm:w-auto"
              >
                <a href={CONTACT.resumeUrl} download>
                  Download Resume
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Social link tiles */}
          {socialTiles.map((link, i) => (
            <SocialTile key={link.name} link={link} index={i} />
          ))}

          {/* Email social tile (if separate from the copy tile above) */}
          {emailLink && (
            <SocialTile
              key={emailLink.name}
              link={emailLink}
              index={socialTiles.length}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Social tile sub-component                                           */
/* ------------------------------------------------------------------ */

interface SocialTileProps {
  link: (typeof SOCIAL_LINKS)[number];
  index: number;
}

function SocialTile({ link, index }: SocialTileProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={link.url}
      target={link.icon === "mail" ? undefined : "_blank"}
      rel={link.icon === "mail" ? undefined : "noopener noreferrer"}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 15 },
      }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl border border-white/10 p-6 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden"
      style={{
        backgroundColor: hovered ? link.color : "rgba(255,255,255,0.03)",
        borderColor: hovered ? link.color : "rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="transition-colors duration-300"
        style={{ color: hovered ? "#000000" : link.color }}
      >
        {ICONS[link.icon] ?? (
          <span className="text-2xl font-bold">{link.name[0]}</span>
        )}
      </div>
      <div>
        <p
          className="font-medium text-sm transition-colors duration-300"
          style={{ color: hovered ? "#000000" : "rgba(255,255,255,0.8)" }}
        >
          {link.name}
        </p>
        <p
          className="text-xs mt-0.5 transition-colors duration-300"
          style={{ color: hovered ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.3)" }}
        >
          {link.icon === "mail"
            ? "Say hello"
            : link.icon === "phone"
              ? "Call me"
              : `@${link.url.split("/").filter(Boolean).pop()}`}
        </p>
      </div>
    </motion.a>
  );
}
