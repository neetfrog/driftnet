import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  DRIFT_SITES,
  filterSites,
  getRandomSite,
  DriftSite,
} from "./data/sites";
import SiteCard from "./components/SiteCard";
import DriftButton from "./components/DriftButton";
import MoodSelector from "./components/MoodSelector";
import DecadeFilter from "./components/DecadeFilter";
import TopicDrift from "./components/TopicDrift";
import RandomPortal from "./components/RandomPortal";
import DriftHistory from "./components/DriftHistory";
import ThreeAMOverlay from "./components/ThreeAMOverlay";
import StatBar from "./components/StatBar";
import GlitchText from "./components/GlitchText";
import WebringSidebar from "./components/WebringSidebar";
import DriftMeter from "./components/DriftMeter";
import LiveClock from "./components/LiveClock";
import {
  Moon,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Shuffle,
  Star,
  BookmarkPlus,
  Compass,
  Archive,
  Info,
} from "lucide-react";

type View = "browse" | "drift" | "saved";

export default function App() {
  const ITEMS_PER_PAGE = 12;
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [mood, setMood] = useState("all");
  const [decade, setDecade] = useState("all");
  const [topic, setTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [is3AM, setIs3AM] = useState(false);
  const [portalSite, setPortalSite] = useState<DriftSite | null>(null);
  const [driftHistory, setDriftHistory] = useState<DriftSite[]>([]);
  const [driftCount, setDriftCount] = useState(0);
  const [view, setView] = useState<View>("browse");
  const [savedSites, setSavedSites] = useState<DriftSite[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [titleGlitch, setTitleGlitch] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "decade" | "type">("default");
  const [showAbout, setShowAbout] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);

  // 3AM auto-detect
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      setIs3AM(true);
      setMood("3am");
    }
  }, []);

  // Glitch on title periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleGlitch(true);
      setTimeout(() => setTitleGlitch(false), 100);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Reset displayed items when filters change
  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE);
  }, [mood, decade, topic, searchQuery, ITEMS_PER_PAGE]);

  const filteredSites = useMemo(() => {
    const base = filterSites(DRIFT_SITES, mood, decade, topic, searchQuery);
    if (sortBy === "decade") {
      return [...base].sort((a, b) => a.decade.localeCompare(b.decade));
    }
    if (sortBy === "type") {
      return [...base].sort((a, b) => a.type.localeCompare(b.type));
    }
    return base;
  }, [mood, decade, topic, searchQuery, sortBy]);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedItems < filteredSites.length) {
          setDisplayedItems((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredSites.length));
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [displayedItems, filteredSites.length, ITEMS_PER_PAGE, filteredSites]);

  const handleDrift = useCallback(() => {
    const site = getRandomSite(DRIFT_SITES, mood, decade);
    setPortalSite(site);
    setDriftHistory((prev) => {
      const next = [...prev.filter((s) => s.id !== site.id), site].slice(-10);
      return next;
    });
    setDriftCount((c) => c + 1);
    setHighlightedId(site.id);
  }, [mood, decade]);

  const handleDriftFromCard = useCallback((site: DriftSite) => {
    setPortalSite(site);
    setDriftHistory((prev) => {
      const next = [...prev.filter((s) => s.id !== site.id), site].slice(-10);
      return next;
    });
    setDriftCount((c) => c + 1);
  }, []);

  const toggle3AM = () => {
    const next = !is3AM;
    setIs3AM(next);
    if (next) setMood("3am");
    else if (mood === "3am") setMood("all");
  };

  const toggleSave = (site: DriftSite) => {
    setSavedSites((prev) =>
      prev.find((s) => s.id === site.id)
        ? prev.filter((s) => s.id !== site.id)
        : [...prev, site]
    );
  };

  const isSaved = (site: DriftSite) => savedSites.some((s) => s.id === site.id);

  return (
    <div
      className={`min-h-screen relative transition-colors duration-1000
        ${is3AM ? "bg-[#050010]" : "bg-[#080c14]"}
      `}
    >
      <ThreeAMOverlay active={is3AM} />

      {/* Background grid */}
      <div
        className="fixed inset-0 z-0 opacity-[0.022]"
        style={{
          backgroundImage: `linear-gradient(rgba(120,80,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,80,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top radial glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl transition-colors duration-1000
            ${is3AM ? "bg-indigo-950/40" : "bg-violet-950/25"}`}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== HEADER ===== */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-fuchsia-800 flex items-center justify-center shadow-xl shadow-violet-950/60">
                <Compass size={20} className="text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-violet-300 animate-ping opacity-70" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-violet-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white leading-none">
                  <GlitchText text="DriftNet" active={titleGlitch} />
                </h1>
                <p className="text-slate-600 text-xs font-mono mt-0.5">internet wandering engine</p>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <LiveClock />

              {/* 3AM toggle */}
              <button
                onClick={toggle3AM}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-300
                  ${is3AM
                    ? "border-indigo-500/60 bg-indigo-950/80 text-indigo-300 shadow-lg shadow-indigo-950/50"
                    : "border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                  }
                `}
              >
                <Moon size={12} className={is3AM ? "text-indigo-400" : ""} />
                <span>3AM</span>
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${is3AM ? "bg-indigo-400 animate-pulse" : "bg-slate-700"}`} />
              </button>

              {/* About */}
              <button
                onClick={() => setShowAbout(!showAbout)}
                className="p-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all duration-200"
              >
                <Info size={14} />
              </button>
            </div>
          </div>

          {/* About panel */}
          {showAbout && (
            <div className="mt-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-sm text-slate-400 leading-relaxed max-w-2xl">
              <p className="mb-2">
                <span className="text-violet-400 font-semibold">DriftNet</span> is an internet wandering engine — the opposite of a social media feed.
                Instead of showing you what the algorithm thinks you want, it takes you to random, niche, forgotten, and weird corners of the web.
              </p>
              <p>
                Use <span className="text-slate-300">mood filters</span> to set the vibe,{" "}
                <span className="text-slate-300">decade filters</span> to pick an era,{" "}
                <span className="text-slate-300">topic drift</span> to narrow the space, or just hit{" "}
                <span className="text-violet-400 font-semibold">Drift</span> and let the internet take you somewhere.
              </p>
            </div>
          )}

          {/* Nav tabs */}
          <div className="flex gap-0.5 mt-6 border-b border-slate-800/80">
            {(["browse", "drift", "saved"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v as View)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-200 capitalize
                  ${view === v ? "text-violet-300" : "text-slate-600 hover:text-slate-400"}
                `}
              >
                {v}
                {v === "saved" && savedSites.length > 0 && (
                  <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-violet-900/60 text-violet-400 border border-violet-800/50">
                    {savedSites.length}
                  </span>
                )}
                {view === v && (
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* ===== DRIFT VIEW ===== */}
        {view === "drift" && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main drift area */}
            <div className="flex-1 flex flex-col items-center py-12 gap-8">
              <div className="text-center max-w-lg">
                <div className="text-6xl mb-4">🌐</div>
                <h2 className="text-3xl font-black text-white mb-3 leading-tight">
                  Let the internet take you
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                    somewhere unexpected
                  </span>
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Configure your mood and era below, then press Drift.
                  You'll be shown a random site from the pool — blogs, forums, archives, weird corners, forgotten gems.
                </p>
              </div>

              {/* Config */}
              <div className="w-full max-w-xl space-y-3">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-3">Mood / Vibe</p>
                  <MoodSelector selected={mood} onChange={setMood} is3AM={is3AM} />
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-3">Era / Decade</p>
                  <DecadeFilter selected={decade} onChange={setDecade} />
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-3">Topic (optional)</p>
                  <TopicDrift selected={topic} onChange={setTopic} />
                </div>
              </div>

              <DriftButton onClick={handleDrift} label="Drift Into the Unknown" />
              <StatBar filteredCount={filteredSites.length} driftCount={driftCount} />

              {/* History */}
              <div className="w-full max-w-xl">
                <DriftHistory history={driftHistory} onSelect={(s) => setPortalSite(s)} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-64 xl:w-72 space-y-4">
              <DriftMeter count={driftCount} />
              <WebringSidebar />

              {/* Tips */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-3">Drift Tips</p>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex gap-2"><span className="text-violet-500 shrink-0">→</span> Try <em className="text-slate-400">3AM mode</em> at night for the full experience</li>
                  <li className="flex gap-2"><span className="text-violet-500 shrink-0">→</span> Filter by <em className="text-slate-400">1990s</em> to find early web artifacts</li>
                  <li className="flex gap-2"><span className="text-violet-500 shrink-0">→</span> <em className="text-slate-400">Weird Corner</em> mood surfaces the strangest sites</li>
                  <li className="flex gap-2"><span className="text-violet-500 shrink-0">→</span> Save interesting finds with the <span className="text-amber-400">★</span> icon</li>
                  <li className="flex gap-2"><span className="text-violet-500 shrink-0">→</span> Browse all sites in the <em className="text-slate-400">browse</em> tab with filters</li>
                </ul>
              </div>

              {/* Archive link */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-start gap-3">
                <Archive size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">Wayback Machine</p>
                  <p className="text-[11px] text-slate-600 mb-2">Some links open archived snapshots from the Internet Archive.</p>
                  <a href="https://archive.org" target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-amber-600 hover:text-amber-500 transition-colors">
                    archive.org →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== BROWSE VIEW ===== */}
        {view === "browse" && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex gap-2 mb-4 flex-wrap sm:flex-nowrap">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Search the drift pool..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800
                      text-sm text-slate-300 placeholder-slate-700
                      focus:outline-none focus:border-violet-700/50 focus:bg-slate-900
                      transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800
                    text-xs text-slate-500 focus:outline-none focus:border-violet-700/50
                    transition-all duration-200 cursor-pointer"
                >
                  <option value="default">Default</option>
                  <option value="decade">By Era</option>
                  <option value="type">By Type</option>
                </select>

                {/* Filter toggle */}
                <button
                  onClick={() => setShowFilters((p) => !p)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800
                    text-xs text-slate-500 hover:text-slate-300 hover:border-slate-700
                    transition-all duration-200"
                >
                  <SlidersHorizontal size={12} />
                  <span className="hidden sm:inline">Filters</span>
                  {showFilters ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>

                {/* Quick drift */}
                <button
                  onClick={handleDrift}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                    bg-violet-900/40 hover:bg-violet-800/50 border border-violet-800/50 hover:border-violet-600/50
                    text-violet-400 hover:text-violet-300 text-xs font-medium
                    transition-all duration-200 whitespace-nowrap"
                >
                  <Shuffle size={12} />
                  <span>Quick Drift</span>
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mb-5 p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-4">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-slate-600 mb-2">Mood</p>
                    <MoodSelector selected={mood} onChange={setMood} is3AM={is3AM} />
                  </div>
                  <div className="border-t border-slate-800/80 pt-3">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-slate-600 mb-2">Era</p>
                    <DecadeFilter selected={decade} onChange={setDecade} />
                  </div>
                  <div className="border-t border-slate-800/80 pt-3">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-slate-600 mb-2">Topic</p>
                    <TopicDrift selected={topic} onChange={setTopic} />
                  </div>
                  {(mood !== "all" || decade !== "all" || topic !== "" || searchQuery !== "") && (
                    <div className="border-t border-slate-800/80 pt-3">
                      <button
                        onClick={() => { setMood("all"); setDecade("all"); setTopic(""); setSearchQuery(""); }}
                        className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors"
                      >
                        <X size={10} />
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <StatBar filteredCount={filteredSites.length} driftCount={driftCount} />
              </div>

              {/* Grid */}
              {filteredSites.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
                  <div className="text-4xl mb-3">🕸️</div>
                  <p className="text-slate-500 text-sm mb-2">No sites match these filters.</p>
                  <button
                    onClick={() => { setMood("all"); setDecade("all"); setTopic(""); setSearchQuery(""); }}
                    className="text-xs text-violet-500 hover:text-violet-400 transition-colors"
                  >
                    Clear filters →
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredSites.slice(0, displayedItems).map((site) => (
                      <div key={site.id} className="relative group/card">
                        <SiteCard
                          site={site}
                          isHighlighted={site.id === highlightedId}
                          onDrift={handleDriftFromCard}
                        />
                        {/* Save overlay button */}
                        <button
                          onClick={() => toggleSave(site)}
                          className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-all duration-200
                            opacity-0 group-hover/card:opacity-100 z-10
                            ${isSaved(site)
                              ? "bg-amber-900/70 border-amber-700/60 text-amber-400"
                              : "bg-slate-950/80 border-slate-700/60 text-slate-500 hover:text-slate-300"
                            }
                          `}
                          title={isSaved(site) ? "Remove from saved" : "Save site"}
                        >
                          {isSaved(site) ? <Star size={11} fill="currentColor" /> : <BookmarkPlus size={11} />}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Infinite scroll sentinel */}
                  <div ref={sentinelRef} className="mt-8 py-8 flex justify-center">
                    {displayedItems < filteredSites.length && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-700/60 animate-pulse" />
                        <span>Loading more sites...</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-700/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
                      </div>
                    )}
                    {displayedItems >= filteredSites.length && filteredSites.length > 0 && (
                      <p className="text-xs text-slate-700 text-center">
                        <span className="text-violet-700">✓</span> You've reached the end ({filteredSites.length} sites)
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Drift history */}
              <DriftHistory history={driftHistory} onSelect={(s) => setPortalSite(s)} />
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-60 xl:w-72 shrink-0 space-y-4">
              {/* Quick drift card */}
              <div className="rounded-xl border border-violet-800/40 bg-gradient-to-br from-violet-950/40 to-slate-900/60 p-5 text-center">
                <div className="text-3xl mb-2">🎲</div>
                <p className="text-sm text-slate-300 font-medium mb-1">Feeling lucky?</p>
                <p className="text-xs text-slate-600 mb-4">Let the drift engine take you somewhere random.</p>
                <button
                  onClick={() => { handleDrift(); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-violet-700/60 hover:bg-violet-600/70 border border-violet-600/40
                    text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Shuffle size={13} />
                  Random Drift
                </button>
              </div>

              <DriftMeter count={driftCount} />
              <WebringSidebar />

              {/* Saved quick access */}
              {savedSites.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-600">Saved</p>
                    <button onClick={() => setView("saved")} className="text-[10px] text-violet-500 hover:text-violet-400 transition-colors">
                      View all →
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {savedSites.slice(-4).reverse().map((site) => (
                      <button
                        key={site.id}
                        onClick={() => setPortalSite(site)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all duration-150 flex items-center gap-2"
                      >
                        <Star size={9} className="text-amber-500 shrink-0" fill="currentColor" />
                        {site.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== SAVED VIEW ===== */}
        {view === "saved" && (
          <div>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Saved Sites</h2>
                <p className="text-slate-500 text-sm">Your personal collection from the drift.</p>
              </div>
              {savedSites.length > 0 && (
                <button
                  onClick={() => setSavedSites([])}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
                >
                  <X size={10} />
                  Clear all
                </button>
              )}
            </div>

            {savedSites.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
                <div className="text-4xl mb-3">📌</div>
                <p className="text-slate-500 text-sm mb-3">Nothing saved yet.</p>
                <button
                  onClick={() => setView("browse")}
                  className="text-xs text-violet-500 hover:text-violet-400 transition-colors"
                >
                  ← Start browsing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {savedSites.map((site) => (
                  <div key={site.id} className="relative group/card">
                    <SiteCard
                      site={site}
                      isHighlighted={false}
                      onDrift={handleDriftFromCard}
                    />
                    <button
                      onClick={() => toggleSave(site)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg border transition-all duration-200
                        opacity-0 group-hover/card:opacity-100
                        bg-amber-900/70 border-amber-700/60 text-amber-400"
                      title="Remove from saved"
                    >
                      <Star size={11} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <footer className="mt-16 pt-6 border-t border-slate-900/80 flex items-center justify-between flex-wrap gap-4">
          <div className="text-[11px] text-slate-800 font-mono">
            DriftNet — an internet wandering engine — {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-700 font-mono">
              {DRIFT_SITES.length} sites in the pool
            </span>
            {is3AM && (
              <span className="text-[11px] font-mono text-indigo-800 animate-pulse">
                ◈ 3am mode active
              </span>
            )}
          </div>
        </footer>
      </div>

      {/* Random Portal Modal */}
      <RandomPortal
        site={portalSite}
        onClose={() => setPortalSite(null)}
        onNewDrift={handleDrift}
      />
    </div>
  );
}
