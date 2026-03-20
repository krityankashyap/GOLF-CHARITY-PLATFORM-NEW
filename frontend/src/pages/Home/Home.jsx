import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Heart, Target, CheckCircle, Zap, Shield } from 'lucide-react';
import HeroSection from '@/components/organisms/Home/HeroSection.jsx';
import CharityCard from '@/components/molecules/CharityCard/CharityCard.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useContext } from 'react';
import { CharityContext } from '@/context/CharityContext.jsx';

const steps = [
  {
    icon: CreditCard,
    step: '01',
    title: 'Subscribe',
    desc: 'Choose a monthly or yearly plan. Your subscription funds the prize pool and your chosen charity.',
  },
  {
    icon: Target,
    step: '02',
    title: 'Log Scores',
    desc: 'Enter your Stableford golf scores (1-45). Keep your last 5 scores up to date each month.',
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Win Prizes',
    desc: 'Monthly draw checks your scores against the winning numbers. Match 3, 4, or all 5 to win.',
  },
  {
    icon: Heart,
    step: '04',
    title: 'Support Charity',
    desc: 'Minimum 10% of your subscription goes to your chosen charity. Increase any time.',
  },
];

import { CreditCard } from 'lucide-react';

function Home() {
  const { featured, fetchFeatured } = useContext(CharityContext);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return (
    <div className="bg-forest-900 text-white">
      <HeroSection />

      {/* How it works */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold-500 text-sm uppercase tracking-widest mb-3">Simple process</p>
          <h2 className="font-display text-4xl font-bold text-white">How It Works</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl border border-forest-700/50 bg-forest-800/50 hover:border-gold-500/30 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 text-3xl font-bold font-display text-forest-700">
                  {step.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Prize tiers */}
      <section className="py-24 bg-forest-800/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-500 text-sm uppercase tracking-widest mb-3">Prize structure</p>
            <h2 className="font-display text-4xl font-bold text-white">Win at Three Tiers</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              30% of every subscription goes into the prize pool. Match your scores to the draw numbers to win.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { match: '5 Numbers', label: 'Jackpot', pool: '40%', color: 'gold', rollover: true },
              { match: '4 Numbers', label: 'Second Prize', pool: '35%', color: 'emerald' },
              { match: '3 Numbers', label: 'Third Prize', pool: '25%', color: 'blue' },
            ].map((tier, i) => (
              <motion.div
                key={tier.match}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border text-center ${
                  i === 0
                    ? 'border-gold-500/40 bg-gold-500/5'
                    : i === 1
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-blue-500/30 bg-blue-500/5'
                }`}
              >
                <Trophy
                  className={`w-10 h-10 mx-auto mb-3 ${
                    i === 0 ? 'text-gold-400' : i === 1 ? 'text-emerald-400' : 'text-blue-400'
                  }`}
                />
                <p className="text-3xl font-bold font-display text-white mb-1">{tier.pool}</p>
                <p className="text-sm text-gray-400 mb-1">of prize pool</p>
                <p
                  className={`font-semibold text-lg ${
                    i === 0 ? 'text-gold-400' : i === 1 ? 'text-emerald-400' : 'text-blue-400'
                  }`}
                >
                  Match {tier.match}
                </p>
                <p className="text-gray-500 text-sm mt-1">{tier.label}</p>
                {tier.rollover && (
                  <p className="text-xs text-gold-500/70 mt-2 border-t border-gold-500/20 pt-2">
                    Rolls over if no winner
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured charities */}
      {featured.length > 0 && (
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold-500 text-sm uppercase tracking-widest mb-3">Make an impact</p>
            <h2 className="font-display text-4xl font-bold text-white">Featured Charities</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featured.slice(0, 3).map((charity) => (
              <CharityCard key={charity._id} charity={charity} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/charities">
              <Button variant="outline">View All Charities</Button>
            </Link>
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="py-24 bg-gradient-to-b from-forest-800/30 to-forest-900">
        <div className="max-w-2xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Ready to Play for Good?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of golfers who play, win, and give back every month.
            </p>
            <Link to="/subscribe">
              <Button size="lg" className="px-10 text-base">
                <Zap className="w-5 h-5 mr-2" />
                Join Now — From £10/month
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-forest-700/50 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold-500" />
            <span className="text-sm text-gray-400">Golf Charity Platform — All rights reserved 2024</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
