"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CERTIFICATIONS } from "@/data/certifications";

export default function CertificationsSection() {
  const { ref: sectionRef } = useSectionInView(0.1);
  const headingRef = useRef<HTMLHeadingElement>(null);

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

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="relative min-h-screen bg-black py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{ opacity: 0 }}
          >
            Certifications
            <span className="text-[#FFD700]">.</span>
          </h2>
          <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
            Professional credentials and achievements
          </p>
        </div>

        {/* Cert grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: "easeOut",
              }}
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{
                y: -4,
                boxShadow: "0 0 30px rgba(255, 215, 0, 0.15)",
                transition: { duration: 0.25 },
              }}
              className="rounded-xl"
            >
              <Card className="h-full bg-white/5 border-white/10 hover:border-[#FFD700]/40 transition-colors duration-300">
                <CardHeader>
                  <CardDescription className="text-[#FFD700] text-xs font-semibold uppercase tracking-wider">
                    {cert.issuer}
                  </CardDescription>
                  <CardTitle className="text-white text-base leading-snug">
                    {cert.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{cert.date}</span>
                  </div>
                  {cert.credentialId && (
                    <p className="mt-2 text-white/30 text-xs font-mono">
                      ID: {cert.credentialId}
                    </p>
                  )}
                </CardContent>
                {cert.credentialUrl && (
                  <CardFooter>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition-colors"
                    >
                      Verify Credential
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
