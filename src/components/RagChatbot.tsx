"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './RagChatbot.module.css';
import { Send, Terminal } from 'lucide-react';

const SAMPLE_LOGS = [
    { step: "Retriever", msg: "Querying vector index 'skills-v2'..." },
    { step: "VectorDB", msg: "Found 3 relevant chunks (Score: 0.89)" },
    { step: "Source", msg: "Loaded content from 'Resume_v4.pdf' p.2" },
    { step: "LLM", msg: "Generating response with temp=0.7..." },
];

const RagChatbot = () => {
    const [showLogs, setShowLogs] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: "Hi! I'm Pradeep's AI Agent. Ask me anything about his experience with PyTorch, budget management, or system architecture." }
    ]);
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<{ step: string, msg: string }[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const msgsEndRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setInput('');
        setLogs([]); // Clear logs for new turn

        // Simulate RAG process
        const mockResponse = getMockResponse(input);

        // Simulate Logs Streaming
        if (showLogs) {
            let logIndex = 0;
            const logInterval = setInterval(() => {
                if (logIndex >= SAMPLE_LOGS.length) {
                    clearInterval(logInterval);
                    // Add bot message after logs
                    setTimeout(() => {
                        setMessages(prev => [...prev, { role: 'bot', text: mockResponse }]);
                    }, 500);
                    return;
                }
                setLogs(prev => [...prev, SAMPLE_LOGS[logIndex]]);
                logIndex++;
            }, 400); // 400ms per log
        } else {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'bot', text: mockResponse }]);
            }, 1000);
        }
    };

    const getMockResponse = (query: string) => {
        if (query.toLowerCase().includes('pytorch')) {
            return "Pradeep has 4 years of experience with PyTorch, specifically in building custom training loops for NLP models and optimizing inference pipelines using TorchScript.";
        }
        if (query.toLowerCase().includes('manage') || query.toLowerCase().includes('budget')) {
            return "He managed a $50k+ technical budget for cloud infrastructure, optimizing AWS spend by implementing spot instances and auto-scaling policies, resulting in a 20% cost reduction.";
        }
        return "I can certainly tell you about that. Pradeep specializes in bridging the gap between technical implementation and business value. Check out the Case Studies below for concrete examples!";
    };

    // Scroll to bottom
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    useEffect(() => {
        msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <section id="chat" className={`container ${styles.section}`}>
            <h2 className={styles.title}>Interview Me (24/7)</h2>

            <div className={styles.chatContainer}>
                <div className={styles.header}>
                    <span>AI Agent v1.0</span>
                    <label className={styles.toggleLabel}>
                        <input
                            type="checkbox"
                            checked={showLogs}
                            onChange={(e) => setShowLogs(e.target.checked)}
                            className={styles.toggleInput}
                        />
                        <Terminal size={14} />
                        Engineers Only Mode
                    </label>
                </div>

                <div className={styles.content}>
                    <div className={styles.chatPanel}>
                        <div className={styles.messages}>
                            {messages.map((m, i) => (
                                <div key={i} className={`${styles.message} ${m.role === 'user' ? styles.userMsg : styles.botMsg}`}>
                                    {m.text}
                                </div>
                            ))}
                            <div ref={msgsEndRef} />
                        </div>

                        <div className={styles.inputArea}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Ask about PyTorch, budgets, etc..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button className={styles.sendBtn} onClick={handleSend}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    {showLogs && (
                        <div className={styles.logsPanel}>
                            <div style={{ marginBottom: '0.5rem', borderBottom: '1px dashed #333', paddingBottom: '0.5rem' }}>
                                SYSTEM TRACE
                            </div>
                            {logs.length === 0 && <span style={{ opacity: 0.5 }}>Waiting for query...</span>}
                            {logs.map((log, i) => (
                                <div key={i} className={styles.logEntry}>
                                    <span className={styles.logHighlight}>[{log.step}]</span> {log.msg}
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default RagChatbot;
