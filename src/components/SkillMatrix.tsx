import React from 'react';
import styles from './SkillMatrix.module.css';
import { Terminal, Users, Database, LayoutTemplate, Cloud, DollarSign, PenTool, GitBranch } from 'lucide-react';

const SkillMatrix = () => {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>T-Shaped Competency</h2>

            <div className={`container ${styles.container}`}>
                {/* Left Column: Build (Technical) */}
                <div className={styles.column}>
                    <div className={`${styles.colHeader} ${styles.leftBorder}`}>
                        <Terminal className="text-primary" size={32} color="#6366f1" />
                        <h3 className={styles.colTitle}>
                            Build
                            <span className={styles.subTitle}>Engineering & Architecture</span>
                        </h3>
                    </div>

                    <ul className={styles.list}>
                        <li className={styles.item}><Database size={18} /> Python & PyTorch</li>
                        <li className={styles.item}><LayoutTemplate size={18} /> RAG & Vector DBs (Pinecone)</li>
                        <li className={styles.item}><Cloud size={18} /> Docker & Kubernetes</li>
                        <li className={styles.item}><GitBranch size={18} /> CI/CD & MLOps</li>
                    </ul>
                </div>

                {/* Right Column: Manage (Strategy) */}
                <div className={styles.column}>
                    <div className={`${styles.colHeader} ${styles.rightBorder}`}>
                        <Users className="text-secondary" size={32} color="#ec4899" />
                        <h3 className={styles.colTitle}>
                            Manage
                            <span className={styles.subTitle}>Strategy & Process</span>
                        </h3>
                    </div>

                    <ul className={styles.list}>
                        <li className={styles.item}><Users size={18} /> Agile/Scrum Leadership</li>
                        <li className={styles.item}><DollarSign size={18} /> Cloud Cost FinOps</li>
                        <li className={styles.item}><Users size={18} /> Vendor Management</li>
                        <li className={styles.item}><PenTool size={18} /> Technical Writing</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default SkillMatrix;
