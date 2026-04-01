import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Users, TrendingUp, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8 serif"
          >
            Digitalizing the <br />
            <span className="text-[#0066FF]">Ajo Tradition.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-12"
          >
            A secure, transparent, and automated platform for rotating savings. 
            Build community wealth with trust and technology.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <Link to="/auth" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Start a Group <ArrowRight size={20} />
            </Link>
            <Link to="/auth" className="btn-secondary text-lg px-8 py-4">
              Join Existing
            </Link>
          </motion.div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0066FF] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#28A745] rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Shield className="text-[#0066FF]" size={32} />}
              title="Verified Security"
              description="Every contribution is verified with proof-of-payment screenshots and organizer approval."
            />
            <FeatureCard 
              icon={<Users className="text-[#0066FF]" size={32} />}
              title="Community Trust"
              description="Transparent rotation schedules so everyone knows exactly when their payout is coming."
            />
            <FeatureCard 
              icon={<TrendingUp className="text-[#0066FF]" size={32} />}
              title="Automated Growth"
              description="Smart reminders and automated cycle management to keep the savings momentum going."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 serif">How AjoDigital Works</h2>
          <div className="max-w-4xl mx-auto space-y-12">
            <Step number="01" title="Create or Join a Group" description="Set your contribution amount, frequency, and member limit." />
            <Step number="02" title="Verify Your Identity" description="Connect your bank details and verify your account for trust." />
            <Step number="03" title="Contribute & Save" description="Upload payment proof each cycle. The system tracks everything." />
            <Step number="04" title="Receive Your Payout" description="When it's your turn, the total pool is disbursed to your account." />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-xl transition-all">
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Step = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="flex gap-8 items-start">
    <div className="text-5xl font-bold text-[#0066FF] opacity-20 serif">{number}</div>
    <div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  </div>
);

export default LandingPage;
