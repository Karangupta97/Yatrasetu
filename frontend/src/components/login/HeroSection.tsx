/**
 * HeroSection — train.webp, full bleed inside rounded frame, no gray mat.
 */

import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="login-hero-wrap">
      <Image
        src="/train.webp"
        alt="Vande Bharat Express — NDLS to CSMT route"
        fill
        priority
        sizes="(max-width: 1023px) 100vw, 65vw"
        className="login-hero-img"
      />
    </div>
  );
}
