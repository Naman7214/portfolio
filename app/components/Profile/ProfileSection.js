"use client";

import { useState, useRef } from "react";
import styles from "./ProfileSection.module.css";
import Image from "next/image";

export default function ProfileSection() {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -20; // Increased tilt for card effect
        const rotateY = ((x - centerX) / centerX) * 20;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.perspectiveContainer}>
                <div
                    className={styles.idCard}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={cardRef}
                    style={{
                        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                    }}
                >
                    <div className={styles.cardHeader}>
                        <div className={styles.hole}></div>
                        <span className={styles.headerText}>ACCESS GRANTED</span>
                    </div>

                    <div className={styles.photoArea}>
                        {/* 
              INSTRUCTIONS:
              1. Place your image file in the 'public' folder (e.g., public/profile.jpg).
              2. Uncomment the Image component below and update 'src'.
              3. Remove the placeholder div.
            */}
                        <Image src="/naman.jpg" alt="Naman Agnihotri" width={120} height={120} className={styles.profileImage} />
                        {/* <div className={styles.placeholderImage}>NA</div> */}
                        <div className={styles.scanLine}></div>
                    </div>

                    <div className={styles.infoArea}>
                        <h2 className={styles.name}>NAMAN AGNIHOTRI</h2>
                        <p className={styles.role}>AI ENGINEER</p>
                        <p className={styles.idNumber}>ID: 883-006-9926</p>
                    </div>

                    <div className={styles.barcode}>
                        ||| || ||| | ||| || || |||
                    </div>

                    {/* Holographic overlay */}
                    <div className={styles.hologram}></div>
                </div>
            </div>

            <div className={styles.socials}>
                <a href="https://github.com/Naman7214" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>
                <a href="https://linkedin.com/in/naman-agnihotri" target="_blank" rel="noopener noreferrer" className={styles.link}>LinkedIn</a>
                <a href="mailto:namanagnihotri280@gmail.com" className={styles.link}>Email</a>
            </div>
        </div>
    );
}
