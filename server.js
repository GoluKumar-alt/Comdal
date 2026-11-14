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
async function searchOneTopic(companyName, industry, topic) {
    // FIX: keep the company name strong. Long generic topic words (like "CEO
    // biography education leadership") used to pull in other companies, so we
    // quote the name and use only the first few topic words.
    const terms = (topicSearchTerms[topic] || topic).split(" ").slice(0, 6).join(" ");
    const industryPart = industry && industry !== "Other" ? industry : "";
    const query = cleanQuery(['"' + companyName + '"', industryPart, terms].join(" "));

    const response = await tvly.search(query, {
        searchDepth: TOPIC_SEARCH_DEPTH,
        maxResults: RESULTS_PER_TOPIC,
        includeAnswer: true
    });

    const results = (response.results || []).map(item => ({ ...item, topics: [topic] }));

    // FIX: also return a short written answer for this topic. The old code only
    // tried to pick sentences with fixed keywords, which fails when the page
    // says the same thing in different words (e.g. "promoted by" instead of "founder").
    // The answer is used only if at least one result really mentions the company.
    const related = results.filter(item => mentionsCompany(item, companyName));

    return {
        topic,
        results,
        answer: related.length > 0 ? String(response.answer || "").trim() : ""
    };
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
            // 1 overview search (gives the summary) + 1 search per topic
            const jobs = [
                () => searchOverview(companyName, industry),
                ...topicsToSearch.map(topic => () => searchOneTopic(companyName, industry, topic))
            ];

            const settled = await runInBatches(jobs, PARALLEL_SEARCHES);

            const failures = settled.filter(item => item.status === "rejected");
            const successes = settled.filter(item => item.status === "fulfilled");

            // Everything failed -> report the real error (bad key, rate limit, network...)
            if (successes.length === 0) {
                throw failures[0].reason;
            }

            if (failures.length > 0) {
                console.warn(failures.length + " of " + settled.length + " searches failed:",
                    String(failures[0].reason?.message || failures[0].reason));
            }

            const overviewOutcome = settled[0];
            const overview = overviewOutcome.status === "fulfilled"
                ? overviewOutcome.value
                : { answer: "", results: [] };

            const topicResults = settled
                .slice(1)
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
            const relevantResults = mergedResults.filter(item => mentionsCompany(item, companyName));
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