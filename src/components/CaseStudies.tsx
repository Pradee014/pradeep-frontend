"use client";

import React, { useState } from 'react';
import styles from './CaseStudies.module.css';
import { Briefcase, Code2, ExternalLink, BarChart3, Cpu } from 'lucide-react';

type Project = {
    id: number;
    title: string;
    role: string;
    managerView: {
        metrics: string[];
        artifacts: string;
    };
    engineerView: {
        stack: string[];
        highlight: string;
    };
};

const PROJECTS: Project[] = [
    {
        id: 1,
        title: "Enterprise RAG Pipeline",
        role: "Lead AI Engineer",
        managerView: {
            metrics: [
                "Reduced internal search time by 40%",
                "Saved $12k/month in cloud costs via quantization",
                "Delivered 2 weeks ahead of schedule"
            ],
            artifacts: "Project Gannett Chart & ROI Deck"
        },
        engineerView: {
            stack: ["PyTorch", "LangChain", "Pinecone", "AWS SageMaker"],
            highlight: "Implemented hybrid search (sparse + dense) with custom reranking to improve precision @ 3 from 65% to 88%."
        }
    },
    {
        id: 2,
        title: "Predictive Maintenance IoT",
        role: "ML Engineer",
        managerView: {
            metrics: [
                "Decreased equipment downtime by 15%",
                "Managed 3 external vendors for sensor data",
                "Presented monthly to VP of Operations"
            ],
            artifacts: "Stakeholder Presentation"
        },
        engineerView: {
            stack: ["TensorFlow", "Kinesis", "Docker", "FastAPI"],
            highlight: "Designed a sliding-window LSTM architecture processing 5TB of sensor streams daily with <100ms latency."
        }
    }
];

const CaseStudies = () => {
    return (
        <section id="case-studies" className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>Selected Work</h2>
                <div className={styles.grid}>
                    {PROJECTS.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project }: { project: Project }) => {
    const [view, setView] = useState<'manager' | 'engineer'>('manager');

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3 className={styles.projectName}>{project.title}</h3>
                <span className={styles.projectRole}>{project.role}</span>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${view === 'manager' ? styles.activeTab : ''}`}
                    onClick={() => setView('manager')}
                >
                    <BarChart3 size={16} style={{ display: 'inline', marginBottom: -2, marginRight: 6 }} />
                    Manager View
                </button>
                <button
                    className={`${styles.tab} ${view === 'engineer' ? styles.activeTab : ''}`}
                    onClick={() => setView('engineer')}
                >
                    <Code2 size={16} style={{ display: 'inline', marginBottom: -2, marginRight: 6 }} />
                    Engineer View
                </button>
            </div>

            <div className={styles.content}>
                {view === 'manager' ? (
                    <div className="animate-fade-in">
                        <h4 className={styles.viewTitle}>ROI & Process</h4>
                        <ul className={styles.metrics}>
                            {project.managerView.metrics.map((m, i) => (
                                <li key={i}>{m}</li>
                            ))}
                        </ul>
                        <a href="#" className={styles.artifactLink}>
                            <Briefcase size={16} />
                            View {project.managerView.artifacts}
                        </a>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <h4 className={styles.viewTitle}>Tech Stack & Arch</h4>
                        <div className={styles.stack}>
                            {project.engineerView.stack.map(t => (
                                <span key={t} className={styles.techTag}>{t}</span>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#dedede', marginBottom: '1.5rem' }}>
                            {project.engineerView.highlight}
                        </p>
                        <a href="#" className={styles.artifactLink}>
                            <Cpu size={16} />
                            View System Architecture
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseStudies;
