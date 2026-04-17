const SectionContainer = ({ children, className = "", bgColor = "bg-white" }: { children: React.ReactNode; className?: string; bgColor?: string }) => (
  <section className={`py-16 ${bgColor} ${className}`}>
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  </section>
);

export default SectionContainer