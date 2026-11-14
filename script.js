// ==========================================
// COMDAL - STRUCTURED COMPANY RESEARCH SYSTEM
// Complete Fixed & Deduplicated script.js
// ==========================================


// 1. ALL RESEARCH TOPICS

const topics = [
    "Company Overview",
    "Company History",
    "Founder & CEO Details",
    "Products & Services",
    "Company Mission & Vision",
    "Company Size (Employees)",
    "Annual Revenue / Business Growth",
    "Competitors",
    "Market Position",
    "Company Branches & Locations",
    "Contact Information",
    "Career & Job Opportunities",
    "Latest News & Updates",
    "Customer Reviews & Reputation",
    "Social Media Presence",
    "Company Awards & Recognitions",
    "Company Stock Information",
    "Company Policies & Ethics",
    "Company Partnerships & Collaborations",
    "Company Sustainability & CSR Initiatives",
    "Company Financial Statements",
    "Company Legal & Regulatory Compliance",
    "Company Patents & Intellectual Property",
    "Company Press Releases",
    "Company Events & Conferences",
    "Company Research & Development",
    "Company Industry Trends & Insights",
    "Company SWOT Analysis",
    "All About Company"
];


// 2. TOPIC-WISE REPORT STRUCTURE

const topicSchemas = {

    "Company Overview": {
        title: "Company Overview",
        keywords: ["company overview", "about us", "company profile", "multinational", "headquartered"],
        fields: [
            {
                label: "Business Description",
                rule: "overviewDesc",
                maxFacts: 1,
                terms: ["is an", "is a", "multinational", "manufacturer", "corporation", "company that", "develops", "operates", "specializes in"]
            },
            {
                label: "Main Products & Services",
                rule: "products",
                maxFacts: 2,
                terms: ["offers", "products", "range of", "portfolio", "services", "solutions", "vehicles", "hatchbacks", "software", "platform", "cloud"]
            },
            {
                label: "Industry & Sector",
                rule: "industry",
                maxFacts: 1,
                terms: ["industry", "sector", "automotive", "technology", "market share", "sales channels", "segment"]
            },
            {
                label: "Headquarters",
                rule: "headquarters",
                maxFacts: 1,
                terms: ["headquartered in", "headquarters is", "headquarters in", "located at", "based in", "head office"]
            },
            {
                label: "Year Founded & Founders",
                rule: "founded",
                maxFacts: 1,
                terms: ["founded in", "founded on", "founded by", "established in", "incorporated in"]
            }
        ]
    },

    "Company History": {
        title: "Company History",
        keywords: ["company history", "founded", "established", "milestones", "company timeline", "origin"],
        fields: [
            { label: "Year Founded", rule: "founded", maxFacts: 1, terms: ["founded", "established", "started in", "incorporated"] },
            { label: "Founder", maxFacts: 1, terms: ["founded by", "founder", "co-founder", "started by"] },
            { label: "Major Milestones", maxFacts: 2, terms: ["milestone", "expanded", "launched", "acquired", "merger", "relocated", "milestones"] },
            { label: "Important Developments", maxFacts: 2, terms: ["history", "growth", "development", "transformation", "evolution", "formerly"] }
        ]
    },

    "Founder & CEO Details": {
        title: "Founder & CEO Details",
        keywords: ["founder", "co-founder", "CEO", "chief executive officer", "leadership", "executive team"],
        fields: [
            { label: "Founder / Co-founder", maxFacts: 1, terms: ["founder", "co-founder", "founded by"] },
            { label: "CEO", maxFacts: 1, terms: ["CEO", "chief executive officer", "managing director", "led by", "appointed"] },
            { label: "Education", maxFacts: 1, terms: ["education", "graduated", "degree", "university", "bachelor", "master"] },
            { label: "Professional Background", maxFacts: 2, terms: ["professional background", "career", "previously worked", "joined", "experience", "leadership"] }
        ]
    },

    "Products & Services": {
        title: "Products & Services",
        keywords: ["products", "services", "product portfolio", "solutions", "offerings", "platform"],
        fields: [
            { label: "Products", rule: "products", maxFacts: 2, terms: ["products", "product portfolio", "product range", "models", "vehicles", "hardware", "software", "devices"] },
            { label: "Services", maxFacts: 2, terms: ["services", "service offerings", "network", "cloud", "professional services", "subscriptions", "servicing"] },
            { label: "Features & Benefits", maxFacts: 2, terms: ["features", "benefits", "capabilities", "functions", "enables"] },
            { label: "Uses / Applications", maxFacts: 1, terms: ["used for", "applications", "designed for", "use cases", "serves", "customers", "businesses"] },
            { label: "Pricing", maxFacts: 1, terms: ["pricing", "price", "subscription", "cost", "plans", "licensed", "affordable", "premium"] }
        ]
    },

    "Company Mission & Vision": {
        title: "Company Mission & Vision",
        keywords: ["mission", "vision", "company values", "purpose", "core values"],
        fields: [
            { label: "Mission", maxFacts: 1, terms: ["mission", "our mission", "empower"] },
            { label: "Vision", maxFacts: 1, terms: ["vision", "our vision", "future"] },
            { label: "Core Values", maxFacts: 2, terms: ["core values", "company values", "values", "principles", "culture"] },
            { label: "Company Purpose", maxFacts: 1, terms: ["purpose", "aim", "objective", "committed to"] }
        ]
    },

    "Company Size (Employees)": {
        title: "Company Size & Employees",
        keywords: ["employees", "workforce", "employee count", "headcount", "staff size", "company size"],
        fields: [
            { label: "Number of Employees", maxFacts: 1, terms: ["employees", "employee count", "workforce", "headcount", "staff", "employs"] },
            { label: "Company Size Category", maxFacts: 1, terms: ["company size", "multinational", "enterprise", "global workforce", "large"] },
            { label: "Workforce Locations", maxFacts: 1, terms: ["employees across", "workforce across", "offices in", "plants in", "countries", "worldwide"] }
        ]
    },

    "Annual Revenue / Business Growth": {
        title: "Annual Revenue & Business Growth",
        keywords: ["annual revenue", "revenue growth", "business growth", "sales growth", "financial performance", "turnover"],
        fields: [
            { label: "Annual Revenue", maxFacts: 1, terms: ["annual revenue", "revenue", "turnover", "sales revenue", "billion", "crore"] },
            { label: "Financial Year", maxFacts: 1, terms: ["fiscal year", "financial year", "year ended", "FY", "quarter"] },
            { label: "Revenue Growth", maxFacts: 1, terms: ["revenue growth", "growth rate", "increased by", "grew by", "operating income", "net income"] },
            { label: "Business Expansion", maxFacts: 1, terms: ["expansion", "expanded", "new markets", "business growth", "exporter"] }
        ]
    },

    "Competitors": {
        title: "Competitor Analysis",
        keywords: ["competitors", "competitor", "competition", "rivals", "alternatives", "competitive landscape"],
        fields: [
            { label: "Competitors Mentioned", maxFacts: 2, terms: ["competitors", "competitor", "rivals", "alternatives", "competes with"] },
            { label: "Competing Products / Services", maxFacts: 1, terms: ["competing products", "similar products", "alternative services", "competing services"] },
            { label: "Competitive Differences", maxFacts: 1, terms: ["competitive advantage", "differentiator", "dominant", "leader", "market share"] }
        ]
    },

    "Market Position": {
        title: "Market Position",
        keywords: ["market position", "market share", "market leader", "industry ranking", "competitive position"],
        fields: [
            { label: "Market Share", maxFacts: 1, terms: ["market share", "share of the market", "dominant", "percent"] },
            { label: "Market Ranking", maxFacts: 1, terms: ["ranked", "ranking", "rank", "market leader", "top company", "largest", "leading"] },
            { label: "Target Market", maxFacts: 1, terms: ["target market", "customer segment", "target customers", "enterprises", "consumers", "mass market"] },
            { label: "Geographic Market", maxFacts: 1, terms: ["markets across", "operates in", "serves in", "countries", "worldwide", "exporter"] }
        ]
    },

    "Company Branches & Locations": {
        title: "Company Branches & Locations",
        keywords: ["office locations", "branches", "headquarters", "global offices", "locations", "regional offices"],
        fields: [
            { label: "Headquarters", rule: "headquarters", maxFacts: 1, terms: ["headquarters", "headquartered", "head office", "based in", "located at"] },
            { label: "Branches, Plants & Offices", maxFacts: 2, terms: ["branches", "offices", "plants", "facilities", "regional offices", "campuses"] },
            { label: "Countries of Operation", maxFacts: 1, terms: ["countries", "operates in", "locations worldwide", "global presence"] },
            { label: "Regional Presence", maxFacts: 1, terms: ["regional presence", "locations across", "offices across", "network"] }
        ]
    },

    "Contact Information": {
        title: "Contact Information",
        keywords: ["contact us", "contact information", "phone number", "email address", "customer support", "company address"],
        fields: [
            { label: "Official Address", maxFacts: 1, terms: ["address", "head office", "registered office", "headquarters", "located at", "road", "way", "street"] },
            { label: "Email Address", maxFacts: 1, terms: ["email", "e-mail", "contact email"] },
            { label: "Phone Number", maxFacts: 1, terms: ["phone", "telephone", "contact number", "call us", "toll-free"] },
            { label: "Official Website", maxFacts: 1, terms: ["website", "official website", "online", "portal"] },
            { label: "Customer Support", maxFacts: 1, terms: ["customer support", "help center", "support team", "contact support", "customer care"] }
        ]
    },

    "Career & Job Opportunities": {
        title: "Career & Job Opportunities",
        keywords: [
            "careers", "career opportunities", "job openings", "job opportunities",
            "internships", "vacancies", "hiring", "join our team",
            "open positions", "recruitment", "job listings", "job description"
        ],
        fields: [
            { label: "Job Title", type: "jobTitle", maxFacts: 2, terms: ["job title", "position", "role", "hiring for", "looking for", "engineer", "manager", "developer"] },
            { label: "Number of Vacancies", type: "vacancies", maxFacts: 1 },
            { label: "Required Qualification", maxFacts: 1, terms: ["qualification", "bachelor", "master", "degree", "diploma", "education", "graduate", "certification"] },
            { label: "Required Skills", maxFacts: 2, terms: ["skills", "technical skills", "proficiency", "programming", "communication skills", "knowledge of"] },
            { label: "Experience Required", maxFacts: 1, terms: ["years of experience", "year of experience", "experience required", "freshers", "entry level", "senior level"] },
            { label: "Job Location / Work Mode", maxFacts: 1, terms: ["job location", "work location", "based in", "remote", "hybrid", "on-site", "onsite"] },
            { label: "Application Deadline", maxFacts: 1, terms: ["application deadline", "apply before", "closing date", "last date to apply"] }
        ]
    },

    "Latest News & Updates": {
        title: "Latest News & Updates",
        keywords: ["latest news", "company news", "announcements", "recent updates", "business updates"],
        fields: [
            { label: "News Headlines", type: "title", maxFacts: 2 },
            { label: "Announcement / Update", maxFacts: 2, terms: ["announced", "announcement", "launch", "introduced", "released", "unveiled", "update"] },
            { label: "News Date", maxFacts: 1, terms: ["published", "announced on", "date", "2025", "2026"] },
            { label: "Business Impact", maxFacts: 1, terms: ["impact", "expansion", "investment", "growth", "partnership", "acquisition"] }
        ]
    },

    "Customer Reviews & Reputation": {
        title: "Customer Reviews & Reputation",
        keywords: ["customer reviews", "customer feedback", "ratings", "testimonials", "reputation", "customer satisfaction"],
        fields: [
            { label: "Customer Rating", maxFacts: 1, terms: ["rating", "rated", "out of 5", "stars", "score"] },
            { label: "Number of Reviews", maxFacts: 1, terms: ["reviews", "review count", "customer reviews", "feedback"] },
            { label: "Positive Feedback", maxFacts: 2, terms: ["positive reviews", "praised", "appreciated", "satisfied", "good service", "trusted"] },
            { label: "Common Complaints", maxFacts: 1, terms: ["complaints", "negative reviews", "issues", "poor service", "dissatisfied", "criticism"] },
            { label: "Overall Reputation", maxFacts: 1, terms: ["reputation", "customer satisfaction", "customer experience", "brand"] }
        ]
    },

    "Social Media Presence": {
        title: "Social Media Presence",
        keywords: ["social media", "linkedin", "instagram", "facebook", "youtube", "twitter"],
        fields: [
            { label: "LinkedIn", maxFacts: 1, terms: ["linkedin", "followers"] },
            { label: "Instagram", maxFacts: 1, terms: ["instagram"] },
            { label: "Facebook", maxFacts: 1, terms: ["facebook"] },
            { label: "YouTube", maxFacts: 1, terms: ["youtube", "subscribers"] },
            { label: "X / Twitter", maxFacts: 1, terms: ["twitter", "x.com"] },
            { label: "Other Social Platforms", maxFacts: 1, terms: ["social media", "social platforms", "tiktok", "pinterest"] }
        ]
    },

    "Company Awards & Recognitions": {
        title: "Awards & Recognitions",
        keywords: ["awards", "recognition", "honors", "industry award", "certification"],
        fields: [
            { label: "Award Names", maxFacts: 2, terms: ["award", "awarded", "recognition", "honor", "winner", "named"] },
            { label: "Awarding Organization", maxFacts: 1, terms: ["awarded by", "presented by", "recognized by", "forbes", "fortune"] },
            { label: "Award Year", maxFacts: 1, terms: ["award in", "awarded in", "recognized in", "2024", "2025", "2026"] },
            { label: "Certifications", maxFacts: 1, terms: ["certification", "certified", "accreditation", "iso"] }
        ]
    },

    "Company Stock Information": {
        title: "Company Stock Information",
        keywords: ["stock", "shares", "stock exchange", "ticker symbol", "share price", "market capitalization"],
        fields: [
            { label: "Stock Ticker", maxFacts: 1, terms: ["ticker", "ticker symbol", "stock symbol", "nasdaq", "nyse", "nse", "bse"] },
            { label: "Stock Exchange", maxFacts: 1, terms: ["stock exchange", "listed on", "exchange", "traded on"] },
            { label: "Listing Status", maxFacts: 1, terms: ["publicly traded", "listed company", "public company", "ipo"] },
            { label: "Share Price Information", maxFacts: 1, terms: ["share price", "stock price", "trading price", "shares"] },
            { label: "Market Capitalization", maxFacts: 1, terms: ["market capitalization", "market cap", "valuation", "trillion", "billion", "crore"] }
        ]
    },

    "Company Policies & Ethics": {
        title: "Company Policies & Ethics",
        keywords: ["company policies", "code of conduct", "business ethics", "workplace policy", "ethical standards"],
        fields: [
            { label: "Code of Conduct", maxFacts: 1, terms: ["code of conduct", "conduct policy", "compliance", "governance"] },
            { label: "Workplace Policies", maxFacts: 1, terms: ["workplace policy", "employee policy", "diversity", "inclusion"] },
            { label: "Ethical Standards", maxFacts: 1, terms: ["ethics", "ethical standards", "business ethics", "integrity"] },
            { label: "Data & Privacy Policies", maxFacts: 1, terms: ["privacy policy", "data protection", "data privacy", "security"] }
        ]
    },

    "Company Partnerships & Collaborations": {
        title: "Partnerships & Collaborations",
        keywords: ["partnership", "collaboration", "strategic alliance", "partnered with", "joint venture"],
        fields: [
            { label: "Partner Organizations", maxFacts: 2, terms: ["partnered with", "in partnership with", "collaboration with", "joint venture with", "alliance"] },
            { label: "Partnership Purpose", maxFacts: 1, terms: ["partnership to", "collaboration to", "strategic partnership", "purpose", "integrate"] },
            { label: "Partnership Date", maxFacts: 1, terms: ["partnership announced", "announced on", "signed an agreement", "deal"] },
            { label: "Key Outcomes", maxFacts: 1, terms: ["joint project", "combined efforts", "benefits", "collaboration", "customers"] }
        ]
    },

    "Company Sustainability & CSR Initiatives": {
        title: "Sustainability & CSR Initiatives",
        keywords: ["sustainability", "corporate social responsibility", "CSR", "environmental impact", "social initiatives", "carbon emissions"],
        fields: [
            { label: "Environmental Initiatives", maxFacts: 2, terms: ["environmental", "renewable energy", "carbon emissions", "recycling", "climate"] },
            { label: "Social Initiatives", maxFacts: 1, terms: ["community", "education program", "social initiatives", "community development", "philanthropy"] },
            { label: "CSR Programs", maxFacts: 1, terms: ["CSR", "corporate social responsibility", "social responsibility", "foundation"] },
            { label: "Sustainability Targets", maxFacts: 1, terms: ["sustainability target", "net zero", "carbon neutral", "carbon negative", "emission reduction"] },
            { label: "Reported Results", maxFacts: 1, terms: ["reduced emissions", "achieved", "sustainability report", "impact report"] }
        ]
    },

    "Company Financial Statements": {
        title: "Company Financial Statements",
        keywords: ["financial statements", "balance sheet", "income statement", "cash flow", "annual report"],
        fields: [
            { label: "Financial Year", maxFacts: 1, terms: ["financial year", "fiscal year", "year ended", "annual report"] },
            { label: "Revenue", maxFacts: 1, terms: ["revenue", "total income", "sales", "billion", "crore"] },
            { label: "Net Profit / Loss", maxFacts: 1, terms: ["net profit", "net income", "operating income", "profit after tax"] },
            { label: "Assets & Liabilities", maxFacts: 1, terms: ["total assets", "total liabilities", "balance sheet", "equity"] },
            { label: "Cash Flow", maxFacts: 1, terms: ["cash flow", "operating cash flow", "investing cash flow", "dividends"] }
        ]
    },

    "Company Legal & Regulatory Compliance": {
        title: "Legal & Regulatory Compliance",
        keywords: ["regulatory compliance", "legal compliance", "regulations", "lawsuit", "legal proceedings", "compliance requirements"],
        fields: [
            { label: "Regulatory Requirements", maxFacts: 1, terms: ["regulation", "regulatory requirements", "compliance requirements", "laws"] },
            { label: "Legal Cases / Proceedings", maxFacts: 1, terms: ["lawsuit", "legal proceedings", "court case", "litigation", "antitrust"] },
            { label: "Regulatory Authorities", maxFacts: 1, terms: ["regulator", "regulatory authority", "government agency", "commission"] },
            { label: "Compliance Status / Updates", maxFacts: 1, terms: ["compliance", "compliant", "investigation", "settlement", "penalty"] }
        ]
    },

    "Company Patents & Intellectual Property": {
        title: "Patents & Intellectual Property",
        keywords: ["patents", "intellectual property", "trademark", "copyright", "patent portfolio"],
        fields: [
            { label: "Patent Names / Titles", maxFacts: 2, terms: ["patent", "patented", "patent application", "patent portfolio"] },
            { label: "Patent Numbers", maxFacts: 1, terms: ["patent number", "patent no", "publication number", "granted"] },
            { label: "Patent Dates", maxFacts: 1, terms: ["patented on", "filed on", "granted on", "filing date"] },
            { label: "Trademarks & Copyrights", maxFacts: 1, terms: ["trademark", "copyright", "intellectual property", "brand"] },
            { label: "Technology / Innovation", maxFacts: 1, terms: ["invention", "technology", "innovation", "proprietary"] }
        ]
    },

    "Company Press Releases": {
        title: "Company Press Releases",
        keywords: ["press release", "media release", "official announcement", "newsroom"],
        fields: [
            { label: "Press Release Headlines", type: "title", maxFacts: 2 },
            { label: "Announcement Details", maxFacts: 2, terms: ["announced", "press release", "launch", "agreement", "introduced"] },
            { label: "Publication Date", maxFacts: 1, terms: ["published", "press release date", "announced on", "today"] },
            { label: "Main Development", maxFacts: 1, terms: ["launch", "partnership", "expansion", "investment", "acquisition"] }
        ]
    },

    "Company Events & Conferences": {
        title: "Events & Conferences",
        keywords: ["conference", "company events", "webinar", "industry event", "summit", "exhibition"],
        fields: [
            { label: "Event Name", type: "title", maxFacts: 2 },
            { label: "Event Date", maxFacts: 1, terms: ["event date", "will be held", "takes place", "scheduled for", "annual"] },
            { label: "Venue / Location", maxFacts: 1, terms: ["venue", "location", "held at", "hosted in", "virtual"] },
            { label: "Event Purpose / Topic", maxFacts: 1, terms: ["conference", "summit", "webinar", "discussion", "exhibition", "developers"] }
        ]
    },

    "Company Research & Development": {
        title: "Research & Development",
        keywords: ["research and development", "R&D", "innovation", "research lab", "new technology"],
        fields: [
            { label: "Research Areas", maxFacts: 2, terms: ["research areas", "research focus", "research into", "artificial intelligence", "electric", "innovation"] },
            { label: "Development Projects", maxFacts: 1, terms: ["development project", "project", "research project", "labs", "center"] },
            { label: "New Technologies", maxFacts: 1, terms: ["technology", "innovation", "new technology", "prototype", "models"] },
            { label: "Research Outcomes", maxFacts: 1, terms: ["research results", "developed", "breakthrough", "findings", "solutions"] }
        ]
    },

    "Company Industry Trends & Insights": {
        title: "Industry Trends & Insights",
        keywords: ["industry trends", "industry outlook", "market trends", "industry analysis", "sector growth"],
        fields: [
            { label: "Major Industry Trends", maxFacts: 2, terms: ["industry trends", "market trends", "emerging trends", "trend", "shift"] },
            { label: "Technology Changes", maxFacts: 1, terms: ["technology adoption", "automation", "artificial intelligence", "digital transformation", "electric"] },
            { label: "Market Opportunities", maxFacts: 1, terms: ["market opportunity", "opportunities", "demand growth", "expansion"] },
            { label: "Industry Challenges", maxFacts: 1, terms: ["industry challenges", "challenges", "risks", "constraints", "competition"] }
        ]
    },

    "Company SWOT Analysis": {
        title: "SWOT Analysis",
        keywords: ["SWOT", "strengths", "weaknesses", "opportunities", "threats"],
        fields: [
            { label: "Strengths", maxFacts: 2, terms: ["strengths", "key strength", "competitive advantage", "dominant", "leader"] },
            { label: "Weaknesses", maxFacts: 1, terms: ["weaknesses", "limitations", "shortcomings", "dependence", "criticism"] },
            { label: "Opportunities", maxFacts: 2, terms: ["opportunities", "growth opportunities", "market opportunities", "expansion"] },
            { label: "Threats", maxFacts: 1, terms: ["threats", "competitive threats", "business risks", "regulatory", "competition"] }
        ]
    }
};


// 3. HTML ELEMENTS

const dropdown = document.getElementById("topicDropdown");
const dropdownBtn = document.getElementById("topicDropdownBtn");
const dropdownMenu = document.getElementById("topicDropdownMenu");
const dropdownLabel = document.getElementById("dropdownLabel");
const searchInput = document.getElementById("searchInput");
const topicOptions = document.getElementById("topicOptions");
const selectedCount = document.getElementById("selectedCount");
const dropdownCount = document.getElementById("dropdownCount");
const noResults = document.getElementById("noResults");
const clearTopicsBtn = document.getElementById("clearTopicsBtn");

const form = document.getElementById("companyForm");
const reportPreview = document.getElementById("reportPreview");
const reportContent = document.getElementById("reportContent");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const submitBtn = document.getElementById("submitBtn");

const statusBanner = document.getElementById("statusBanner");
const statusBannerIcon = document.getElementById("statusBannerIcon");
const statusBannerText = document.getElementById("statusBannerText");
const statusBannerClose = document.getElementById("statusBannerClose");
const loadingSkeleton = document.getElementById("loadingSkeleton");
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.getElementById("themeToggleIcon");
const themeToggleText = document.getElementById("themeToggleText");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const selectedTopics = new Set();


// 4. CHECK REQUIRED HTML ELEMENTS

const requiredElements = [
    dropdown,
    dropdownBtn,
    dropdownMenu,
    dropdownLabel,
    searchInput,
    topicOptions,
    selectedCount,
    dropdownCount,
    noResults,
    clearTopicsBtn,
    form,
    reportPreview,
    reportContent,
    submitBtn,
    statusBanner,
    loadingSkeleton,
    themeToggle,
    historyPanel,
    historyList
];

if (requiredElements.some(element => !element)) {
    console.error("Comdal: One or more required HTML elements are missing. Check your HTML IDs.");
}


// 5. TOPIC DROPDOWN

function renderTopics(query = "") {
    topicOptions.replaceChildren();

    const cleanQuery = query.trim().toLowerCase();

    const filteredTopics = topics.filter(topic =>
        topic.toLowerCase().includes(cleanQuery)
    );

    filteredTopics.forEach(topic => {
        const label = document.createElement("label");
        label.className = "topic-option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = topic;
        checkbox.checked = selectedTopics.has(topic);

        const text = document.createElement("span");
        text.textContent = topic;

        checkbox.addEventListener("change", function () {
            if (this.checked) {
                selectedTopics.add(topic);
            } else {
                selectedTopics.delete(topic);
            }
            updateSelectedCount();
        });

        label.append(checkbox, text);
        topicOptions.appendChild(label);
    });

    noResults.style.display =
        filteredTopics.length === 0 ? "block" : "none";
}

function updateSelectedCount() {
    const total = selectedTopics.size;
    const message = total + (total === 1 ? " Topic Selected" : " Topics Selected");

    selectedCount.textContent = message;
    dropdownCount.textContent = total + " selected";
    dropdownLabel.textContent = total === 0 ? "Select company topics" : message;
}

function closeDropdown() {
    dropdownMenu.hidden = true;
    dropdownBtn.setAttribute("aria-expanded", "false");
}

dropdownBtn.addEventListener("click", function () {
    const isOpen = !dropdownMenu.hidden;
    dropdownMenu.hidden = isOpen;
    dropdownBtn.setAttribute("aria-expanded", String(!isOpen));

    if (!isOpen) {
        searchInput.focus();
    }
});

document.addEventListener("click", function (event) {
    if (!dropdown.contains(event.target)) {
        closeDropdown();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !dropdownMenu.hidden) {
        closeDropdown();
        dropdownBtn.focus();
    }
});

searchInput.addEventListener("input", function () {
    renderTopics(this.value);
});

clearTopicsBtn.addEventListener("click", function () {
    selectedTopics.clear();
    renderTopics(searchInput.value);
    updateSelectedCount();
});

renderTopics();
updateSelectedCount();


// 6. REPORT HELPER FUNCTIONS

function addHeading(text) {
    const heading = document.createElement("h3");
    heading.textContent = text;
    reportContent.appendChild(heading);
}

function addParagraph(text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    reportContent.appendChild(paragraph);
}

function addSourceLink(container, item) {
    if (!item || !item.url) return;

    try {
        const url = new URL(item.url);

        if (url.protocol !== "https:" && url.protocol !== "http:") {
            return;
        }

        const link = document.createElement("a");
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Open Original Source";

        container.appendChild(link);
    } catch (error) {
        console.warn("Invalid source URL:", item.url);
    }
}


// 7. ENTITY & SENTENCE CLEANING HELPERS

function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function containsKeyword(text, keyword) {
    const cleanText = normalizeText(text);
    const cleanKeyword = normalizeText(keyword);
    return cleanKeyword.length > 0 && cleanText.includes(cleanKeyword);
}

function cleanSourceTitle(title) {
    const raw = String(title || "Official Source").trim();
    return raw.replace(/\s*[|\-–—]\s*(Yahoo Finance|Comparables\.ai|Wikipedia|Tracxn|EBSCOhost).*$/i, "").trim() || raw;
}

// Detect the main canonical company name (e.g., "Maruti" -> "Maruti Suzuki")
// so unrelated companies sharing the first word ("Maruti Interior Products") get blocked
function resolveCanonicalBrand(userCompanyName, aiSummary, results) {
    const baseWords = normalizeText(userCompanyName).split(" ").filter(Boolean);
    if (baseWords.length === 0) return { base: "", secondWord: "" };

    const firstWord = baseWords[0];

    // FIX: If the user typed 2+ words (e.g. "Space X", "Maruti Suzuki"), do NOT
    // build a strict brand filter. Names like "Space X" vs "SpaceX" would otherwise
    // block many correct sentences ("Space Exploration Technologies", "space transportation").
    if (baseWords.length >= 2) {
        return { base: firstWord, secondWord: "" };
    }

    const genericSuffixes = new Set([
        "is", "was", "has", "inc", "ltd", "limited", "corp", "corporation",
        "company", "co", "group", "india", "global", "technologies", "private",
        "public", "official", "overview", "profile", "products", "history"
    ]);

    const sampleTexts = [
        aiSummary || "",
        ...(Array.isArray(results) ? results.slice(0, 4).map(r => r.title || "") : [])
    ].join(" ");

    const regex = new RegExp(`\\b${firstWord}\\s+([a-zA-Z]{3,15})\\b`, "gi");
    const counts = {};
    let match;

    while ((match = regex.exec(sampleTexts)) !== null) {
        const nextWord = match[1].toLowerCase();
        if (!genericSuffixes.has(nextWord)) {
            counts[nextWord] = (counts[nextWord] || 0) + 1;
        }
    }

    let bestSecondWord = "";
    let maxCount = 0;

    for (const [word, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            bestSecondWord = word;
        }
    }

    return {
        base: firstWord,
        secondWord: maxCount >= 2 ? bestSecondWord : ""
    };
}

// Check if a title or sentence belongs to a different company with the same first word
function isDifferentCompany(text, brandInfo) {
    if (!text || !brandInfo || !brandInfo.base || !brandInfo.secondWord) {
        return false;
    }

    const norm = normalizeText(text);
    const { base, secondWord } = brandInfo;

    // If it explicitly mentions the canonical 2-word brand (e.g. "maruti suzuki"), it's valid
    if (norm.includes(`${base} ${secondWord}`)) {
        return false;
    }

    const allowedAfterBase = new Set([
        secondWord, "udyog", "inc", "ltd", "limited", "corp", "corporation",
        "company", "co", "group", "india", "is", "was", "has", "offers",
        "provides", "develops", "operates", "headquarters", "founded"
    ]);

    const regex = new RegExp(`\\b${base}\\s+([a-z0-9]+)\\b`, "i");
    const match = norm.match(regex);

    if (match && match[1]) {
        const followingWord = match[1].toLowerCase();
        if (!allowedAfterBase.has(followingWord)) {
            // Example: "maruti interior" when canonical is "maruti suzuki"
            return true;
        }
    }

    return false;
}

// Strict similarity check: blocks >45% word overlap OR shared 4-word phrases
function isTooSimilar(sentence, existingSet, companyName) {
    const compWords = new Set(normalizeText(companyName).split(" "));
    const normSentence = normalizeText(sentence);

    if (existingSet.has(normSentence)) return true;

    const wordsA = normSentence
        .split(" ")
        .filter(w => w.length > 3 && !compWords.has(w));

    if (wordsA.length === 0) return true;

    // Build 4-word phrases (4-grams) to prevent repeating clauses like "subsidiary of suzuki motor"
    const allWordsA = normSentence.split(" ").filter(w => w.length > 2);
    const ngramsA = [];
    for (let i = 0; i <= allWordsA.length - 4; i++) {
        ngramsA.push(allWordsA.slice(i, i + 4).join(" "));
    }

    for (const existing of existingSet) {
        // 1. Check 4-word phrase overlap
        if (ngramsA.some(gram => existing.includes(gram))) {
            return true;
        }

        // 2. Check overall keyword overlap (>45% rejected)
        const wordsB = new Set(
            existing.split(" ").filter(w => w.length > 3 && !compWords.has(w))
        );
        if (wordsB.size === 0) continue;

        const shared = wordsA.filter(w => wordsB.has(w)).length;
        const overlap = shared / Math.min(wordsA.length, wordsB.size);

        if (overlap > 0.45) {
            return true;
        }
    }

    return false;
}

function isSentenceCleanAndComplete(s, brandInfo) {
    const text = s.trim();

    if (text.length < 45 || text.length > 250) return false;
    if (!/^[A-Z]/.test(text) || !/[.!?]$/.test(text)) return false;

    // Reject sentences that ended prematurely on an abbreviation like "Plot No." or "Inc."
    if (/\b(No|Plot No|Sr No|Dr|Mr|Mrs|Ms|St|Ave|Rd|Inc|Ltd|Corp|Co|vs|etc)\.$/.test(text)) {
        return false;
    }

    // Reject dangling context sentences
    if (/^(This segment|It also|They also|These|Those|Here|Click|View|Sign in|Unlock|Start searching|Download|Read more|Learn more|See also)\b/i.test(text)) {
        return false;
    }

    if (text.includes("|") || text.includes("---") || text.includes("...") || text.includes("[")) {
        return false;
    }

    if (isDifferentCompany(text, brandInfo)) {
        return false;
    }

    const colonCount = (text.match(/:/g) || []).length;
    if (colonCount > 1) return false;

    const noisePatterns = [
        /sign in to view/i,
        /unlock /i,
        /start searching/i,
        /download the full/i,
        /sic code/i,
        /naics code/i,
        /epoch date/i,
        /industry disp/i,
        /sector key/i,
        /footnotes/i,
        /image \d+/i,
        /all rights reserved/i,
        /cookie policy/i,
        /terms of use/i
    ];

    return !noisePatterns.some(pattern => pattern.test(text));
}

function extractCleanSentences(rawContent, brandInfo) {
    if (!rawContent) return [];

    const chunks = String(rawContent)
        .split(/\n+|\[\.{2,}\]|#{1,6}|\|/g);

    const validSentences = [];

    chunks.forEach(chunk => {
        // Protect common abbreviations before splitting on periods
        const protectedText = chunk
            .replace(/https?:\/\/\S+|www\.\S+/gi, "")
            .replace(/\[\d+\]/g, "")   // FIX: remove citation numbers like [1], [23] (Wikipedia)
            .replace(/Image\s*\d+\s*:/gi, "")
            .replace(/\b(Start searching|Sign in to view[^.]*|Unlock [A-Za-z &]+)\b/gi, "")
            .replace(/\b(No|Ltd|Inc|Corp|Co|Pvt|Dr|Mr|St|Ave|Rd)\./gi, "$1")
            .replace(/\s+/g, " ")
            .trim();

        if (!protectedText) return;

        const sentences = protectedText.split(/(?<=[.!?])\s+/);

        sentences.forEach(sentence => {
            const trimmed = sentence.trim();
            if (isSentenceCleanAndComplete(trimmed, brandInfo)) {
                validSentences.push(trimmed);
            }
        });
    });

    return validSentences;
}


// 8. SCORE SENTENCES SPECIFICALLY FOR EACH FIELD

function scoreSentenceForField(sentence, field, companyName) {
    const lower = sentence.toLowerCase();
    const compLower = (companyName || "").toLowerCase();
    // FIX: "Space X" should also match "SpaceX" (compare without spaces)
    const compCompact = compLower.replace(/\s+/g, "");
    let score = 0;

    if (compLower && (
        lower.includes(compLower) ||
        (compCompact && lower.replace(/\s+/g, "").includes(compCompact))
    )) {
        score += 3;
    }

    // 1. Year Founded Rule (Updated with False-Brand Blocker)
    if (field.rule === "founded") {
        const hasFoundingVerb = /\b(founded|established|incorporated|started|formed)\b/i.test(sentence);
        const hasYear = /\b(18\d{2}|19\d{2}|20\d{2})\b/.test(sentence);
        
        // Block mixing up with other car brands like Skoda (1895, Czech, Mlada)
        const hasForeignBrand = /\b(skoda|czech|mlada|boleslav|volkswagen|toyota)\b/i.test(sentence);

        if (!hasFoundingVerb || !hasYear || hasForeignBrand) return 0;
        score += 14;
        if (/\bfounded by\b/i.test(sentence)) score += 4;
    }

    // 2. Headquarters Rule
    else if (field.rule === "headquarters") {
        const hasHqKeyword = /\b(headquartered|headquarters|based in|head office|located at)\b/i.test(sentence);
        if (!hasHqKeyword) return 0;
        score += 14;
    }

    // 3. Business Description Rule
    else if (field.rule === "overviewDesc") {
        const hasDescVerb = /\b(is an|is a|multinational|manufacturer|corporation|company that|develops|leader in|subsidiary of)\b/i.test(sentence);
        if (!hasDescVerb) return 0;
        score += 10;
    }

    // 4. Products & Services Rule
    else if (field.rule === "products") {
        if (!/\b(products|services|offers|develops|range of|vehicles|hatchbacks|sedans|suvs|operating system|software|cloud|devices|applications|solutions|platform)\b/i.test(sentence)) {
            return 0;
        }
        score += 9;
    }

    // 5. Industry & Sector Rule
    else if (field.rule === "industry") {
        if (!/\b(industry|sector|automotive|technology|software|conglomerate|market share|channels|segment)\b/i.test(sentence)) {
            return 0;
        }
        score += 8;
    }

    (field.terms || []).forEach(term => {
        if (containsKeyword(sentence, term)) {
            score += 3;
        }
    });

    return score;
}


// 9. FIND RELEVANT SOURCES FOR EACH TOPIC

function getMatchingSources(results, schema, brandInfo) {
    const safeResults = Array.isArray(results) ? results : [];
    const topicKeywords = schema.keywords || [];

    const matches = safeResults
        .filter(item => {
            // Exclude sources whose title is clearly about a different company
            return !isDifferentCompany(item.title || "", brandInfo);
        })
        .map((item, index) => {
            const title = item.title || "";
            const content = item.content || item.snippet || "";
            let score = 0;

            topicKeywords.forEach(keyword => {
                if (containsKeyword(title, keyword)) score += 3;
                if (containsKeyword(content, keyword)) score += 1;
            });

            schema.fields.forEach(field => {
                (field.terms || []).forEach(keyword => {
                    if (containsKeyword(title, keyword)) score += 2;
                    if (containsKeyword(content, keyword)) score += 1;
                });
            });

            return { item, index, score };
        });

    return matches
        .filter(source => source.score >= 1)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
}


// 10. COLLECT BEST NON-REPEATING FACTS FOR EACH FIELD

function collectBestFieldFacts(matches, field, usedSentencesGlobal, companyName, brandInfo) {
    const maxAllowed = field.maxFacts || 2;

    if (field.type === "title") {
        const titles = [];
        matches.slice(0, maxAllowed).forEach(m => {
            if (m.item.title && !isDifferentCompany(m.item.title, brandInfo)) {
                titles.push({
                    text: m.item.title.trim(),
                    sourceTitle: cleanSourceTitle(m.item.title)
                });
            }
        });
        return titles;
    }

    if (field.type === "vacancies") {
        const vacs = [];
        matches.forEach(m => {
            const content = String(m.item.content || m.item.snippet || "");
            const match = content.match(/\b(\d{1,4})\s+(?:open\s+|available\s+)?(?:vacancies|openings|positions)\b/i);
            if (match) {
                vacs.push({
                    text: match[0],
                    sourceTitle: cleanSourceTitle(m.item.title)
                });
            }
        });
        return vacs.slice(0, 1);
    }

    const candidates = [];

    matches.forEach(source => {
        const item = source.item;
        const sentences = extractCleanSentences(item.content || item.snippet || "", brandInfo);

        sentences.forEach(sentence => {
            const score = scoreSentenceForField(sentence, field, companyName);
            if (score >= 4) {
                candidates.push({
                    text: sentence,
                    score,
                    sourceTitle: cleanSourceTitle(item.title)
                });
            }
        });
    });

    candidates.sort((a, b) => b.score - a.score);

    const selectedFacts = [];

    for (const candidate of candidates) {
        if (selectedFacts.length >= maxAllowed) break;

        if (!isTooSimilar(candidate.text, usedSentencesGlobal, companyName)) {
            usedSentencesGlobal.add(normalizeText(candidate.text));
            selectedFacts.push({
                text: candidate.text,
                sourceTitle: candidate.sourceTitle
            });
        }
    }

    return selectedFacts;
}


// 11. DISPLAY A STRUCTURED FIELD

function displayField(label, facts) {
    const article = document.createElement("article");
    article.className = "research-result";

    const heading = document.createElement("h4");
    heading.textContent = label;
    article.appendChild(heading);

    if (!facts.length) {
        const missing = document.createElement("p");
        missing.textContent = "Specific verified details not found in available sources.";
        article.appendChild(missing);
    } else {
        const list = document.createElement("ul");

        facts.forEach(fact => {
            const listItem = document.createElement("li");

            const information = document.createElement("p");
            information.textContent = fact.text;
            listItem.appendChild(information);

            if (fact.sourceTitle) {
                const sourceName = document.createElement("small");
                sourceName.textContent = "Source: " + fact.sourceTitle;
                listItem.appendChild(sourceName);
            }

            list.appendChild(listItem);
        });

        article.appendChild(list);
    }

    reportContent.appendChild(article);
}


// 12. DEDUPLICATE SOURCES (BY URL AND TITLE)

function addUsedSources(matches, usedSources, brandInfo) {
    matches.forEach(source => {
        const item = source.item;
        if (!item || !item.url) return;
        if (isDifferentCompany(item.title || "", brandInfo)) return;

        const cleanUrl = String(item.url).trim().toLowerCase().replace(/\/+$/, "");
        const cleanTitle = normalizeText(cleanSourceTitle(item.title));

        const alreadyAdded = usedSources.some(existing => {
            const existingUrl = String(existing.url || "").trim().toLowerCase().replace(/\/+$/, "");
            const existingTitle = normalizeText(cleanSourceTitle(existing.title));
            return existingUrl === cleanUrl || (cleanTitle && existingTitle === cleanTitle);
        });

        if (!alreadyAdded) {
            usedSources.push(item);
        }
    });
}


// 13. DISPLAY ONE TOPIC IN ITS OWN STRUCTURE

function displayTopicSection(topicName, results, usedSources, companyName, brandInfo, usedSentencesGlobal) {
    const schema = topicSchemas[topicName];
    if (!schema) return;

    addHeading(schema.title);

    const matches = getMatchingSources(results, schema, brandInfo);

    if (matches.length === 0) {
        addParagraph("No sufficiently relevant information was found for this topic.");
        return;
    }

    // Specific fields claim their best sentences first so generic fields don't steal them
    const priorityOrder = [...schema.fields].sort((a, b) => {
        const priorityRules = { founded: 1, headquarters: 2, products: 3, industry: 4, overviewDesc: 5 };
        return (priorityRules[a.rule] || 99) - (priorityRules[b.rule] || 99);
    });

    const factsByFieldLabel = new Map();

    priorityOrder.forEach(field => {
        const facts = collectBestFieldFacts(
            matches,
            field,
            usedSentencesGlobal,
            companyName,
            brandInfo
        );
        factsByFieldLabel.set(field.label, facts);
    });

    // Display in original visual order
    schema.fields.forEach(field => {
        displayField(field.label, factsByFieldLabel.get(field.label) || []);
    });

    addUsedSources(matches, usedSources, brandInfo);
}


// 14. GENERATE THE COMPLETE REPORT

function generateProfessionalReport(company, results, aiSummary = "") {
    const safeResults = Array.isArray(results) ? results : [];
    const usedSources = [];
    const usedSentencesGlobal = new Set();

    // Resolve canonical brand (e.g. "maruti" -> "maruti suzuki") to block unrelated companies
    const brandInfo = resolveCanonicalBrand(company.companyName, aiSummary, safeResults);

    // Executive Summary card at the top
    if (aiSummary && aiSummary.trim().length > 30) {
        addHeading("Executive Summary");
        const summaryCard = document.createElement("article");
        summaryCard.className = "research-result";
        const summaryPara = document.createElement("p");
        summaryPara.textContent = aiSummary.trim();
        summaryCard.appendChild(summaryPara);
        reportContent.appendChild(summaryCard);

        // FIX: Summary sentences are NOT added to usedSentencesGlobal anymore.
        // Before, the 4-word phrase check blocked good field sentences
        // (Falcon 9, Starship, etc.) just because the summary mentioned them.
    }

    let topicsToDisplay = [];

    if (selectedTopics.has("All About Company")) {
        topicsToDisplay = topics.filter(topic => topic !== "All About Company");
    } else {
        topicsToDisplay = topics.filter(topic => selectedTopics.has(topic));
    }

    topicsToDisplay.forEach(topicName => {
        displayTopicSection(
            topicName,
            safeResults,
            usedSources,
            company.companyName,
            brandInfo,
            usedSentencesGlobal
        );
    });

    addHeading("Sources & References");

    if (usedSources.length === 0) {
        addParagraph("No relevant source pages were found for the selected topics.");
    } else {
        const sourceList = document.createElement("ol");

        usedSources.slice(0, 6).forEach(item => {
            const listItem = document.createElement("li");
            const title = document.createElement("p");
            title.textContent = cleanSourceTitle(item.title);
            listItem.appendChild(title);
            addSourceLink(listItem, item);
            sourceList.appendChild(listItem);
        });

        reportContent.appendChild(sourceList);
    }
}


// 15. COMPANY DETAILS IN THE REPORT

function displayCompanyDetails(companyData) {
    addHeading("Company Details");

    const details = [
        ["Company Name", companyData.companyName],
        ["Company Address", companyData.companyAddress],
        ["Company Email", companyData.companyEmail],
        ["Company Website", companyData.companyWebsite],
        ["Industry", companyData.industry]
    ];

    const list = document.createElement("div");

    details.forEach(([label, value]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = label + ": ";
        paragraph.appendChild(strong);
        paragraph.appendChild(document.createTextNode(value || "Not provided"));
        list.appendChild(paragraph);
    });

    reportContent.appendChild(list);
}


// 16. SELECTED TOPICS IN THE REPORT

function displaySelectedTopics() {
    addHeading("Selected Research Topics");
    const list = document.createElement("ul");

    Array.from(selectedTopics).forEach(topic => {
        const item = document.createElement("li");
        item.textContent = topic;
        list.appendChild(item);
    });

    reportContent.appendChild(list);
}


// 17. PDF DOWNLOAD
// Managed by pdf-report.js


// 18. BACKEND URL

// Set in config.js. Local development falls back to http://localhost:3000
const API_BASE = (function () {
    const configured = window.COMDAL_CONFIG && window.COMDAL_CONFIG.API_BASE_URL;
    if (configured) return String(configured).replace(/\/+$/, "");

    const isLocalPage = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
    return isLocalPage ? "http://localhost:3000" : "";
})();

const REQUEST_TIMEOUT_MS = 90000;


// 19. STATUS BANNER (replaces alert popups)

function showBanner(type, message) {
    statusBanner.className = "banner banner-" + type;
    statusBannerIcon.textContent = type === "info" ? "ℹ" : "⚠";
    statusBannerText.textContent = message;
    statusBanner.hidden = false;
}

function hideBanner() {
    statusBanner.hidden = true;
}

statusBannerClose.addEventListener("click", hideBanner);

function formatDateTime(value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function describeFetchError(error) {
    if (error && error.name === "AbortError") {
        return "The research took too long and was stopped. Please try again.";
    }

    if (!navigator.onLine) {
        return "You appear to be offline. Please check your internet connection and try again.";
    }

    const isLocalPage = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
    const pointsToLocalhost = /localhost|127\.0\.0\.1/.test(API_BASE);

    if (!isLocalPage && (!API_BASE || pointsToLocalhost)) {
        return "The backend URL is not set. Open config.js and put your deployed backend URL in API_BASE_URL.";
    }

    return "Cannot reach the Comdal server. Please make sure the backend is running and try again.";
}


// 20. DARK / LIGHT THEME

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const isDark = theme === "dark";
    themeToggleIcon.textContent = isDark ? "☀️" : "🌙";
    themeToggleText.textContent = isDark ? "Light" : "Dark";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

themeToggle.addEventListener("click", function () {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";

    applyTheme(next);

    try {
        localStorage.setItem("comdalTheme", next);
    } catch (error) {
        // storage blocked - theme still works for this visit
    }
});

applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");


// 21. RECENT SEARCHES (localStorage)

const HISTORY_KEY = "comdalHistory";
const HISTORY_MAX_ENTRIES = 10;
const HISTORY_MAX_CONTENT = 4000;

function readHistory() {
    try {
        const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        return Array.isArray(parsed)
            ? parsed.filter(entry =>
                entry && entry.id && entry.companyData &&
                Array.isArray(entry.companyData.topics) &&
                Array.isArray(entry.searchResults))
            : [];
    } catch (error) {
        return [];
    }
}

function writeHistory(list) {
    const items = list.slice(0, HISTORY_MAX_ENTRIES);

    // If the browser storage is full, drop the oldest entries until it fits
    while (items.length > 0) {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
            return items;
        } catch (error) {
            items.pop();
        }
    }

    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        // ignore
    }
    return [];
}

function makeHistoryId(companyData) {
    return JSON.stringify([
        companyData.companyName.toLowerCase().replace(/\s+/g, " ").trim(),
        companyData.industry,
        [...companyData.topics].sort()
    ]);
}

function addToHistory(companyData, result) {
    const entry = {
        id: makeHistoryId(companyData),
        savedAt: new Date().toISOString(),
        companyData,
        aiSummary: result.aiSummary || "",
        searchResults: (result.searchResults || []).map(item => ({
            title: item.title || "",
            url: item.url || "",
            content: String(item.content || item.snippet || "").slice(0, HISTORY_MAX_CONTENT)
        }))
    };

    const others = readHistory().filter(existing => existing.id !== entry.id);
    writeHistory([entry, ...others]);
    renderHistory();
}

function removeFromHistory(id) {
    writeHistory(readHistory().filter(entry => entry.id !== id));
    renderHistory();
}

function renderHistory() {
    const entries = readHistory();

    historyList.replaceChildren();
    historyPanel.hidden = entries.length === 0;

    entries.forEach(entry => {
        const item = document.createElement("div");
        item.className = "history-item";

        const openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.className = "history-open";
        openBtn.title = "Open this saved report";

        const name = document.createElement("strong");
        name.textContent = entry.companyData.companyName;

        const meta = document.createElement("small");
        const topicCount = entry.companyData.topics.length;
        meta.textContent =
            entry.companyData.industry + " · " +
            topicCount + (topicCount === 1 ? " topic" : " topics") + " · " +
            formatDateTime(entry.savedAt);

        openBtn.append(name, meta);
        openBtn.addEventListener("click", () => openHistoryEntry(entry.id));

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "history-remove";
        removeBtn.textContent = "×";
        removeBtn.setAttribute("aria-label", "Remove " + entry.companyData.companyName + " from recent searches");
        removeBtn.addEventListener("click", () => removeFromHistory(entry.id));

        item.append(openBtn, removeBtn);
        historyList.appendChild(item);
    });
}

function restoreFormFromEntry(companyData) {
    form.elements["company-name"].value = companyData.companyName || "";
    form.elements["company-address"].value = companyData.companyAddress || "";
    form.elements["company-email"].value = companyData.companyEmail || "";
    form.elements["company-website"].value = companyData.companyWebsite || "";
    form.elements["company-industry"].value = companyData.industry || "";

    selectedTopics.clear();
    (companyData.topics || []).forEach(topic => selectedTopics.add(topic));
    renderTopics(searchInput.value);
    updateSelectedCount();
}

function openHistoryEntry(id) {
    const entry = readHistory().find(item => item.id === id);
    if (!entry) return;

    restoreFormFromEntry(entry.companyData);
    renderReport(entry.companyData, entry);

    showBanner(
        "info",
        "Showing the saved report for " + entry.companyData.companyName +
        " from " + formatDateTime(entry.savedAt) + ". Click Create Report to refresh it."
    );
}

clearHistoryBtn.addEventListener("click", function () {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        // ignore
    }
    renderHistory();
});

renderHistory();


// 22. SHOW A FINISHED REPORT

function renderReport(companyData, result) {
    reportContent.replaceChildren();

    displayCompanyDetails(companyData);
    displaySelectedTopics();
    generateProfessionalReport(
        companyData,
        result.searchResults,
        result.aiSummary
    );

    // used by export.js for file names
    window.comdalCurrentCompany = companyData.companyName;

    reportPreview.hidden = false;
    closeDropdown();

    reportPreview.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("loading", isLoading);
    submitBtn.textContent = isLoading ? "Researching..." : "Create Report";
    loadingSkeleton.hidden = !isLoading;

    if (isLoading) {
        reportPreview.hidden = true;
        loadingSkeleton.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}


// 23. FORM SUBMISSION

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideBanner();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (selectedTopics.size === 0) {
        showBanner("warning", "Please select at least one company topic.");
        dropdownMenu.hidden = false;
        dropdownBtn.setAttribute("aria-expanded", "true");
        searchInput.focus();
        return;
    }

    const companyName = form.elements["company-name"].value.trim();
    const companyAddress = form.elements["company-address"].value.trim();
    const companyEmail = form.elements["company-email"].value.trim();
    const companyWebsite = form.elements["company-website"].value.trim();
    const industry = form.elements["company-industry"].value;
    const chosenTopics = Array.from(selectedTopics);

    const companyData = {
        companyName,
        companyAddress,
        companyEmail,
        companyWebsite,
        industry,
        topics: chosenTopics
    };

    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(API_BASE + "/api/company-research", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(companyData),
            signal: controller.signal
        });

        let result;

        try {
            result = await response.json();
        } catch (jsonError) {
            throw new Error("The server sent an unexpected response. Please try again in a moment.");
        }

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Backend request failed.");
        }

        renderReport(companyData, result);
        addToHistory(companyData, result);

        if (result.stale) {
            showBanner(
                "warning",
                "Live research is unavailable right now, so this is a saved result from " +
                formatDateTime(result.cachedAt) + "."
            );
        } else if (result.cached) {
            showBanner(
                "info",
                "Loaded instantly from saved results (researched " + formatDateTime(result.cachedAt) + ")."
            );
        }

    } catch (error) {
        console.error("Comdal Backend Error:", error);

        // fetch() network failures are TypeError / AbortError. Our own Error(message) is already friendly.
        const isNetworkProblem =
            error instanceof TypeError || (error && error.name === "AbortError");

        showBanner("error", isNetworkProblem ? describeFetchError(error) : error.message);
        statusBanner.scrollIntoView({ behavior: "smooth", block: "center" });

    } finally {
        clearTimeout(timeoutId);
        setLoading(false);
    }
});