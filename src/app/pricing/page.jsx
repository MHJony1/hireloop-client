'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, Building2, Star, ArrowRight } from 'lucide-react';

const jobSeekerPlans = [
  {
    name: 'Free',
    id: 'seeker_free',
    price: '$0',
    period: 'forever',
    description: 'Get started and explore opportunities',
    badge: null,
    features: [
      'Browse & save up to 10 jobs',
      'Apply to up to 3 jobs per month',
      'Basic profile',
      'Email alerts',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    highlight: false,
    isFree: true,
  },
  {
    name: 'Pro',
    id: 'seeker_pro',
    price: '$19',
    period: 'per month',
    description: 'For active job seekers serious about landing their next role',
    badge: 'Most Popular',
    features: [
      'Apply to up to 30 jobs per month',
      'Unlimited saved jobs',
      'Application tracking',
      'Salary insights',
    ],
    cta: 'Start Pro',
    href: '/auth/signup?plan=pro',
    highlight: true,
    isFree: false,
  },
  {
    name: 'Premium',
    id: 'seeker_premium',
    price: '$39',
    period: 'per month',
    description: 'Maximum visibility and priority access',
    badge: null,
    features: [
      'Everything in Pro',
      'Unlimited applications',
      'Profile boost to recruiters',
      'Early access to new jobs',
      'Priority support',
    ],
    cta: 'Go Premium',
    href: '/auth/signup?plan=premium',
    highlight: false,
    isFree: false,
  },
];

const recruiterPlans = [
  {
    name: 'Free',
    id: 'recruiter_free',
    price: '$0',
    period: 'forever',
    description: "Perfect for a company's first year of hiring",
    badge: null,
    features: [
      'Up to 3 active job posts',
      'Basic applicant management',
      'Standard listing visibility',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    highlight: false,
    isFree: true,
  },
  {
    name: 'Growth',
    id: 'recruiter_growth',
    price: '$49',
    period: 'per month',
    description: 'Scale your hiring with powerful tools',
    badge: 'Most Popular',
    features: [
      'Up to 10 active job posts',
      'Applicant tracking',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start Growth',
    href: '/auth/signup?plan=growth',
    highlight: true,
    isFree: false,
  },
  {
    name: 'Enterprise',
    id: 'recruiter_enterprise',
    price: '$149',
    period: 'per month',
    description: 'For teams that hire at scale',
    badge: null,
    features: [
      'Up to 50 active job posts',
      'Advanced analytics dashboard',
      'Featured job listings',
      'Team collaboration',
      'Custom branding',
      'Priority support',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    highlight: false,
    isFree: false,
  },
];

const PlanCard = ({ plan }) => (
  <div
    className={`relative flex flex-col rounded-2xl p-6 transition-all duration-300 ${
      plan.highlight
        ? 'border border-indigo-500/60 bg-gradient-to-b from-indigo-950/60 to-gray-900/80 shadow-xl shadow-indigo-500/10'
        : 'border border-gray-800 bg-gray-900/40 hover:border-gray-700'
    }`}
  >
    {plan.badge && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white">
          <Star size={10} fill="currentColor" /> {plan.badge}
        </span>
      </div>
    )}

    <div className="mb-6">
      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
      <p className="mt-1 text-sm text-gray-400">{plan.description}</p>
    </div>

    <div className="mb-6">
      <div className="flex items-end gap-1">
        <span className="text-4xl font-bold text-white">{plan.price}</span>
        <span className="mb-1 text-sm text-gray-500">/{plan.period}</span>
      </div>
    </div>

    <ul className="mb-8 flex-1 space-y-3">
      {plan.features.map((feature) => (
        <li
          key={feature}
          className="flex items-start gap-2.5 text-sm text-gray-300"
        >
          <span
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
              plan.highlight
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            <Check size={10} strokeWidth={3} />
          </span>
          {feature}
        </li>
      ))}
    </ul>

    {plan.isFree ? (
      // Free plan — simple link, no Stripe checkout needed
      <Link
        href={plan.href}
        className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${
          plan.highlight
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
            : 'border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800'
        }`}
      >
        {plan.cta}
      </Link>
    ) : (
      // Paid plan — POST to Stripe checkout
      <form action="/api/checkout_sessions" method="POST">
        <input type="hidden" name="plan_id" value={plan.id} />
        <button
          type="submit"
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${
            plan.highlight
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
              : 'border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800'
          }`}
        >
          {plan.cta}
          <ArrowRight size={14} />
        </button>
      </form>
    )}
  </div>
);

const PricingPage = () => {
  const [tab, setTab] = useState('jobseeker');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Simple,{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              transparent
            </span>{' '}
            pricing
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Choose the plan that fits how you use HireLoop.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="flex rounded-2xl border border-gray-800 bg-gray-900/60 p-1">
            <button
              onClick={() => setTab('jobseeker')}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                tab === 'jobseeker'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap size={15} />
              For Job Seekers
            </button>
            <button
              onClick={() => setTab('recruiter')}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                tab === 'recruiter'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Building2 size={15} />
              For Recruiters
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 sm:grid-cols-3">
          {(tab === 'jobseeker' ? jobSeekerPlans : recruiterPlans).map(
            (plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ),
          )}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-sm text-gray-500">
          All plans include a 14-day free trial. No credit card required.{' '}
          <Link
            href="/contact"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Questions? Talk to us →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
