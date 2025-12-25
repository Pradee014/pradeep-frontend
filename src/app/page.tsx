import HeroSection from '@/components/HeroSection';
import RagChatbot from '@/components/RagChatbot';
import CaseStudies from '@/components/CaseStudies';
import SkillMatrix from '@/components/SkillMatrix';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <RagChatbot />
      <CaseStudies />
      <SkillMatrix />
      <Testimonials />

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#666', borderTop: '1px solid #222' }}>
        <p>&copy; {new Date().getFullYear()} Pradeep. Built with Next.js & Artificial Intelligence.</p>
      </footer>
    </main>
  );
}
