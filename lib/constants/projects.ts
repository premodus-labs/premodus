export type Project = {
  slug: string;
  name: string;
  label: string;
  summary: string;
  description: string;
  problem?: string;
  approach?: string;
  outcome?: string;
  audience?: string;
  features?: { title: string; text: string }[];
  highlights?: { value: string; label: string }[];
  role?: string;
  stack?: string[];
  url?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "saimeche-ecb-2026",
    name: "SAIMechE ECB Conference 2026",
    label: "Event site",
    summary: "The conference site for the SAIMechE ECB 2026 event.",
    description:
      "The web presence for the SAIMechE ECB Conference 2026, giving delegates a single place to find information about the event.",
    url: "https://saimeche.org.za/page/SAIMechECBConference2026",
    image: "/images/work/saimeche.png",
  },
  {
    slug: "design-studio-must",
    name: "MUST Design Studio",
    label: "Web platform",
    summary: "The online home of Malawi University of Science and Technology's innovation hub.",
    description:
      "The Design Studio at the Malawi University of Science and Technology helps students turn ideas into ventures. This platform is where they find out what's on, join, learn and buy, all in one place. Students sign up and log in each semester to access the Studio's programs. They can browse student programs and events, such as the 2026 MUST Design Competition, and explore the Studio's spaces, which are organised into three hubs: the Student Hub, the Robotics Club and the Resource Hub. The site also showcases student innovations, runs an online store with 11+ products, and publishes a blog documenting the Studio's work, including workshops with international partners. Over 120 students are members.",
    problem:
      "The Studio needed one digital home that could bring together student programs, events, membership, innovation showcases, community resources, and a store without fragmenting the experience.",
    approach:
      "We organised the product around student life and access: clear onboarding, program discoverability, resource navigation, and a range of engagement paths that made the Studio feel active and open to participation.",
    outcome:
      "The result is a platform that makes the Design Studio feel coherent, active, and easy to access, helping students find the right opportunities and resources when they need them.",
    audience:
      "Undergraduate and graduate students, innovators, partners and visitors to MUST.",
    features: [
      {
        title: "Member sign-up and login",
        text: "Students join the Studio each semester through an account, which gives them access to programs and resources.",
      },
      {
        title: "Programs and events",
        text: "Student programs and events are surfaced clearly, including competitions and workshops with detail pages.",
      },
      {
        title: "Spaces and resources",
        text: "A directory of the Studio's spaces, labs and equipment, organised into student, robotics and resource hubs.",
      },
      {
        title: "Innovations showcase",
        text: "A page that presents the ventures and products emerging from the Studio so student work is visible and discoverable.",
      },
      {
        title: "Online store",
        text: "A storefront listing products made at the Studio, with more than 11 items already available to browse and buy.",
      },
      {
        title: "Blog and stories",
        text: "Articles and updates document the Studio's activity and highlight the work happening across the community.",
      },
    ],
    highlights: [
      { value: "120+", label: "student members" },
      { value: "3", label: "labs and hubs" },
      { value: "11+", label: "products in store" },
    ],
    role: "Design and development",
    stack: ["Web design", "UX", "Content structure"],
    url: "https://designstudio.must.ac.mw",
  },
  {
    slug: "rugare-mental-health",
    name: "Rugare Mental Health",
    label: "Nonprofit website",
    summary: "A youth-led mental health organisation, made easy to find and easy to reach.",
    description:
      "Rugare Mental Health Organization is a youth-led nonprofit working to break the stigma around mental health in Malawi. The site explains their work, builds trust with schools, partners and donors, and gives young people a clear, low-pressure way to ask for help. Visitors can request confidential counselling, online or in person, through a form or WhatsApp. The site explains each program: Mental Health Clubs in schools, Community Engagement (family fun days, forums, webinars and the Mind Matters podcast) and TulaNkhawa Talks online counselling. It also shows the organisation's credibility through partner schools, national media features and six active partners, highlights a monthly awareness campaign, and lets donors give through a PayChangu page.",
    problem:
      "People who need support, partners and donors all needed a simple, trustworthy way to understand what Rugare does and how to connect with them.",
    approach:
      "We designed a structure that makes the service feel immediate and human: clear calls to action, accessible language, and a strong tone that balances professionalism with care.",
    outcome:
      "The site creates a direct path from concern to action, helping visitors discover the organisation, reach out for support, and better understand the work they’re doing in the community.",
    audience:
      "Young people, schools, parents, partners, donors and the media.",
    features: [
      {
        title: "Confidential counselling requests",
        text: "A prominent entry point to request counselling online or in person, through a form or WhatsApp, so help is never more than a tap away.",
      },
      {
        title: "Programs explained",
        text: "Clear pages for Mental Health Clubs in schools, Community Engagement and TulaNkhawa Talks online counselling.",
      },
      {
        title: "Impact and credibility",
        text: "A live impact section showing people reached, partner schools, media features and active partners.",
      },
      {
        title: "Monthly awareness spotlight",
        text: "A featured campaign each month, such as Teen Mental Health Month, linked through to social content.",
      },
      {
        title: "Donations",
        text: "A support button that routes donors to a PayChangu giving page.",
      },
      {
        title: "Organisation pages",
        text: "Profile, board, media and contact sections bring the organisation's story and access points together in one place.",
      },
    ],
    highlights: [
      { value: "6", label: "active partners" },
      { value: "3", label: "partner schools" },
      { value: "3", label: "media outlets" },
    ],
    role: "Design and development",
    stack: ["Web design", "UX", "Content structure"],
    url: "https://www.rugarementalhealth.org",
    image: "/images/work/rugare.png",
  },
];
