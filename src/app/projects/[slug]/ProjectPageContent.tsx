"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { gsap } from "@/lib/gsap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "@/types";
import { PROJECTS } from "@/data/projects";

interface Props {
  project: Project;
}

export default function ProjectPageContent({ project }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = project.screenshots.length;
  const showNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % total));
  const showPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + total) % total));

  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : null;
  const nextProject =
    currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : null;

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(".project-hero-image", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Hero Banner */}
      <div ref={heroRef} className="relative h-[60vh] overflow-hidden">
        <div className="project-hero-image absolute inset-0 scale-110">
          <Image
            src={project.coverImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-bg-primary" />
          <div className="absolute inset-0 bg-gold/5" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/#projects"
                className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-gold"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Projects
              </Link>
              <h1 className="text-4xl font-bold text-text-primary md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-3 text-lg text-text-secondary">
                {project.shortDescription}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Description */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="mb-6 text-2xl font-semibold text-text-primary">
              About This Project
            </h2>
            <p className="text-lg leading-relaxed text-text-secondary">
              {project.description}
            </p>
          </motion.div>

          {/* Metadata Sidebar */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Tech Stack */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="border-white/10 bg-bg-card text-text-secondary"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Year */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gold">
                Year
              </h3>
              <p className="text-text-secondary">{project.year}</p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-gold text-black hover:bg-gold-dark">
                    View Live Site
                  </Button>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-text-primary hover:border-gold hover:text-gold"
                  >
                    View Source Code
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Screenshots Gallery */}
        {project.screenshots.length > 0 && (
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-8 text-2xl font-semibold text-text-primary">
              Screenshots
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.screenshots.map((src, i) => (
                <motion.button
                  key={src}
                  type="button"
                  aria-label={`Open ${project.title} screenshot ${i + 1} of ${total}`}
                  className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveIndex(i)}
                >
                  <Image
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-left-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gold/0 transition-colors group-hover:bg-gold/5" />
                </motion.button>
              ))}
            </div>

            {/* Lightbox */}
            <Dialog
              open={activeIndex !== null}
              onOpenChange={(open) => {
                if (!open) setActiveIndex(null);
              }}
            >
              <DialogContent
                className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-[min(calc(100vw-4rem),1800px)] gap-0 border-white/10 bg-bg-secondary p-2 sm:p-3 [&>button]:top-3 [&>button]:right-3 [&>button]:rounded-full [&>button]:bg-black/70 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-gold [&>button]:hover:text-black"
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    showNext();
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    showPrev();
                  }
                }}
              >
                <DialogTitle className="sr-only">
                  {project.title} screenshot {(activeIndex ?? 0) + 1} of {total}
                </DialogTitle>
                <div className="relative mx-auto aspect-[16/10] w-full max-h-[calc(100vh-4rem)] overflow-hidden rounded-md bg-bg-card">
                  {activeIndex !== null && (
                    <Image
                      key={project.screenshots[activeIndex]}
                      src={project.screenshots[activeIndex]}
                      alt={`${project.title} screenshot ${activeIndex + 1}`}
                      fill
                      priority
                      sizes="(min-width: 1864px) 1800px, calc(100vw - 4rem)"
                      className="object-contain"
                    />
                  )}

                  {total > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous screenshot"
                        onClick={showPrev}
                        className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-gold hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:left-4 sm:size-12"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label="Next screenshot"
                        onClick={showNext}
                        className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-gold hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-4 sm:size-12"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 font-mono text-xs text-gold backdrop-blur-sm">
                        {(activeIndex ?? 0) + 1} / {total}
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}

        {/* Video */}
        {project.videoUrl && (
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-8 text-2xl font-semibold text-text-primary">
              Demo Video
            </h2>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-bg-card">
              {!videoLoaded ? (
                <button
                  onClick={() => setVideoLoaded(true)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-colors hover:bg-white/5"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-gold/10">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="ml-1 text-gold"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-secondary">
                    Click to play video
                  </span>
                </button>
              ) : (
                <iframe
                  src={project.videoUrl}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${project.title} demo video`}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="mt-20 flex items-center justify-between border-t border-white/10 pt-8">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex items-center gap-2 text-text-secondary transition-colors hover:text-gold"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">{prevProject.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : (
            <div />
          )}
          <Link
            href="/#projects"
            className="text-sm text-text-secondary transition-colors hover:text-gold"
          >
            All Projects
          </Link>
          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex items-center gap-2 text-text-secondary transition-colors hover:text-gold"
            >
              <span className="hidden sm:inline">{nextProject.title}</span>
              <span className="sm:hidden">Next</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}
