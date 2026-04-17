import { FileText } from "lucide-react";

const items = [
  {
    title: "Our Philosophy",
    text: "At SSI, technology should simplify work, not complicate it. We design instruments with clear optics, reliable illumination, and intuitive operation to deliver consistent results across users and environments.",
  },
  {
    title: "Who We Serve",
    text: "Sustainability and reliability guide our design. We focus on durable, repairable, and energy-efficient instruments that support responsible lab operations and lower total ownership costs.",
  },
  {
    title: "Our Commitment",
    text: "We work with universities, hospitals, research institutes, diagnostic labs, educators, and industrial QC teams who need accurate, easy-to-maintain instruments they can trust long term.",
  },
  {
    title: "Looking Forward",
    text: "We continue to refine our technologies to meet evolving scientific needs, delivering dependable tools that support research, diagnostics, and education with precision and trust.",
  },
];

export default function AboutValuesSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-4">
              
              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B2B6F] flex items-center justify-center">
                  <FileText className="text-white w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[#0B2B3C] text-[17px]">
                  {item.title}
                </h3>
              </div>

              {/* Text */}
              <p className="text-[#6B7280] text-[14px] leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
