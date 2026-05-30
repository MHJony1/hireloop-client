const CTA = () => {
  return (
    <section className="relative bg-black overflow-hidden py-24">
      {/* Globe Container */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: '1000px',
          height: '1000px',
          bottom: '-500px',
        }}
      >
        {/* Glow background circle */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, #6d4fe0 0%, #4f35d2 15%, #3b28a8 30%, #1e1560 55%, #080620 75%, transparent 90%)',
          }}
        />

        {/* SVG Grid lines clipped inside circle */}
        <svg
          className="absolute inset-0"
          width="1000"
          height="1000"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="globeClip">
              <circle cx="500" cy="500" r="498" />
            </clipPath>
          </defs>

          <g clipPath="url(#globeClip)" opacity="0.3">
            {/* Horizontal latitude arc lines */}
            {[420, 360, 300, 240, 190, 150, 115, 85].map((y, i) => {
              const cx = 500;
              const cy = 1000;
              const r = Math.sqrt((cx - 0) ** 2 + (cy - y) ** 2);
              return (
                <circle
                  key={`lat-${i}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="#c4b5fd"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* Vertical longitude lines radiating from bottom */}
            {Array.from({ length: 13 }, (_, i) => {
              const angle = -90 + (i - 6) * 15;
              const rad = (angle * Math.PI) / 180;
              const x2 = 500 + 1200 * Math.cos(rad);
              const y2 = 1000 + 1200 * Math.sin(rad);
              return (
                <line
                  key={`lon-${i}`}
                  x1="500"
                  y1="1000"
                  x2={x2}
                  y2={y2}
                  stroke="#c4b5fd"
                  strokeWidth="0.8"
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Left & Right dark fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, black 75%)',
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-4 max-w-2xl">
          Your next role is
          <br />
          already looking for you
        </h2>

        <p className="text-gray-400 text-sm mb-10 max-w-md">
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </p>

        <div className="flex items-center gap-3">
          <button className="bg-white text-black text-sm font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition-all">
            Create a free account
          </button>
          <button className="text-white text-sm font-medium px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all">
            View pricing
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
