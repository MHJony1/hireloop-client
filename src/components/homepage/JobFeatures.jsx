import {
  Search,
  TrendingUp,
  Building2,
  Bookmark,
  MousePointerClick,
  FileText,
  SlidersHorizontal,
  BarChart2,
} from 'lucide-react';

const features = [
  {
    icon: <Search size={20} className="text-violet-400" />,
    title: 'Smart Search',
    desc: 'Find your ideal job with advanced filters.',
  },
  {
    icon: <TrendingUp size={20} className="text-violet-400" />,
    title: 'Salary Insights',
    desc: 'Get real salary data to negotiate confidently.',
  },
  {
    icon: <Building2 size={20} className="text-violet-400" />,
    title: 'Top Companies',
    desc: 'Apply to vetted companies that are hiring.',
  },
  {
    icon: <Bookmark size={20} className="text-violet-400" />,
    title: 'Saved Jobs',
    desc: 'Manage apps & favorites on your dashboard.',
  },
  {
    icon: <MousePointerClick size={20} className="text-violet-400" />,
    title: 'One-Click Apply',
    desc: 'Simplify your job applications for an easier process!',
  },
  {
    icon: <FileText size={20} className="text-violet-400" />,
    title: 'Resume Builder',
    desc: 'Create professional resumes with modern templates.',
  },
  {
    icon: <SlidersHorizontal size={20} className="text-violet-400" />,
    title: 'Skill-Based Matching',
    desc: 'Discover jobs that match your skills and experience.',
  },
  {
    icon: <BarChart2 size={20} className="text-violet-400" />,
    title: 'Career Growth Resources',
    desc: 'Boost your career with quick interview tips.',
  },
];

const JobFeatures = () => {
  return (
    <section className="bg-[#111113] px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 bg-violet-700 rounded-sm inline-block" />
          <span className="text-[11px] tracking-widest uppercase text-violet-400 font-medium">
            Features Job
          </span>
          <span className="w-1.5 h-1.5 bg-violet-700 rounded-sm inline-block" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-4xl font-semibold text-white leading-snug mb-12">
          Everything you need
          <br />
          to succeed
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* Icon Box */}
              <div className="w-11 h-11 min-w-11 bg-[#1c1c20] border border-[#2a2a30] rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              {/* Text */}
              <div>
                <p className="text-[15px] font-semibold text-[#f1f1f3] mb-1 leading-snug">
                  {feature.title}
                </p>
                <p className="text-[13px] text-[#6b6b78] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobFeatures;
