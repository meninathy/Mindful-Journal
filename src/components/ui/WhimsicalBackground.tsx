export function WhimsicalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Large blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-mindful-pink/20 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-mindful-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-mindful-lavender/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      {/* Stars */}
      {[
        { top: '10%', left: '15%', size: 12, delay: '0s' },
        { top: '20%', left: '80%', size: 8, delay: '1s' },
        { top: '60%', left: '8%', size: 10, delay: '2s' },
        { top: '75%', left: '70%', size: 14, delay: '0.5s' },
        { top: '40%', left: '90%', size: 8, delay: '3s' },
        { top: '85%', left: '25%', size: 10, delay: '1.5s' },
      ].map((star, i) => (
        <svg
          key={i}
          className="absolute animate-float opacity-40"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size, animationDelay: star.delay }}
          viewBox="0 0 24 24"
          fill="#FFADDE"
        >
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      ))}

      {/* Small circles */}
      {[
        { top: '30%', left: '5%', color: '#95F0C5' },
        { top: '55%', left: '95%', color: '#ACBEFC' },
        { top: '90%', left: '50%', color: '#FFADDE' },
      ].map((dot, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full opacity-50 animate-pulse-soft"
          style={{ top: dot.top, left: dot.left, background: dot.color, animationDelay: `${i * 0.7}s` }}
        />
      ))}
    </div>
  )
}
