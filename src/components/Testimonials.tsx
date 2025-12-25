import React from 'react';
import styles from './Testimonials.module.css';

const Testimonials = () => {
    return (
        <section className={`container ${styles.section}`}>
            <h2 className={styles.title}>Trusted by Teams</h2>

            <div className={styles.grid}>
                {/* Tech Validation */}
                <div className={styles.card}>
                    <span className={`${styles.badge} ${styles.techBadge}`}>Engineering</span>
                    <p className={styles.quote}>
                        "Pradeep writes clean, self-documenting code we didn't have to refactor. His focus on observability meant we caught 90% of bugs before production."
                    </p>
                    <div className={styles.author}>
                        <div className={styles.avatar}>SD</div>
                        <div className={styles.authorInfo}>
                            <span className={styles.name}>Sarah D.</span>
                            <span className={styles.role}>Senior Staff Engineer</span>
                        </div>
                    </div>
                </div>

                {/* Business Validation */}
                <div className={styles.card}>
                    <span className={`${styles.badge} ${styles.bizBadge}`}>Management</span>
                    <p className={styles.quote}>
                        "He translated our vague business needs into a working tool in 3 weeks. Pradeep bridges the gap between 'what is possible' and 'what creates value'."
                    </p>
                    <div className={styles.author}>
                        <div className={styles.avatar}>MJ</div>
                        <div className={styles.authorInfo}>
                            <span className={styles.name}>Mike J.</span>
                            <span className={styles.role}>VP of Product</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
