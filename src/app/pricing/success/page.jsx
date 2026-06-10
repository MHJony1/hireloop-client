import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Mail, ArrowRight } from 'lucide-react';
import { createSubscription } from '@/lib/actions/subscription';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)');

  const {
    status,
    customer_details: { email: customerEmail },
    metadata,
    line_items,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    const planName =
      line_items?.data?.[0]?.description ?? metadata?.planId ?? 'your plan';

    const subsInfo = {
      email: customerEmail,
      planId: metadata.planId,
    };
    //update the user table about the new plan
    const result = await createSubscription(subsInfo);
    console.log(result);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-center shadow-2xl">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/30">
                <CheckCircle2 className="h-10 w-10 text-indigo-400" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-white">
              You&apos;re all set! 🎉
            </h1>
            <p className="mt-2 text-gray-400 text-sm">
              Welcome to{' '}
              <span className="text-indigo-400 font-medium">{planName}</span>.
              Your subscription is now active.
            </p>

            {/* Divider */}
            <div className="my-6 border-t border-gray-800" />

            {/* Email confirmation */}
            <div className="flex items-center gap-3 rounded-xl bg-gray-800/50 border border-gray-700 px-4 py-3">
              <Mail className="h-4 w-4 shrink-0 text-gray-400" />
              <p className="text-sm text-gray-300 text-left">
                Confirmation sent to{' '}
                <span className="font-medium text-white">{customerEmail}</span>
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Go to Dashboard <ArrowRight size={15} />
              </Link>
              <Link
                href="/"
                className="rounded-xl border border-gray-700 bg-gray-800/50 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-gray-800 hover:text-white"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Support note */}
          <p className="mt-6 text-center text-xs text-gray-600">
            Need help?{' '}
            <a
              href="mailto:support@hireloop.com"
              className="text-indigo-500 hover:text-indigo-400"
            >
              Contact support →
            </a>
          </p>
        </div>
      </div>
    );
  }
}
