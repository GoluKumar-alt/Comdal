// ==========================================
// COMDAL - COMPANY RESEARCH BACKEND
// Complete Updated server.js (per-topic research)
// ==========================================

const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./setup.env" });

const { tavily } = require("@tavily/core");

const app = express();
const PORT = process.env.PORT || 3000;


// ==========================================
// 1. TAVILY CONFIGURATION
// ==========================================

if (!process.env.TAVILY_API_KEY) {
    console.error("TAVILY_API_KEY is missing in setup.env");
    process.exit(1);
}

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

// Research settings (change here if you want fewer / more Tavily requests)
const RESULTS_PER_TOPIC = 5;       // sources fetched for each topic
const PARALLEL_SEARCHES = 6;       // how many Tavily requests run at the same time
const TOPIC_SEARCH_DEPTH = "basic"; // "basic" = 1 credit, "advanced" = 2 credits per topic


// ==========================================
// 2. MIDDLEWARE
// ==========================================

// ALLOWED_ORIGIN (optional): comma separated list of frontend URLs,
// e.g. "https://comdal.vercel.app,https://comdal.netlify.app"
// If not set, every origin is allowed (fine for local development).
const allowedOrigins = (process.env.ALLOWED_ORIGIN || "")
    .split(",")
    .map(origin => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: "100kb" }));


// ==========================================
// 3. TOPIC SEARCH TERMS
// ==========================================

const topicSearchTerms = {
    "Company Overview":
        "company overview business profile main products headquarters founded year",

    "Company History":
        "company history founding year founders major milestones timeline",

    "Founder & CEO Details":
        "founder co-founder current CEO biography education leadership executive team",

    "Products & Services":
        "main products services solutions portfolio pricing use cases",

    "Company Mission & Vision":
        "official mission statement vision core values company purpose",

    "Company Size (Employees)":
        "total number of employees headcount workforce size global offices",

    "Annual Revenue / Business Growth":
        "annual revenue turnover financial growth rate fiscal year performance",

    "Competitors":
        "top competitors rival companies market alternatives competitive advantage",

    "Market Position":
        "market position market share industry ranking target market global presence",

    "Company Branches & Locations":
        "headquarters office locations branches countries of operation",

    "Contact Information":
        "official headquarters address customer support phone email website",

    "Career & Job Opportunities":
        "official careers page current job openings job titles vacancies qualifications required skills experience work location internships",

    "Latest News & Updates":
        "latest company news recent announcements product launches updates",

    "Customer Reviews & Reputation":
        "customer reviews ratings company reputation feedback satisfaction",

    "Social Media Presence":
        "official social media accounts LinkedIn Instagram Facebook YouTube Twitter",

    "Company Awards & Recognitions":
        "company awards recognitions honors certifications achievements",

    "Company Stock Information":
        "company stock shares ticker symbol stock exchange share price market cap",

    "Company Policies & Ethics":
        "company policies code of conduct business ethics privacy workplace policies",

    "Company Partnerships & Collaborations":
        "company partnerships collaborations strategic alliances joint ventures",

    "Company Sustainability & CSR Initiatives":
        "company sustainability CSR initiatives environmental net zero social impact",

    "Company Financial Statements":
        "company financial statements annual report revenue net profit assets liabilities cash flow",

    "Company Legal & Regulatory Compliance":
        "company legal regulatory compliance authorities lawsuits settlements",

    "Company Patents & Intellectual Property":
        "company patents intellectual property trademarks innovations",

    "Company Press Releases":
        "official company press releases media announcements newsroom",

    "Company Events & Conferences":
        "company events conferences summits webinars exhibitions",

    "Company Research & Development":
        "company research and development R&D labs innovation new technologies",

    "Company Industry Trends & Insights":
        "industry trends market outlook sector growth opportunities challenges",

    "Company SWOT Analysis":
        "company SWOT analysis strengths weaknesses opportunities threats"
};


// ==========================================
// 3B. IN-MEMORY CACHE (24 HOURS)
// ==========================================
// Same company + industry + topics => instant result, no new Tavily request.
// Entries older than 24h are "stale": they are only used as a fallback when
// Tavily itself fails (expired key, no internet, rate limit...).

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;          // fresh for 24 hours
const CACHE_KEEP_MS = 7 * 24 * 60 * 60 * 1000;     // stale fallback kept for 7 days
const CACHE_MAX_ENTRIES = 200;

const researchCache = new Map();

function makeCacheKey(companyName, industry, topics) {
    const name = String(companyName).toLowerCase().replace(/\s+/g, " ").trim();
    const sortedTopics = [...topics].map(t => String(t).trim()).sort();
    return JSON.stringify([name, String(industry).trim(), sortedTopics]);
}

function getCacheEntry(key) {
    const entry = researchCache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.savedAt;
    if (age > CACHE_KEEP_MS) {
        researchCache.delete(key);
        return null;
    }
    return { ...entry, fresh: age <= CACHE_TTL_MS };
}

function saveCacheEntry(key, data) {
    researchCache.delete(key); // re-insert so Map order = oldest first
    researchCache.set(key, { data, savedAt: Date.now() });

    while (researchCache.size > CACHE_MAX_ENTRIES) {
        researchCache.delete(researchCache.keys().next().value);
    }
}

setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of researchCache) {
        if (now - entry.savedAt > CACHE_KEEP_MS) researchCache.delete(key);
    }
}, 60 * 60 * 1000).unref();


// ==========================================
// 3C. FRIENDLY ERROR CLASSIFIER
// ==========================================

function classifyResearchError(error) {
    const status = error?.status || error?.statusCode || error?.response?.status;
    const text = String(error?.message || error || "");
    const code = error?.code || error?.cause?.code || "";

    if (status === 401 || status === 403 || /api key|unauthori[sz]ed|forbidden|invalid key/i.test(text)) {
        return {
            httpStatus: 502,
            code: "API_KEY_INVALID",
            message: "The research service rejected our API key. It may be invalid or expired - please update TAVILY_API_KEY."
        };
    }

    if (status === 429 || status === 432 || status === 433 || /rate limit|too many requests|usage limit|quota|exceeds your plan/i.test(text)) {
        return {
            httpStatus: 429,
            code: "RATE_LIMITED",
            message: "The research service limit has been reached. Please try again in a little while."
        };
    }

    if (["ENOTFOUND", "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EAI_AGAIN", "UND_ERR_CONNECT_TIMEOUT"].includes(code) ||
        /fetch failed|network|timeout|timed out|getaddrinfo/i.test(text)) {
        return {
            httpStatus: 503,
            code: "NETWORK_ERROR",
            message: "The server could not reach the research service. Please check the internet connection and try again."
        };
    }

    return {
        httpStatus: 500,
        code: "RESEARCH_FAILED",
        message: "Company research failed. Please try again."
    };
}


// ==========================================
// 3D. PER-TOPIC RESEARCH HELPERS
// ==========================================
// Old version: ONE search with all topic words joined together and cut at
// 380 characters, so for "All About Company" only the first few topics were
// ever searched. New version: one short search per topic, merged together.

// Sites that publish MCA (Ministry of Corporate Affairs) company data
const INDIA_COMPANY_SITES = [
    "tofler.in",
    "instafinancials.com",
    "thecompanycheck.com",
    "qorpiq.com",
    "paperli.ai",
    "filesure.in",
    "zaubacorp.com",
    "indiafilings.com",
    "infyner.com",
    "mca.gov.in",
    "careratings.com",
    "screener.in"
];

// Topics whose facts are usually found on those sites
const DIRECTORY_TOPICS = new Set([
    "Founder & CEO Details",
    "Company History",
    "Company Overview",
    "Company Size (Employees)",
    "Company Branches & Locations",
    "Contact Information",
    "Annual Revenue / Business Growth",
    "Company Financial Statements",
    "Company Legal & Regulatory Compliance",
    "Company Stock Information"
]);

function cleanQuery(text) {
    return String(text).replace(/\s+/g, " ").trim().slice(0, 380);
}

// Runs the jobs a few at a time so we do not hit Tavily rate limits.
async function runInBatches(jobs, batchSize) {
    const settled = [];

    for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);
        const part = await Promise.allSettled(batch.map(job => job()));
        settled.push(...part);
    }

    return settled;
}

// Search one topic and mark every result with the topic it was found for.
// Answers like "The sources do not provide ..." or answers that talk about other
// companies are useless, so they are not shown.
const NEGATIVE_ANSWER = /(do(es)?\s+not|don't|doesn't|did\s+not|no)\s+(specific\s+)?(provide|mention|specify|contain|include|list|have|information|details)|not\s+(found|available|mentioned|specified|provided)|cannot\s+(find|be\s+determined)|unable\s+to\s+(find|determine)/i;

function isUsableAnswer(answer, relatedCount, foundCount) {
    const text = String(answer || "").trim();
    if (text.length <= 30) return false;
    if (NEGATIVE_ANSWER.test(text)) return false;
    // most of the pages behind the answer must really be about this company
    return foundCount > 0 && relatedCount / foundCount >= 0.5;
}

// India: Corporate Identification Number, e.g. U55101CH1988PLC008156.
// It identifies exactly one company, so it is the best way to avoid look-alike names.
function findCIN(texts) {
    const regex = /\b[UL]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b/g;
    const counts = new Map();

    texts.forEach(text => {
        (String(text || "").match(regex) || []).forEach(cin => {
            counts.set(cin, (counts.get(cin) || 0) + 1);
        });
    });

    let best = "";
    let bestCount = 0;
    counts.forEach((count, cin) => {
        if (count > bestCount) {
            best = cin;
            bestCount = count;
        }
    });

    return best;
}

// Decides if a page is about THIS company.
//  - CIN found in the page or its URL            -> yes
//  - official name has Limited/Ltd/Pvt (strict)  -> the full official name must appear
//    (so "OCEAN ORBIT RESORT" no longer matches "Orbit Resorts Limited")
//  - otherwise                                   -> the typed name must appear
function makeCompanyMatcher(companyName, officialName, cin) {
    const official = normalizeForMatch(officialName || "");
    const hasLegalSuffix = /\b(limited|ltd|inc|corporation|corp|pvt|private|llc)$/.test(official);
    const cinLower = String(cin || "").toLowerCase();

    const variants = [official];
    if (/\blimited$/.test(official)) variants.push(official.replace(/\blimited$/, "ltd"));
    if (/\bltd$/.test(official)) variants.push(official.replace(/\bltd$/, "limited"));

    return function matches(item) {
        const url = String(item.url || "").toLowerCase();
        if (cinLower && url.includes(cinLower)) return true;

        const text = normalizeForMatch((item.title || "") + " " + (item.content || ""));
        if (cinLower && text.replace(/ /g, "").includes(cinLower)) return true;

        if (hasLegalSuffix) {
            return variants.some(name => name && text.includes(name));
        }

        return mentionsCompany(item, companyName);
    };
}

// companyName    = what the user typed
// searchName     = the full official name found in the overview (e.g. "Orbit Resorts Limited")
// matcher        = tells if a page is really about this company
// cin            = company registration number if one was found (India), else ""
async function searchOneTopic(companyName, searchName, industry, topic, matcher, cin) {
    const industryPart = industry && industry !== "Other" ? industry : "";

    // Short, plain label of the topic: "Founder & CEO Details" -> "Founder CEO Details"
    const shortLabel = topic
        .replace(/^Company\s+/i, "")
        .replace(/[&/()]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    // Attempt 1: official name + a few topic words.
    // Attempt 2 (only if attempt 1 found nothing about this company): official name + topic label.
    const attempts = [
        { query: cleanQuery(['"' + searchName + '"', industryPart,
            (topicSearchTerms[topic] || topic).split(" ").slice(0, 6).join(" ")].join(" ")) },
        { query: cleanQuery(['"' + searchName + '"', shortLabel].join(" ")) }
    ];

    // Attempt 3: Indian company-data sites. The MCA portal itself (mca.gov.in) is a
    // login/captcha form, so search engines cannot read it, but these sites copy its
    // data (directors, designations, registered office, filings).
    if (DIRECTORY_TOPICS.has(topic)) {
        const extra = topic === "Founder & CEO Details"
            ? "directors managing director CEO DIN"
            : shortLabel;

        attempts.push({
            query: cleanQuery([cin, '"' + searchName + '"', extra].filter(Boolean).join(" ")),
            domains: INDIA_COMPANY_SITES
        });
    }

    let results = [];
    let answer = "";

    for (let i = 0; i < attempts.length; i++) {
        const searchOptions = {
            searchDepth: TOPIC_SEARCH_DEPTH,
            maxResults: RESULTS_PER_TOPIC,
            includeAnswer: true
        };

        if (attempts[i].domains) {
            searchOptions.includeDomains = attempts[i].domains;
        }

        const response = await tvly.search(attempts[i].query, searchOptions);

        const found = (response.results || []).map(item => ({ ...item, topics: [topic] }));
        const related = found.filter(item => matcher(item));
        const usable = isUsableAnswer(response.answer, related.length, found.length);

        console.log("  [" + topic + "] try " + (i + 1) + ": " + found.length + " results, " +
            related.length + " about the company, usable answer: " + (usable ? "yes" : "no"));

        results = results.concat(found);

        // Use the written answer only if it is a real answer and mostly based on this company's pages.
        // Otherwise try the next search.
        if (usable) {
            answer = String(response.answer).trim();
            break;
        }
    }

    return { topic, results, answer };
}

// "orbit resort" typed by the user -> "Orbit Resorts Limited" found in the overview text.
function findOfficialName(userName, texts) {
    const words = normalizeForMatch(userName).split(" ").filter(Boolean);
    if (words.length === 0) return userName;

    const escaped = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const suffixes = "(?:Limited|Ltd|Inc|Corporation|Corp|Pvt|Private|LLC|Company|Group|Technologies|Industries)";
    const pattern = "\\b" + escaped.join("[\\s-]+") + "s?(?:\\s+" + suffixes + ")*\\b";
    const regex = new RegExp(pattern, "gi");

    const counts = new Map();

    texts.forEach(text => {
        const found = String(text || "").match(regex) || [];
        found.forEach(name => {
            const clean = name.replace(/\s+/g, " ").trim();
            const key = clean.toLowerCase();
            const entry = counts.get(key) || { name: clean, count: 0 };
            entry.count += 1;
            counts.set(key, entry);
        });
    });

    let best = null;
    counts.forEach(entry => {
        if (!best || entry.count > best.count ||
            (entry.count === best.count && entry.name.length > best.name.length)) {
            best = entry;
        }
    });

    return best ? best.name : userName;
}

// One general search that also gives the Executive Summary.
async function searchOverview(companyName, industry) {
    const industryPart = industry && industry !== "Other" ? industry : "";
    const query = cleanQuery([
        '"' + companyName + '"',
        industryPart,
        "company overview history headquarters products founders"
    ].join(" "));

    const response = await tvly.search(query, {
        searchDepth: "advanced",
        includeAnswer: "advanced",
        maxResults: 10
    });

    return {
        answer: response.answer || "",
        results: (response.results || []).map(item => ({ ...item, topics: [] }))
    };
}

// FIX: drop pages that never mention the searched company.
// "orbit resort" must not return "In Orbit Aerospace" or "Orbitz".
function normalizeForMatch(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function mentionsCompany(item, companyName) {
    const name = normalizeForMatch(companyName);
    if (!name) return true;

    const text = normalizeForMatch((item.title || "") + " " + (item.content || ""));
    if (text.includes(name)) return true;

    // "Space X" should also match "SpaceX"
    const nameCompact = name.replace(/ /g, "");
    return nameCompact.length >= 4 && text.replace(/ /g, "").includes(nameCompact);
}

// Merge results by URL. If the same page is found for several topics, keep it once
// and remember all its topics.
function mergeResults(resultLists) {
    const byUrl = new Map();

    resultLists.flat().forEach(item => {
        if (!item || !item.url) return;

        const key = String(item.url).trim().toLowerCase().replace(/\/+$/, "");
        const existing = byUrl.get(key);

        if (!existing) {
            byUrl.set(key, { ...item, topics: [...(item.topics || [])] });
            return;
        }

        (item.topics || []).forEach(topic => {
            if (!existing.topics.includes(topic)) existing.topics.push(topic);
        });

        // keep the longer text, it usually has more facts
        if (String(item.content || "").length > String(existing.content || "").length) {
            existing.content = item.content;
        }
    });

    return Array.from(byUrl.values());
}


// ==========================================
// 4. TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("Comdal Backend is Running!");
});

// Health check (used by Render / Railway)
app.get("/health", (req, res) => {
    res.json({ status: "ok", cachedResearches: researchCache.size });
});


// ==========================================
// 5. COMPANY RESEARCH ROUTE
// ==========================================

app.post("/api/company-research", async (req, res) => {
    try {
        const {
            companyName,
            companyAddress,
            companyEmail,
            companyWebsite,
            industry,
            topics
        } = req.body;

        // Validate required inputs
        if (
            !companyName ||
            !industry ||
            !Array.isArray(topics) ||
            topics.length === 0
        ) {
            return res.status(400).json({
                success: false,
                code: "BAD_REQUEST",
                message: "Please provide company name, industry, and at least one topic."
            });
        }

        const cacheKey = makeCacheKey(companyName, industry, topics);
        const cached = getCacheEntry(cacheKey);
        const forceRefresh = req.body.forceRefresh === true;

        // 1) Fresh cache hit -> instant answer, no Tavily request
        if (cached && cached.fresh && !forceRefresh) {
            console.log("CACHE HIT:", companyName);
            return res.json({
                ...cached.data,
                cached: true,
                stale: false,
                cachedAt: new Date(cached.savedAt).toISOString()
            });
        }

        // Which topics need their own search
        const topicsToSearch = topics.includes("All About Company")
            ? Object.keys(topicSearchTerms)
            : topics.filter(topic => topic !== "All About Company");

        console.log("--------------------------------");
        console.log("COMDAL RESEARCH STARTED");
        console.log("Company:", companyName);
        console.log("Topics to search:", topicsToSearch.length, topicsToSearch);
        console.log("--------------------------------");

        try {
            // Step 1: overview search first (gives the summary AND the official company name).
            // If this fails (bad key, rate limit, network) the real error is reported.
            const overview = await searchOverview(companyName, industry);

            const overviewTexts = [
                overview.answer,
                ...overview.results
                    .filter(item => mentionsCompany(item, companyName))
                    .map(item => (item.title || "") + " " + (item.content || "") + " " + (item.url || ""))
            ];

            const searchName = findOfficialName(companyName, overviewTexts);
            const cin = findCIN(overviewTexts);
            const matcher = makeCompanyMatcher(companyName, searchName, cin);

            console.log("Official name used for topic searches:", searchName);
            console.log("Company registration number (CIN):", cin || "not found");

            // overview pages are checked again with the strict matcher
            const strictOverview = overview.results.filter(item => matcher(item));
            overview.results = strictOverview.length > 0 ? strictOverview : overview.results;

            // Step 2: one search per topic, using the official name
            const jobs = topicsToSearch.map(topic => () => searchOneTopic(companyName, searchName, industry, topic, matcher, cin));
            const settled = await runInBatches(jobs, PARALLEL_SEARCHES);

            const failures = settled.filter(item => item.status === "rejected");

            if (failures.length > 0) {
                console.warn(failures.length + " of " + settled.length + " topic searches failed:",
                    String(failures[0].reason?.message || failures[0].reason));
            }

            const topicResults = settled
                .filter(item => item.status === "fulfilled")
                .map(item => item.value);

            const topicAnswers = {};
            topicResults.forEach(item => {
                if (item.answer && item.answer.length > 30) {
                    topicAnswers[item.topic] = item.answer;
                }
            });

            const mergedResults = mergeResults([overview.results, ...topicResults.map(item => item.results)]);

            // keep only pages that really mention this company
            let relevantResults = mergedResults.filter(item => matcher(item));
            if (relevantResults.length === 0) {
                relevantResults = mergedResults.filter(item => mentionsCompany(item, companyName));
            }
            const searchResults = relevantResults.length > 0 ? relevantResults : mergedResults;

            console.log("Research Results Found:", searchResults.length,
                "(removed " + (mergedResults.length - relevantResults.length) + " unrelated)");

            const payload = {
                success: true,
                message: "Comdal topic-based research completed!",
                company: {
                    companyName,
                    companyAddress,
                    companyEmail,
                    companyWebsite,
                    industry,
                    topics
                },
                aiSummary: overview.answer || "",
                topicAnswers,
                searchResults,
                partial: failures.length > 0
            };

            // Do not cache a partly failed research for 24 hours
            if (failures.length === 0) {
                saveCacheEntry(cacheKey, payload);
            }

            return res.json({ ...payload, cached: false, stale: false });

        } catch (searchError) {
            console.error("Tavily Research Error:", searchError);

            // 2) Tavily failed -> use an older saved result if we have one
            if (cached) {
                console.log("SERVING STALE CACHE:", companyName);
                return res.json({
                    ...cached.data,
                    cached: true,
                    stale: true,
                    cachedAt: new Date(cached.savedAt).toISOString()
                });
            }

            const friendly = classifyResearchError(searchError);
            return res.status(friendly.httpStatus).json({
                success: false,
                code: friendly.code,
                message: friendly.message
            });
        }

    } catch (error) {
        console.error("Unexpected Server Error:", error);

        res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something went wrong on the server. Please try again."
        });
    }
});


// ==========================================
// 6. START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`Comdal server running at http://localhost:${PORT}`);
});