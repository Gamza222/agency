"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PhotosContainer.module.scss";
import Img1 from "@/shared/assets/icons/test2.jpg";
import Img2 from "@/shared/assets/icons/test3.jpeg";

gsap.registerPlugin(ScrollTrigger);

export const PhotosContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const photo1Ref = useRef<HTMLDivElement>(null);
  const photo2Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const photo1 = photo1Ref.current;
    const photo2 = photo2Ref.current;

    if (!container || !photo1 || !photo2) return;

    const ctx = gsap.context(() => {
      // Animation for both photos
      // Starting position: x -10%, y -5%
      // When scrolling between viewport top and top of photos container
      // When 20% remains, they finish their entrance
      gsap.fromTo(
        photo1,
        {
          xPercent: -40,
          yPercent: 10,
          rotate: 8,
        },
        {
          xPercent: 0,
          yPercent: 0,
          rotate: 4,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top bottom+=10%",
            end: "top 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
      gsap.fromTo(
        photo2,
        {
          xPercent: -50,
          yPercent: 20,
          rotate: 8,
        },
        {
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top bottom+=10%",
            end: "top 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.photosContainer}>
      <figure ref={photo1Ref} className={styles.photosContainer__photo}>
        {/* Photo placeholder - add <img src="..." alt="..." /> here when ready */}
        <img src={Img1} alt="Photo 1" />
      </figure>
      <figure ref={photo2Ref} className={styles.photosContainer__photo}>
        {/* Photo placeholder - add <img src="..." alt="..." /> here when ready */}
        <img src={Img2} alt="Photo 2" />
      </figure>
    </div>
  );
};

PhotosContainer.displayName = "PhotosContainer";
