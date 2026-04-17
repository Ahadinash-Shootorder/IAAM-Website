"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Eye, EyeOff, Trash2, Save } from "lucide-react";
import HeroBannerEditor from "@/components/HeroBannerEditor";
import FeaturedCategoriesEditor from "@/components/FeaturedCategoriesEditor";
import CTABannerEditor from "@/components/CTABannerEditor";
import SingleFeaturedProductEditor from "@/components/SingleFeaturedProductEditor";
import MultipleFeaturedProductEditor from "@/components/MultipleFeaturedProductEditor";
import ApplicationAreaEditor from "@/components/ApplicationAreaEditor";
import BlogSectionEditor from "@/components/BlogSectionEditor";
import GenericContentEditor from "@/components/GenericContentEditor";

const SECTION_CONFIG = [
  {
    key: "hero_banner",
    title: "Banner",
    description: "Main hero banner with heading and CTA",
    editor: HeroBannerEditor,
  },
  {
    key: "hero_cards",
    title: "Featured Categories",
    description: "Cards with category information",
    editor: FeaturedCategoriesEditor,
  },
  {
    key: "new_release",
    title: "Third Fold",
    description: "New release or featured content section",
    editor: GenericContentEditor,
    editorProps: { showImage: true },
  },
  {
    key: "second_featured",
    title: "CTA Banner",
    description: "Call-to-action banner section",
    editor: CTABannerEditor,
  },
  {
    key: "featured_products",
    title: "Multiple Featured Products",
    description: "Display multiple featured products",
    editor: MultipleFeaturedProductEditor,
  },
  {
    key: "application_area",
    title: "Six Fold (Application Areas)",
    description: "Show product application areas",
    editor: ApplicationAreaEditor,
  },
  {
    key: "blog_section",
    title: "Seven Fold (Blog Section)",
    description: "Display latest blog posts",
    editor: BlogSectionEditor,
  },
];

const getDefaultDataForSection = (sectionKey) => {
  const defaults = {
    hero_banner: {
      title: "",
      description: "",
      autoplay: true,
      autoplayDuration: 5,
      showDots: true,
      showArrows: true,
      overlayColor: "rgba(0, 0, 0, 0.2)",
      slides: [],
      features: [],
    },
    hero_cards: {
      categories: [],
    },
    new_release: {
      title: "",
      heading: "",
      description: "",
      content: "",
      image: "",
      buttonLabel: "",
      buttonUrl: "",
    },
    second_featured: {
      heading: "",
      description: "",
      buttonLabel: "",
      buttonUrl: "",
      bannerImage: "",
      overlayColor: "rgba(0, 0, 0, 0.3)",
    },
    featured_products: {
      products: [],
      itemsPerRow: 3,
    },
    application_area: {
      areas: [],
    },
    blog_section: {
      title: "",
      description: "",
      postsToShow: 3,
      showViewAllButton: true,
    },
  };
  return defaults[sectionKey] || {};
};

export default function HomeSectionsAdmin() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [savingSection, setSavingSection] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadAndEnsureSections();
  }, []);

  const loadAndEnsureSections = async () => {
    try {
      // First, fetch all visible sections
      const res = await fetch("/api/home-sections");
      const visibleSections = await res.json();
      console.log("Fetched visible sections:", visibleSections.map(s => s.sectionKey));

      let allSections = [...visibleSections];

      // Check each section in SECTION_CONFIG to ensure it exists
      for (const config of SECTION_CONFIG) {
        const exists = allSections.some((s) => s.sectionKey === config.key);
        if (!exists) {
          console.log(`Section ${config.key} not found in visible sections, fetching...`);
          try {
            // Try to fetch the section directly (might be hidden)
            const getRes = await fetch(`/api/home-sections/${config.key}`);
            if (getRes.ok) {
              const section = await getRes.json();
              console.log(`Found hidden section: ${config.key}, setting visible...`);
              // Section exists but is hidden, update to visible
              const updateRes = await fetch(`/api/home-sections/${config.key}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...section,
                  isVisible: true,
                }),
              });
              if (updateRes.ok) {
                const updatedSection = await updateRes.json();
                allSections.push(updatedSection);
              }
            } else {
              // Section doesn't exist, create it with default data
              console.log(`Creating new section: ${config.key}`);
              const defaultData = getDefaultDataForSection(config.key);
              const createRes = await fetch("/api/home-sections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  sectionKey: config.key,
                  title: config.title,
                  description: config.description,
                  content: "Add content here...",
                  data: JSON.stringify(defaultData),
                  order: SECTION_CONFIG.findIndex((s) => s.key === config.key),
                  isVisible: true,
                }),
              });
              if (createRes.ok) {
                const newSection = await createRes.json();
                allSections.push(newSection);
              }
            }
          } catch (error) {
            console.error(`Error handling section ${config.key}:`, error);
          }
        }
      }

      console.log("Final sections:", allSections.map(s => s.sectionKey));
      setSections(allSections);

      // Initialize edit data with all sections
      const initialEditData = {};
      allSections.forEach((section) => {
        initialEditData[section.sectionKey] = { ...section };
      });
      console.log("EditData keys:", Object.keys(initialEditData));
      setEditData(initialEditData);
    } catch (error) {
      console.error("Error loading sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/home-sections");
      const data = await res.json();
      setSections(data);
      // Initialize edit data
      const initialEditData = {};
      data.forEach((section) => {
        initialEditData[section.sectionKey] = {
          ...section,
        };
      });
      setEditData(initialEditData);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const initializeSections = async () => {
    for (const config of SECTION_CONFIG) {
      const exists = sections.some((s) => s.sectionKey === config.key);
      if (!exists) {
        try {
          await fetch("/api/home-sections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sectionKey: config.key,
              title: config.title,
              description: config.description,
              content: "Add content here...",
              data: JSON.stringify({}),
              order: SECTION_CONFIG.findIndex((s) => s.key === config.key),
              isVisible: true,
            }),
          });
        } catch (error) {
          console.error(`Error creating section ${config.key}:`, error);
        }
      }
    }
    fetchSections();
  };

  const toggleExpanded = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDataChange = (key, newData) => {
    setEditData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        data: newData,
      },
    }));
  };

  const handleSaveSection = async (key) => {
    setSavingSection(key);
    try {
      const currentData = editData[key];
      const res = await fetch(`/api/home-sections/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentData.title,
          description: currentData.description,
          content: currentData.content,
          data: currentData.data,
          order: currentData.order,
          isVisible: currentData.isVisible,
        }),
      });

      if (res.ok) {
        // Update local sections state
        setSections((prev) =>
          prev.map((section) =>
            section.sectionKey === key ? currentData : section
          )
        );
      } else {
        alert("Error saving section");
      }
    } catch (error) {
      console.error("Error saving section:", error);
      alert("Error saving section");
    } finally {
      setSavingSection(null);
    }
  };

  const toggleVisibility = async (key) => {
    const section = editData[key];
    const updated = { ...section, isVisible: !section.isVisible };

    try {
      const res = await fetch(`/api/home-sections/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updated.title,
          description: updated.description,
          content: updated.content,
          data: updated.data,
          order: updated.order,
          isVisible: updated.isVisible,
        }),
      });

      if (res.ok) {
        setEditData((prev) => ({
          ...prev,
          [key]: updated,
        }));
        setSections((prev) =>
          prev.map((section) =>
            section.sectionKey === key ? updated : section
          )
        );
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const deleteSection = async (key) => {
    if (confirm("Delete this section?")) {
      try {
        const res = await fetch(`/api/home-sections/${key}`, {
          method: "DELETE",
        });

        if (res.ok) {
          fetchSections();
        } else {
          alert("Error deleting section");
        }
      } catch (error) {
        console.error("Error deleting section:", error);
        alert("Error deleting section");
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Home Page Editor</h1>
          <p className="text-gray-600 mt-1">
            Edit all homepage sections in one place
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Loaded: {sections.length} sections
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchSections()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
          {sections.length === 0 && (
            <button
              onClick={initializeSections}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Initialize All Sections
            </button>
          )}
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No sections created yet</p>
          <button
            onClick={initializeSections}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Create Default Sections
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {SECTION_CONFIG.map((config) => {
            const section = editData[config.key];

            // Debug logging
            if (config.key === "hero_banner") {
              console.log("hero_banner config found, editData has:", Object.keys(editData));
              console.log("hero_banner section data:", section);
            }

            if (!section) {
              console.warn(`Section not found: ${config.key}`);
              return null;
            }

            const isExpanded = expandedSections[config.key];
            const EditorComponent = config.editor;

            return (
              <div
                key={config.key}
                className={`bg-white rounded-lg shadow overflow-hidden transition-all ${
                  !section.isVisible ? "opacity-60" : ""
                }`}
              >
                {/* Section Header */}
                <div
                  className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleExpanded(config.key)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <ChevronDown
                      size={20}
                      className={`text-gray-600 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {config.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {config.description}
                      </p>
                      {!section.isVisible && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded mt-1 inline-block">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleVisibility(config.key)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition"
                      title={section.isVisible ? "Hide" : "Show"}
                    >
                      {section.isVisible ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteSection(config.key)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Section Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-6">
                    {EditorComponent && (
                      <EditorComponent
                        data={section.data}
                        onChange={(newData) =>
                          handleDataChange(config.key, newData)
                        }
                        {...(config.editorProps || {})}
                      />
                    )}

                    {/* Save Button */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleSaveSection(config.key)}
                        disabled={savingSection === config.key}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition"
                      >
                        <Save size={18} />
                        {savingSection === config.key ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
