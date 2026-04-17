"use client";

export default function ProductOverviewSections({ sections }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return (
    <div className="space-y-20 mt-10 ">
      {sections.map((section, index) => {
        const isImageLeft = section.layout === "image-left";

        return (
          <div
            key={section.id || index}
            className={`flex flex-col lg:flex-row items-center gap-12
                        border border-gray-200 rounded-2xl
                        bg-white shadow-sm
                        p-8 lg:p-12
                        transition-all duration-300 hover:shadow-md
                        ${!isImageLeft ? "lg:flex-row-reverse" : ""}
                      `}
          >
            {/* IMAGE */}
            {section.image && (
              <div className="w-full lg:w-1/2">
                <img
                  src={section.image}
                  alt={section.heading}
                  className="w-full h-auto rounded-xl object-cover shadow-lg"
                />
              </div>
            )}

            {/* CONTENT */}
            <div className="w-full lg:w-1/2">
              {section.heading && (
                <h3 className="text-2xl lg:text-3xl font-semibold mb-4">
                  {section.heading}
                </h3>
              )}

              {section.text && (
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: section.text,
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
