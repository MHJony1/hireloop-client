'use client';
import { useState } from 'react';
import { Crown, BarChart2, Zap, Plus, ArrowRight } from 'lucide-react';

const plans = [
  {
    icon: <Crown size={18} className="text-violet-400" />,
    name: 'Starter',
    price: { monthly: 0, yearly: 0 },
    tagline: 'Start building your insights hub:',
    features: [
      'Daily AI match brief (top 5)',
      'Verified salary bands',
      'Company insight dashboards',
      '1-click apply, unlimited',
    ],
    highlighted: false,
  },
  {
    icon: <BarChart2 size={18} className="text-violet-400" />,
    name: 'Growth',
    price: { monthly: 17, yearly: 13 },
    tagline: 'Start building your insights hub:',
    features: [
      'Daily AI match brief (top 5)',
      'Verified salary bands',
      'Company insight dashboards',
      '1-click apply, unlimited',
    ],
    highlighted: true,
  },
  {
    icon: <Zap size={18} className="text-violet-400" />,
    name: 'Premium',
    price: { monthly: 99, yearly: 74 },
    tagline: 'Start building your insights hub:',
    features: [
      'Everything in Pro',
      'Multi-profile career portfolios',
      'Shared talent rooms',
      'Recruiter view (read-only)',
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  const [billing, setBilling] = useState('monthly');

  return (
    <section className="bg-[#040404] px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 bg-violet-700 rounded-sm inline-block" />
          <span className="text-[11px] tracking-widest uppercase text-violet-400 font-medium">
            Pricing
          </span>
          <span className="w-1.5 h-1.5 bg-violet-700 rounded-sm inline-block" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-5xl font-semibold text-white leading-tight mb-10">
          Pay for the leverage,
          <br />
          not the listings
        </h2>

        {/* Toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-full p-1 gap-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                billing === 'monthly'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billing === 'yearly'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="bg-fuchsia-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                25%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl flex flex-col justify-between p-6 border transition-all ${
                plan.highlighted
                  ? 'bg-[#161616] border-[#3a3a3a]'
                  : 'bg-[#020202] border-[#222226]'
              }`}
            >
              {/* Top: Icon + Name + Price */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#1e1e22] border border-[#2e2e34] rounded-lg flex items-center justify-center">
                      {plan.icon}
                    </div>
                    <span className="text-white text-lg font-semibold">
                      {plan.name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white text-3xl font-bold">
                      $
                      {billing === 'monthly'
                        ? plan.price.monthly
                        : plan.price.yearly}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-gray-300 text-sm mb-4">{plan.tagline}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="w-5 h-5 border border-[#333338] rounded-md flex items-center justify-center shrink-0">
                        <Plus size={12} className="text-gray-400" />
                      </span>
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-medium transition-all group ${
                  plan.highlighted
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-[#1e1e22] border border-[#2e2e34] text-white hover:bg-[#26262c]'
                }`}
              >
                <span>Choose This Plan</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;




