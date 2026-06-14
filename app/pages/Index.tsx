import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { withBasePath } from "@/utils/base-path";
import { getRuntimeConfig } from "@/utils/runtime-config";
import { getPageMeta } from "@/utils/seo";
import { renderSEOTags } from "@/utils/seo-tags";
import { DEFAULT_SYMBOL } from "@/utils/storage";

const MAJORS = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "XRP",
  "DOGE",
  "AVAX",
  "LINK",
  "SUI",
  "ARB",
];

function fmtPrice(p: number) {
  if (!isFinite(p)) return "—";
  if (p >= 1000) return p.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (p >= 1)
    return p.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  if (p >= 0.01) return p.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return p.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function useMarkets() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    let alive = true;
    const load = () => {
      fetch("https://api.orderly.org/v1/public/futures")
        .then((r) => r.json())
        .then((d) => {
          if (!alive || !d?.data?.rows) return;
          const map: Record<string, any> = {};
          d.data.rows.forEach((r: any) => (map[r.display_symbol_name] = r));
          const picked = MAJORS.map((s) => map[s])
            .filter(Boolean)
            .map((r: any) => ({
              sym: r.display_symbol_name,
              symbol: r.symbol,
              price: r.mark_price,
              chg: r["24h_open"] ? (r.mark_price / r["24h_open"] - 1) * 100 : 0,
            }));
          setRows(picked);
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 10000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return rows;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (ents) =>
        ents.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const FEATURES = [
  {
    t: "CEX-grade speed",
    d: "Off-chain matching, on-chain settlement. Pro-level latency without giving up custody.",
    i: "M13 2 3 14h7l-1 8 10-12h-7l1-8z",
  },
  {
    t: "Omnichain",
    d: "Deposit and trade from 16+ chains against one unified orderbook. No bridging headaches.",
    i: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20",
  },
  {
    t: "Deep liquidity",
    d: "Shared liquidity across the whole Orderly network. Tight spreads, real depth, less slippage.",
    i: "M4 20V10M10 20V4M16 20v-7M22 20h-20",
  },
  {
    t: "Self-custody",
    d: "Your keys, your funds — always. No deposits into a black box, no custodial risk.",
    i: "M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4zM9.5 12l1.8 1.8 3.7-3.7",
  },
  {
    t: "Low fees",
    d: "Maker rebates and lean taker fees. More of your edge stays in your pocket.",
    i: "M5 19 19 5M8.5 8.5a2 2 0 1 1 0-.01M15.5 15.5a2 2 0 1 1 0-.01",
  },
  {
    t: "Up to 100x",
    d: "Trade 100+ perpetual markets with leverage up to 100x. Majors, alts and narratives.",
    i: "M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3",
  },
];

const CHAINS = [
  "Ethereum",
  "Arbitrum",
  "Base",
  "BNB Chain",
  "Solana",
  "Optimism",
  "Mantle",
  "Avalanche",
  "Polygon",
  "Berachain",
  "Sei",
  "Abstract",
];

export default function Index() {
  const [searchParams] = useSearchParams();
  const qs = searchParams.toString();
  const appLink = `/perp/${DEFAULT_SYMBOL}${qs ? `?${qs}` : ""}`;

  const pageMeta = getPageMeta();
  const appName = getRuntimeConfig("VITE_APP_NAME") || "Tako DEX";
  const appDescription = getRuntimeConfig("VITE_APP_DESCRIPTION");
  const x = getRuntimeConfig("VITE_TWITTER_URL");
  const discord = getRuntimeConfig("VITE_DISCORD_URL");
  const telegram = getRuntimeConfig("VITE_TELEGRAM_URL");

  const markets = useMarkets();
  useReveal();

  const ticker = markets.length ? markets.concat(markets) : [];

  return (
    <>
      {renderSEOTags(pageMeta, appName)}
      {appDescription && (
        <Helmet>
          <meta name="description" content={appDescription} />
        </Helmet>
      )}
      <style>{LANDING_CSS}</style>
      <div className="tk">
        <div className="tk-aurora" />

        {/* NAV */}
        <header className="tk-nav">
          <img
            src={withBasePath("/logo.webp")}
            alt="Tako DEX"
            className="tk-logo"
          />
          <nav className="tk-nav-links">
            <Link to="/markets">Markets</Link>
            <Link to="/vaults">Vaults</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </nav>
          <Link to={appLink} className="tk-btn tk-btn-sm">
            Launch App
          </Link>
        </header>

        {/* LIVE TICKER */}
        {ticker.length > 0 && (
          <div className="tk-ticker">
            <div className="tk-ticker-track">
              {ticker.map((m, i) => (
                <span className="tk-tick" key={i}>
                  <b>{m.sym}</b>
                  <span className="tk-tick-p">${fmtPrice(m.price)}</span>
                  <span className={m.chg >= 0 ? "up" : "down"}>
                    {m.chg >= 0 ? "▲" : "▼"} {Math.abs(m.chg).toFixed(2)}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* HERO */}
        <section className="tk-hero">
          <div className="tk-kicker reveal">
            Perpetuals DEX · Powered by Orderly
          </div>
          <h1 className="tk-h1 reveal">
            Trade Perpetuals.
            <br />
            <span className="tk-grad">On-Chain. Unleashed.</span>
          </h1>
          <p className="tk-sub reveal">
            Pro-grade perps across 16+ chains, up to 100x leverage, deep shared
            liquidity — with full self-custody. Your keys, your funds.
          </p>
          <div className="tk-cta reveal">
            <Link to={appLink} className="tk-btn">
              Launch App →
            </Link>
            <Link to="/markets" className="tk-btn tk-ghost">
              Explore Markets
            </Link>
          </div>

          <div className="tk-stats reveal">
            <div className="tk-stat">
              <b>16+</b>
              <span>Chains</span>
            </div>
            <div className="tk-stat">
              <b>100x</b>
              <span>Max leverage</span>
            </div>
            <div className="tk-stat">
              <b>100+</b>
              <span>Markets</span>
            </div>
            <div className="tk-stat">
              <b>100%</b>
              <span>Self-custody</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="tk-section">
          <div className="tk-eyebrow reveal">Why Tako</div>
          <h2 className="tk-h2 reveal">
            Built like a CEX. Owned like a wallet.
          </h2>
          <div className="tk-grid">
            {FEATURES.map((f, i) => (
              <div className="tk-card reveal" key={i}>
                <svg
                  viewBox="0 0 24 24"
                  className="tk-ico"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={f.i} />
                </svg>
                <div className="tk-card-t">{f.t}</div>
                <div className="tk-card-d">{f.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CHAINS */}
        <section className="tk-section tk-chains-sec">
          <div className="tk-eyebrow reveal">Omnichain</div>
          <h2 className="tk-h2 reveal">Trade from anywhere.</h2>
          <p className="tk-sub2 reveal">
            Deposit from your favorite chain and trade against one unified
            orderbook.
          </p>
          <div className="tk-chains reveal">
            {CHAINS.map((c) => (
              <span className="tk-chain" key={c}>
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="tk-final reveal">
          <h2 className="tk-h2">Ready to trade?</h2>
          <p className="tk-sub2">
            The orderbook is live. The markets are open. Your move.
          </p>
          <Link to={appLink} className="tk-btn tk-btn-lg">
            Launch Tako DEX →
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="tk-foot">
          <div className="tk-foot-row">
            <img
              src={withBasePath("/logo.webp")}
              alt="Tako DEX"
              className="tk-logo"
            />
            <div className="tk-foot-links">
              <Link to="/markets">Markets</Link>
              <Link to="/portfolio">Portfolio</Link>
              {x && (
                <a href={x} target="_blank" rel="noreferrer">
                  X
                </a>
              )}
              {discord && (
                <a href={discord} target="_blank" rel="noreferrer">
                  Discord
                </a>
              )}
              {telegram && (
                <a href={telegram} target="_blank" rel="noreferrer">
                  Telegram
                </a>
              )}
            </div>
          </div>
          <div className="tk-foot-meta">
            © {new Date().getFullYear()} Tako · Powered by Orderly Network ·
            Trading derivatives involves risk.
          </div>
        </footer>
      </div>
    </>
  );
}

const LANDING_CSS = `
.tk{position:fixed;inset:0;overflow-y:auto;overflow-x:hidden;background:#07070c;color:#f4f4f8;
  font-family:'Manrope',system-ui,sans-serif;scroll-behavior:smooth}
.tk-aurora{position:fixed;inset:-20% -10% auto -10%;height:90vh;z-index:0;pointer-events:none;opacity:.9;
  background:
    radial-gradient(40% 50% at 22% 18%, rgba(77,107,255,.30), transparent 70%),
    radial-gradient(38% 45% at 80% 12%, rgba(178,60,255,.26), transparent 70%),
    radial-gradient(50% 50% at 50% 0%, rgba(124,77,255,.30), transparent 72%);
  animation:tkAurora 16s ease-in-out infinite alternate}
@keyframes tkAurora{0%{transform:translate3d(-3%,0,0) scale(1)}100%{transform:translate3d(4%,2%,0) scale(1.12)}}

.tk-nav{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:22px;
  padding:14px clamp(16px,5vw,56px);backdrop-filter:blur(12px);
  background:rgba(7,7,12,.55);border-bottom:1px solid rgba(255,255,255,.06)}
.tk-logo{height:28px;width:auto;display:block}
.tk-nav-links{display:flex;gap:26px;margin-left:14px;flex:1}
.tk-nav-links a{color:#b9b9cc;text-decoration:none;font-size:15px;font-weight:500;transition:color .15s}
.tk-nav-links a:hover{color:#fff}

.tk-btn{display:inline-flex;align-items:center;justify-content:center;padding:13px 26px;border-radius:12px;
  font-weight:700;font-size:15px;text-decoration:none;color:#fff;white-space:nowrap;
  background:linear-gradient(92deg,#4d6bff,#7c4dff 52%,#b23cff);box-shadow:0 8px 26px rgba(124,77,255,.35);
  transition:transform .1s ease,filter .15s ease;cursor:pointer}
.tk-btn:hover{filter:brightness(1.09);transform:translateY(-1px)}
.tk-btn-sm{padding:9px 18px;font-size:14px;border-radius:10px}
.tk-btn-lg{padding:17px 38px;font-size:17px;border-radius:14px}
.tk-ghost{background:transparent;border:1px solid rgba(183,156,255,.4);color:#e7e2ff;box-shadow:none}
.tk-ghost:hover{border-color:#b79cff;background:rgba(124,77,255,.10)}

.tk-ticker{position:relative;z-index:5;overflow:hidden;border-bottom:1px solid rgba(255,255,255,.06);
  background:rgba(255,255,255,.02);white-space:nowrap}
.tk-ticker-track{display:inline-flex;gap:38px;padding:11px 0;animation:tkMarquee 42s linear infinite}
.tk-ticker:hover .tk-ticker-track{animation-play-state:paused}
@keyframes tkMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.tk-tick{display:inline-flex;align-items:center;gap:9px;font-size:14px;font-variant-numeric:tabular-nums}
.tk-tick b{color:#fff;font-weight:700}
.tk-tick-p{color:#c9c9d8}
.tk-tick .up{color:#25e0a4}
.tk-tick .down{color:#ff5d6c}

.tk-hero{position:relative;z-index:5;text-align:center;max-width:920px;margin:0 auto;
  padding:clamp(56px,11vh,130px) clamp(18px,5vw,40px) clamp(40px,7vh,80px)}
.tk-kicker{font-size:13px;letter-spacing:.26em;text-transform:uppercase;color:#b79cff;font-weight:600;margin-bottom:22px}
.tk-h1{font-size:clamp(42px,8.5vw,84px);line-height:1.02;font-weight:800;letter-spacing:-.025em;margin:0 0 24px}
.tk-grad{background:linear-gradient(95deg,#5b86ff,#9a6bff 45%,#c84dff);-webkit-background-clip:text;background-clip:text;color:transparent}
.tk-sub{font-size:clamp(16px,2.1vw,20px);line-height:1.55;color:#9d9db4;max-width:600px;margin:0 auto 34px}
.tk-cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}

.tk-stats{display:flex;justify-content:center;gap:clamp(22px,6vw,64px);margin-top:60px;flex-wrap:wrap}
.tk-stat{display:flex;flex-direction:column;gap:4px}
.tk-stat b{font-size:clamp(26px,4vw,40px);font-weight:800;background:linear-gradient(92deg,#7c4dff,#b23cff);
  -webkit-background-clip:text;background-clip:text;color:transparent;font-variant-numeric:tabular-nums}
.tk-stat span{font-size:13px;color:#8a8aa0;letter-spacing:.04em}

.tk-section{position:relative;z-index:5;max-width:1120px;margin:0 auto;padding:clamp(50px,9vh,100px) clamp(18px,5vw,40px)}
.tk-eyebrow{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#7c4dff;font-weight:700;margin-bottom:14px;text-align:center}
.tk-h2{font-size:clamp(28px,4.5vw,46px);font-weight:800;letter-spacing:-.02em;text-align:center;margin:0 0 14px}
.tk-sub2{text-align:center;color:#9d9db4;font-size:clamp(15px,1.9vw,18px);max-width:560px;margin:0 auto 18px;line-height:1.5}

.tk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:42px}
.tk-card{background:linear-gradient(180deg,rgba(22,22,32,.85),rgba(11,11,18,.85));
  border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:28px;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
.tk-card:hover{transform:translateY(-4px);border-color:rgba(124,77,255,.5);box-shadow:0 18px 50px rgba(124,77,255,.14)}
.tk-ico{width:30px;height:30px;color:#9a6bff;margin-bottom:16px}
.tk-card-t{font-weight:700;font-size:18px;margin-bottom:8px}
.tk-card-d{font-size:14.5px;line-height:1.55;color:#9090a6}

.tk-chains{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:34px}
.tk-chain{padding:10px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.1);
  background:rgba(255,255,255,.03);color:#c8c8d8;font-size:14px;font-weight:500;transition:.15s}
.tk-chain:hover{border-color:rgba(124,77,255,.6);color:#fff;background:rgba(124,77,255,.08)}

.tk-final{position:relative;z-index:5;text-align:center;max-width:760px;margin:0 auto;
  padding:clamp(56px,10vh,110px) clamp(18px,5vw,40px);border-top:1px solid rgba(255,255,255,.06)}
.tk-final .tk-btn-lg{margin-top:22px}

.tk-foot{position:relative;z-index:5;border-top:1px solid rgba(255,255,255,.06);
  padding:30px clamp(18px,5vw,56px);display:flex;flex-direction:column;gap:14px}
.tk-foot-row{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
.tk-foot-links{display:flex;gap:22px;flex-wrap:wrap}
.tk-foot-links a{color:#b79cff;text-decoration:none;font-weight:600;font-size:14px}
.tk-foot-links a:hover{color:#fff}
.tk-foot-meta{color:#6f6f86;font-size:12.5px}

.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.reveal.in{opacity:1;transform:none}

@media(max-width:860px){
  .tk-grid{grid-template-columns:1fr}
  .tk-nav-links{display:none}
}
`;
