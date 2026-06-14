"use client";

import { useEffect } from "react";

/**
 * HomeAnimations — wires up all scroll-triggered animations.
 * Uses IntersectionObserver (opacity + transform only, no layout shift).
 * Parallax on hero via scroll event + rAF.
 * Respects prefers-reduced-motion — CSS disables all keyframe animations;
 * this file also skips the scroll handler when reduced motion is preferred.
 */
export default function HomeAnimations() {
  useEffect(() => {
    // ── Declare all observers up-front so cleanup can always reference them ──
    let connectorObserver: IntersectionObserver | null = null;
    let rafId: number | null = null;

    // ── 1. Staggered reveal — feature cards, step cards, route cards, trust items ──
    const staggeredObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.delay ?? "0";
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-visible");
          staggeredObserver.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    // Apply stagger delays then observe
    document.querySelectorAll<HTMLElement>(".home-feature-card").forEach((el, i) => {
      el.dataset.delay = String(i * 80);
      staggeredObserver.observe(el);
    });
    document.querySelectorAll<HTMLElement>(".home-hiw__step").forEach((el, i) => {
      el.dataset.delay = String(i * 100);
      staggeredObserver.observe(el);
    });
    document.querySelectorAll<HTMLElement>(".home-route-card").forEach((el, i) => {
      el.dataset.delay = String(i * 70);
      staggeredObserver.observe(el);
    });
    document.querySelectorAll<HTMLElement>(".home-trust__item").forEach((el, i) => {
      el.dataset.delay = String(i * 90);
      staggeredObserver.observe(el);
    });
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      staggeredObserver.observe(el);
    });

    // ── 2. Section header reveals ──
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-visible");
          headerObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    document
      .querySelectorAll<HTMLElement>(
        ".home-section__eyebrow, .home-section__title, .home-section__subtitle"
      )
      .forEach((el) => {
        el.classList.add("reveal");
        headerObserver.observe(el);
      });

    // ── 3. HIW connector line fill ──
    const connector = document.querySelector<HTMLElement>(".home-hiw__connector");
    if (connector) {
      connectorObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            connector.classList.add("is-visible");
            connectorObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      connectorObserver.observe(connector);
    }

    // ── 4. Count-up for trust stats ──
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const rawTarget = el.dataset.countTo ?? "0";
          const prefix = el.dataset.prefix ?? "";
          const suffix = el.dataset.suffix ?? "";
          const duration = 1500;
          const target = parseFloat(rawTarget.replace(/[^0-9.]/g, ""));
          const isFloat = rawTarget.includes(".");
          const decimals = isFloat ? (rawTarget.split(".")[1]?.length ?? 1) : 0;
          const start = performance.now();

          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;
            el.textContent =
              prefix +
              (isFloat ? current.toFixed(decimals) : Math.floor(current).toString()) +
              suffix;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = prefix + rawTarget + suffix;
            }
          }

          requestAnimationFrame(tick);
          countObserver.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );

    document
      .querySelectorAll<HTMLElement>("[data-count-to]")
      .forEach((el) => countObserver.observe(el));

    // ── 5. Hero parallax scroll ──
    const heroImg = document.querySelector<HTMLElement>(".home-hero__img");
    const heroContent = document.querySelector<HTMLElement>(".home-hero__content");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollY = window.scrollY;
        if (heroImg) {
          heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        if (heroContent) {
          const opacity = Math.max(0, 1 - scrollY / 420);
          heroContent.style.opacity = String(opacity);
          heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
        }
      });
    }

    if (!prefersReduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // ── Cleanup — all variables guaranteed to be in scope ──
    return () => {
      staggeredObserver.disconnect();
      headerObserver.disconnect();
      connectorObserver?.disconnect();
      countObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);

      // Reset hero inline styles so HMR re-mount doesn't leave stale values
      if (heroImg) heroImg.style.transform = "";
      if (heroContent) {
        heroContent.style.opacity = "";
        heroContent.style.transform = "";
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
