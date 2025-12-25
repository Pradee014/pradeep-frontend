import React from 'react';
import styles from './HeroSection.module.css';
import { MessageSquare, ArrowRight } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className={`container ${styles.hero}`}>
            <h1 className={styles.headline}>
                I Architect & Ship Scalable AI Systems.<br />
                From Tensor to P&L.
            </h1>
            <p className={styles.subheadline}>
                Mid-level AI Engineer with 4 years of experience shipping production ML pipelines and managing $50k+ technical budgets.
            </p>

            <div className={styles.ctaGroup}>
                <a href="#chat" className={styles.primaryBtn}>
                    <MessageSquare size={20} />
                    Chat with my AI Agent
                </a>
                <a href="#case-studies" className={styles.secondaryBtn}>
                    View Case Studies
                </a>
            </div>
        </section>
    );
};

export default HeroSection;
