export interface DropdownSection {
  header: string;
  headerUrl?: string;
  links?: { text: string; url: string }[];
}

export interface DropdownDataItem {
  card: {
    image: string;
    title: string;
    description: string;
    cta: string;
    ctaUrl: string;
  };
  title: string;
  description: string;
  outlineCta?: string;
  outlineCtaUrl?: string;
  rightLinks?: { header: string; headerUrl?: string; links: string[] }[];
  columns: DropdownSection[][];
}

export const dropdownData: DropdownDataItem[] = [
  // 0: Membership
  {
    card: {
      image: "Dropdown/Membership.jpg",
      title: "Shaping the Future of Advanced Materials — Together",
      description: "Advance your career, institution, or organization within IAAM's global ecosystem of Advanced Materials science, technology, and sustainability.",
      cta: "Join or Renew Membership",
      ctaUrl: "/join-iaam",
    },
    title: "Membership",
    description: "Become part of a truly global IAAM ecosystem spanning 150+ countries, 250,000+ researchers & professionals, 5000+ institutions & industries, and 80+ National Councils, Societies, and International Charters, enabling local collaboration with global impact.",
    outlineCta: "Learn More About Membership",
    outlineCtaUrl: "/join-iaam",
    columns: [
      [
        {
          header: "Join IAAM As An Individual",
          links: [
            { text: "Who Can Join IAAM", url: "/who-can-join-iaam" },
            { text: "Join As a Professional", url: "/join-as-a-professional" },
            { text: "Join As a Student", url: "/join-as-a-student" },
            { text: "Student & Emerging Talent Programs", url: "/student-and-emerging-talent-programs-1" },
            { text: "Membership Regulations", url: "/membership-regulations" },
            { text: "IAAM Code Of Conduct", url: "/iaam-code-of-conduct" },
            { text: "Developing Countries Engagement", url: "/developing-countries-engagement" },
          ],
        },
      ],
      [
        {
          header: "Institution & Industry",
          links: [
            { text: "How Can One Join As An Academic Institute, An Industry, And A Government Institution", url: "/how-to-join-institution" },
            { text: "Join As An Academic & Research Institution", url: "/join-academic-research-institution" },
            { text: "Join As An Industry & Corporate", url: "/join-industry-corporate" },
            { text: "Join As A Government & Public Institution", url: "/join-government-public-institution" },
          ],
        },
        { header: "Join A Society", headerUrl: "/join-society" },
        { header: "Join A Council", headerUrl: "/join-council" },
        { header: "Apply For Student Chapter", headerUrl: "/apply-student-chapter" },
      ],
      [
        {
          header: "Nomination For IAAM Fellow",
          links: [
            { text: "Fellow & Honors", url: "/fellow-honors" },
          ],
        },
        {
          header: "Membership & Subscription Catalog",
          links: [
            { text: "Membership Fees", url: "/membership-fees" },
          ],
        },
        {
          header: "Membership Benefits",
          links: [
            { text: "All Benefits", url: "/membership-benefits" },
          ],
        },
        {
          header: "Life Time Membership Program",
          headerUrl: "/lifetime-membership-program",
        },
        {
          header: "Manage Your Membership",
          links: [
            { text: "Renew Your Membership", url: "/renew-membership" },
            { text: "FAQs - IAAM Membership", url: "/faqs-membership" },
          ],
        },
        { header: "Contact Membership Office", headerUrl: "/contact-membership-office" },
      ],
    ],
  },
  // 1: Meetings & Events
  {
    card: {
      image: "Dropdown/Meeting-Events.jpg",
      title: "Advancing Materials Through Global Collaboration",
      description: "Bringing Together Researchers, Industry Leaders, Policymakers, And Innovators To Accelerate Progress In Advanced Materials, Sustainability, And Technological Innovation.",
      cta: "Submit Conference Proposal",
      ctaUrl: "/submit-conference-proposal",
    },
    title: "Meeting & Events",
    description: "IAAM Has Brought Together 30,000+ Delegates From Over 125 Countries Across 75+ Global Congress Assemblies In Europe, America, Asia & Australia, And 2,500+ Sessions And Symposia. IAAM Meetings & Events Serve As A Global Platform For Scientific Exchange And Collaboration In Materials Science, Engineering, And Technology. These Forums Connect Academia, Industry, Policymakers, And Innovators To Translate Research Into Real-World Impact.",
    outlineCta: "Explore IAAM Meetings & Events",
    outlineCtaUrl: "/meetings-events",
    rightLinks: [
      { header: "Find An IAAM Conference Or Event Near You", headerUrl: "/find-conference", links: [] },
      { header: "Upcoming Conferences", headerUrl: "/upcoming-conferences", links: [] },
      { header: "Virtual Events", headerUrl: "/virtual-events", links: [] },
      { header: "Plan A Conference", headerUrl: "/plan-conference", links: [] },
      { header: "Conference Application", headerUrl: "/conference-application", links: [] },
    ],
    columns: [
      [
        {
          header: "Advance Material Congress",
          links: [
            { text: "Advanced Materials World Congress", url: "/advanced-materials-world-congress" },
            { text: "European Advanced Materials Congress", url: "/european-advanced-materials-congress" },
            { text: "American Advanced Materials Congress", url: "/american-advanced-materials-congress" },
            { text: "Asian Advanced Materials Congress", url: "/asian-advanced-materials-congress" },
            { text: "Australian Advanced Materials Congress", url: "/australian-advanced-materials-congress" },
          ],
        },
        { header: "Baltic Conference Series", headerUrl: "/baltic-conference-series" },
        { header: "World Congress Series", headerUrl: "/world-congress-series" },
        {
          header: "International Conclaves",
          links: [
            { text: "International Conclave On Materials, Energy & Climate", url: "/international-conclave-materials-energy-climate" },
          ],
        },
        {
          header: "Thematic & Specialized Events",
          links: [
            { text: "Advanced Nanomaterials Congress", url: "/advanced-nanomaterials-congress" },
            { text: "Advanced Composite Materials Congress", url: "/advanced-composite-materials-congress" },
            { text: "Energy Materials & Technology Conference", url: "/energy-materials-technology-conference" },
            { text: "Advanced Functional Materials Congress", url: "/advanced-functional-materials-congress" },
          ],
        },
      ],
      [
        {
          header: "Participate & Contribute",
          links: [
            { text: "Call For Event Proposals", url: "/call-for-event-proposals" },
            { text: "Invite A Thematic Session/ Symposium", url: "/invite-thematic-session-symposium" },
            { text: "Nominate A Speaker", url: "/nominate-speaker" },
            { text: "Nominate A Session / Symposium Chair", url: "/nominate-session-symposium-chair" },
            { text: "Join As Co-Host Or Supporting Organization", url: "/join-cohost-supporting-organization" },
            { text: "Sponsorship For IAAM Event", url: "/sponsorship-iaam-event" },
          ],
        },
        {
          header: "Lecture & Knowledge Platforms",
          links: [
            { text: "Advanced Materials Lecture Series", url: "/advanced-materials-lecture-series" },
            { text: "Video Proceedings Of Advanced Materials", url: "/video-proceedings-advanced-materials" },
          ],
        },
        { header: "Online & Hybrid Events", headerUrl: "/online-hybrid-events" },
        { header: "Advanced Materials WebCongress™", headerUrl: "/advanced-materials-webcongress" },
        { header: "Live Knowledge At Web™", headerUrl: "/live-knowledge-web" },
        {
          header: "Online LIVE & WebEvents",
          links: [
            { text: "Web Conferences", url: "/web-conferences" },
            { text: "WebSymposia", url: "/web-symposia" },
            { text: "WebSchools", url: "/web-schools" },
          ],
        },
      ],
      [
        {
          header: "Support & Information",
          links: [
            { text: "Event Guidelines", url: "/event-guidelines" },
            { text: "FAQs – IAAM Meetings & Events", url: "/faqs-meetings-events" },
            { text: "Apply For Conference Grant", url: "/apply-conference-grant" },
            { text: "IAAM Code Of Conduct", url: "/iaam-code-of-conduct-1" },
            { text: "Developing Countries Engagement", url: "/developing-countries-engagement" },
          ],
        },
        {
          header: "Past & Reports",
          links: [
            { text: "Past Conference Reports", url: "/past-conference-reports" },
          ],
        },
        { header: "Quick Actions" },
        { header: "View Upcoming Events", headerUrl: "/view-upcoming-events" },
        { header: "Submit Event Proposal", headerUrl: "/submit-event-proposal" },
        { header: "Contact Meetings & Events Office", headerUrl: "/contact-meetings-events-office" },
      ],
    ],
  },
  // 2: Innovation & Sustainability
  {
    card: {
      image: "Dropdown/Innovation-Sustainability.jpg",
      title: "Inspiring Global Innovation Through Advanced Materials",
      description: "Connecting Research, Industry, And Policy To Transform Ideas Into Sustainable, Real-World Impact.",
      cta: "Join R&D World Links",
      ctaUrl: "/join-r-and-d-world-links",
    },
    title: "Innovation & Sustainability",
    description: "IAAM Drives The Translation Of Advanced Materials Research Into Real-World Impact, Supporting Global Goals In Sustainability, Climate Neutrality, And Responsible Innovation.",
    outlineCta: "Discover IAAM's Innovation & Sustainability Initiatives",
    outlineCtaUrl: "/innovation-sustainability-initiatives",
    columns: [
      [
        {
          header: "Innovation Platforms",
          links: [
            { text: "Translational Research & Innovation Programs", url: "/translational-research-innovation-programs" },
            { text: "Industry–Academia Collaboration Platforms", url: "/industry-academia-collaboration-platforms" },
            { text: "Technology Transfer & Scale-up Initiatives", url: "/technology-transfer-scaleup-initiatives" },
            { text: "Startup, SME & Innovation Hub Engagement", url: "/startup-sme-innovation-hub-engagement" },
          ],
        },
        {
          header: "Sustainability & Net-Zero Initiatives",
          links: [
            { text: "Net-Zero Materials & Technologies", url: "/net-zero-materials-technologies" },
            { text: "Climate-Neutral R&D Programs", url: "/climate-neutral-rd-programs" },
            { text: "Circular Economy & Sustainable Manufacturing", url: "/circular-economy-sustainable-manufacturing" },
            { text: "Energy Transition & Green Technologies", url: "/energy-transition-green-technologies" },
          ],
        },
        {
          header: "Global Consortia & Partnerships",
          links: [
            { text: "R&D World Links & Consortia", url: "/rd-world-links-consortia" },
            { text: "Cross-Sector Global Partnerships", url: "/cross-sector-global-partnerships" },
            { text: "Regional & International Innovation Networks", url: "/regional-international-innovation-networks" },
          ],
        },
        {
          header: "Policy, Strategy & Impact",
          links: [
            { text: "Science-Policy Dialogue", url: "/science-policy-dialogue" },
            { text: "Sustainability Strategy & Foresight", url: "/sustainability-strategy-foresight" },
            { text: "Climate Action & Global Framework Alignment", url: "/climate-action-global-framework-alignment" },
            { text: "Societal & Environmental Impact Programs", url: "/societal-environmental-impact-programs" },
          ],
        },
        {
          header: "Education & Capacity Building",
          links: [
            { text: "Innovation & Sustainability Training Programs", url: "/innovation-sustainability-training-programs" },
            { text: "Student & Early-Career Innovation Pathways", url: "/student-early-career-innovation-pathways" },
            { text: "Leadership & Skills Development", url: "/leadership-skills-development" },
          ],
        },
      ],
      [
        {
          header: "Get Involved",
          links: [
            { text: "IAAM Invites Researchers, Institutions, Industries, Startups, And Policymakers To:", url: "/iaam-invites-researchers-institutions-industries-startups-and-policymakers-to" },
            { text: "Join Innovation And Sustainability Programs", url: "/join-innovation-sustainability-programs" },
            { text: "Participate In Global Consortia And Pilots", url: "/participate-global-consortia-pilots" },
            { text: "Collaborate On Net-Zero And Climate Initiatives", url: "/collaborate-net-zero-climate-initiatives" },
            { text: "Contribute To Policy Dialogue And Strategic Foresight", url: "/contribute-policy-dialogue-strategic-foresight" },
          ],
        },
        {
          header: "Join Innovation & Sustainability",
          links: [
            { text: "Advance responsible innovation and sustainable technologies through global collaboration and action.", url: "/advance-responsible-innovation-and-sustainable-technologies-through-global-collaboration-and-action" },
          ],
        },
        { header: "Explore Innovation Programs", headerUrl: "/explore-innovation-programs" },
        { header: "Join Sustainability Initiatives", headerUrl: "/join-sustainability-initiatives" },
        // { header: "WebCongress™", headerUrl: "/webcongress" },
        { header: "Contact Innovation & Sustainability Office", headerUrl: "/contact-innovation-sustainability-office" },
      ],
    ],
  },
  // 3: Journal & Proceedings
  {
    card: {
      image: "Dropdown/Journal-Proceedings.jpg",
      title: "Advancing Knowledge through Highly Ranked Trusted Researchers",
      description: "Providing open-access, peer-reviewed journals and proceedings that support rigorous research, transparency, and global knowledge sharing.",
      cta: "Submit Article",
      ctaUrl: "/submit-article-1",
    },
    title: "Journal & Proceedings",
    description: "IAAM Publishes Nonprofit, Peer-Reviewed Journals, Conference Proceedings, And Technical Literature, Including Research Articles, Video Lectures, White Papers, Books, And Case Studies.",
    outlineCta: "Learn More About IAAM's Literature",
    outlineCtaUrl: "/iaam-literature",
    columns: [
      [
        {
          header: "Technical Publications",
          links: [
            { text: "Advanced Materials Letters", url: "/advanced-materials-letters" },
            { text: "Advanced Materials Proceedings", url: "/advanced-materials-proceedings" },
            { text: "Video Proceedings Of Advanced Materials", url: "/video-proceedings-advanced-materials" },
            { text: "Advanced Materials Charters", url: "/advanced-materials-charters" },
            { text: "IAAM Publications Recommender", url: "/iaam-publications-recommender" },
          ],
        },
      ],
      [
        {
          header: "Publish With IAAM",
          links: [
            { text: "Why Choose IAAM Publications?", url: "/why-choose-iaam-publications" },
            { text: "How To Publish With IAAM", url: "/how-to-publish-with-iaam" },
            { text: "Submit Proposal For Special Issue", url: "/submit-proposal-special-issue" },
            { text: "Nonprofit Publication", url: "/nonprofit-publication" },
            { text: "Open Access Solutions", url: "/open-access-solutions" },
            { text: "Submit An Article", url: "/submit-article" },
          ],
        },
      ],
      [
        { header: "IAAM Blog", headerUrl: "/iaam-blog" },
        {
          header: "Advanced Materials Video Lectures",
          links: [
            { text: "How To Join As A Publication Partner", url: "/join-publication-partner" },
            { text: "How To Join As Editor", url: "/join-as-editor" },
            { text: "Publication Guidelines", url: "/publication-guidelines" },
            { text: "FAQs – IAAM Publications", url: "/faqs-iaam-publications" },
          ],
        },
        { header: "Contact Editorial Office", headerUrl: "/contact-editorial-office" },
      ],
    ],
  },

  // 4: Awards & Recognition
  {
    card: {
      image: "Dropdown/Awards-Recognition1.jpg",
      title: "Celebrating Excellence. Inspiring Leadership. Advancing Scientific Impact.",
      description: "Celebrating Scientific Excellence And Leadership That Shape The Future Of Materials Research And Innovation.",
      cta: "Submit Award Nomination",
      ctaUrl: "/submit-award-nomination",
    },
    title: "Awards & Recognition",
    description: "IAAM Is Structured To Honour Excellence, Leadership, And Impact Across Individuals, Institutions, And Sectors, While Also Commemorating The Legacy Of Pioneer Scientists Who Shaped The Foundations Of Materials Science And Technology.",
    outlineCta: "Learn More about Awards & Recognition Program",
    outlineCtaUrl: "/awards-recognition-program",
    columns: [
      [
        {
          header: "Awards & Recognition Overview",
          links: [
            { text: "Awards & Recognitions At IAAM", url: "/awards-recognitions-iaam" },
            { text: "Why IAAM Awards Matter", url: "/why-iaam-awards-matter" },
          ],
        },
        {
          header: "Individual Awards",
          links: [
            { text: "Advanced Materials Laureate", url: "/advanced-materials-laureate" },
            { text: "Research Of The Year", url: "/research-of-the-year" },
            { text: "Advanced Materials Award", url: "/advanced-materials-award" },
            { text: "Innovation Award", url: "/innovation-award" },
            { text: "Lifetime Achievement Award", url: "/lifetime-achievement-award" },
            { text: "IAAM Scientist Award", url: "/iaam-scientist-award" },
            { text: "IAAM Medal", url: "/iaam-medal" },
            { text: "Scientist Medal", url: "/scientist-medal" },
            { text: "Mid-Career Excellence Award", url: "/mid-career-excellence-award" },
            { text: "Early-Career Researcher Award", url: "/early-career-researcher-award" },
            { text: "Young Scientist Award", url: "/young-scientist-award" },
          ],
        },
        {
          header: "Fellow & Honors",
          links: [
            { text: "IAAM Fellow (FIAAM)", url: "/iaam-fellow-fiaam" },
            { text: "Distinguished IAAM Fellow (DFIAAM)", url: "/distinguished-iaam-fellow-dfiaam" },
            { text: "Honorary & Special Fellowships", url: "/honorary-special-fellowships" },
          ],
        },
      ],
      [
        {
          header: "Academic & Research Institution Awards",
          links: [
            { text: "Excellence In Academic Research", url: "/excellence-academic-research" },
            { text: "Outstanding Research Institution", url: "/outstanding-research-institution" },
            { text: "University Leadership Award", url: "/university-leadership-award" },
            { text: "Emerging Research Institution Award", url: "/emerging-research-institution-award" },
          ],
        },
        {
          header: "Industry & Corporate Awards",
          links: [
            { text: "Industry Innovation Award", url: "/industry-innovation-award" },
            { text: "Excellence In Industrial R&D", url: "/excellence-industrial-rd" },
            { text: "Startup & Scale-Up Innovation Award", url: "/startup-scaleup-innovation-award" },
            { text: "Sustainable Technology & Innovation Award", url: "/sustainable-technology-innovation-award" },
          ],
        },
        {
          header: "Government & Public Institution Awards",
          links: [
            { text: "Excellence In Science Policy", url: "/excellence-science-policy" },
            { text: "Government Leadership In Innovation", url: "/government-leadership-innovation" },
            { text: "Public Institution Impact Award", url: "/public-institution-impact-award" },
            { text: "Sustainability & Net-Zero Leadership Award", url: "/sustainability-net-zero-leadership-award" },
          ],
        },
        {
          header: "Named Honors & Pioneer Scientist Awards",
          links: [
            { text: "Pioneer Scientist Memorial Awards", url: "/pioneer-scientist-memorial-awards" },
            { text: "Named Medals & Lectures", url: "/named-medals-lectures" },
            { text: "Legacy & Distinguished Honors", url: "/legacy-distinguished-honors" },
          ],
        },
        {
          header: "Thematic & Special Awards",
          links: [
            { text: "Sustainability & Climate Action Award", url: "/sustainability-climate-action-award" },
            { text: "Net-Zero Materials Award", url: "/net-zero-materials-award" },
            { text: "Interdisciplinary Research Excellence", url: "/interdisciplinary-research-excellence" },
            { text: "Education & Mentorship Award", url: "/education-mentorship-award" },
            { text: "Diversity & Global Engagement Award", url: "/diversity-global-engagement-award" },
          ],
        },
      ],
      [
        { header: "Nominate A Candidate", headerUrl: "/nominate-candidate" },
        { header: "View Awards Calendar", headerUrl: "/view-awards-calendar" },
        { header: "Contact IAAM Awards Office", headerUrl: "/contact-iaam-awards-office" },
        {
          header: "Nomination & Selection",
          links: [
            { text: "Nomination Guidelines", url: "/nomination-guidelines" },
            { text: "Eligibility Criteria", url: "/eligibility-criteria" },
            { text: "Evaluation & Selection Process", url: "/evaluation-selection-process" },
            { text: "Important Dates & Deadlines", url: "/important-dates-deadlines" },
          ],
        },
        {
          header: "Award Lectures & Ceremonies",
          links: [
            { text: "Award Lectures", url: "/award-lectures" },
            { text: "Recognition Ceremonies", url: "/recognition-ceremonies" },
            { text: "Fellow Summits & Special Sessions", url: "/fellow-summits-special-sessions" },
          ],
        },
        {
          header: "Past Awardees",
          links: [
            { text: "Awardee Directory", url: "/awardee-directory" },
            { text: "Past Honorees & Laureates", url: "/past-honorees-laureates" },
            { text: "Award Highlights & Citations", url: "/award-highlights-citations" },
          ],
        },
        {
          header: "Support & Information",
          links: [
            { text: "FAQs – IAAM Awards", url: "/faqs-iaam-awards" },
            { text: "IAAM Code Of Conduct", url: "/iaam-code-of-conduct" },
            { text: "Contact Awards & Recognition Office", url: "/contact-awards-recognition-office" },
          ],
        },
      ],
    ],
  },

  // 5: Discover IAAM
  {
    card: {
      image: "Dropdown/Discover-IAAM.jpeg",
      title: "Connecting Science. Innovation. Global Impact.",
      description: "IAAM Is A Global, Nonprofit Organization Dedicated To Advancing Materials Science, Engineering, And Technology Through Collaboration, Innovation, And Sustainability.",
      cta: "Collaborate with IAAM",
      ctaUrl: "/collaborate-with-iaam",
    },
    title: "Discover IAAM",
    description: "IAAM Operates In 150+ Countries, Engages Hundreds Of Thousands Of Researchers, Professionals, And Institutions, And Fosters Long-Term Partnerships To Address Global Challenges In Energy, Sustainability, Health, And Advanced Technologies.",
    outlineCta: "Read More about IAAM",
    outlineCtaUrl: "/about-iaam",
    columns: [
      [
        {
          header: "About IAAM",
          links: [
            { text: "About The Association", url: "/about-association" },
            { text: "Vision, Mission & Values", url: "/vision-mission-values" },
            { text: "IAAM Leadership & Governance", url: "/iaam-leadership-governance" },
            { text: "Global Presence & Reach", url: "/global-presence-reach" },
          ],
        },
        {
          header: "What We Do",
          links: [
            { text: "Meetings & Events", url: "/meetings-events" },
            { text: "Innovation & Sustainability", url: "/innovation-sustainability" },
            { text: "Journals & Proceedings", url: "/journals-and-proceedings-1" },
            { text: "Awards & Recognitions", url: "/awards-recognitions-iaam" },
          ],
        },
        {
          header: "Global Network",
          links: [
            { text: "National Councils", url: "/national-councils" },
            { text: "Societies & ChartersQ", url: "/societies-and-charters-q" },
            { text: "R&D World Links & Consortia", url: "/rd-world-links-consortia" },
            { text: "International Partnerships", url: "/international-partnerships" },
          ],
        },
      ],
      [
        {
          header: "Community & Membership",
          links: [
            { text: "Why Join IAAM", url: "/why-join-iaam" },
            { text: "Individual Membership", url: "/individual-membership" },
            { text: "Institutional Membership", url: "/institutional-membership" },
            { text: "Student & Emerging Talent Programs", url: "/student-emerging-talent-programs" },
          ],
        },
        {
          header: "Impact & Initiatives",
          links: [
            { text: "Net-Zero & Sustainability Initiatives", url: "/net-zero-sustainability-initiatives" },
            { text: "Industry–Academia Collaboration", url: "/industry-academia-collaboration" },
            { text: "Policy & Science Dialogue", url: "/policy-science-dialogue" },
            { text: "Capacity Building & Education", url: "/capacity-building-education" },
          ],
        },
        {
          header: "History & Milestones",
          links: [
            { text: "IAAM Journey", url: "/iaam-journey" },
            { text: "Key Achievements", url: "/key-achievements" },
            { text: "Past Conferences & Programs", url: "/past-conferences-programs" },
          ],
        },
      ],
      [
        { header: "Quick Actions" },
        { header: "Join IAAM", headerUrl: "/join-iaam" },
        { header: "Explore Events", headerUrl: "/explore-events" },
        { header: "Discover Publications", headerUrl: "/discover-publications" },
        { header: "Contact IAAM", headerUrl: "/contact-iaam" },
        {
          header: "Support & Information",
          links: [
            { text: "FAQs", url: "/faqs" },
            { text: "IAAM Code Of Conduct", url: "/iaam-code-of-conduct" },
            { text: "Developing Countries Engagement", url: "/developing-countries-engagement" },
            { text: "Contact IAAM Office", url: "/contact-iaam-office" },
          ],
        },
      ],
    ],
  },
];