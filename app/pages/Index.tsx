import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { withBasePath } from "@/utils/base-path";
import { getRuntimeConfig } from "@/utils/runtime-config";
import { getPageMeta } from "@/utils/seo";
import { getUserLanguage } from "@/utils/seo";
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

const ICONS = [
  "M13 2 3 14h7l-1 8 10-12h-7l1-8z",
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20",
  "M4 20V10M10 20V4M16 20v-7M22 20h-20",
  "M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4zM9.5 12l1.8 1.8 3.7-3.7",
  "M5 19 19 5M8.5 8.5a2 2 0 1 1 0-.01M15.5 15.5a2 2 0 1 1 0-.01",
  "M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3",
];

const STR: Record<string, any> = {
  en: {
    kicker: "Perpetuals DEX · Powered by Orderly",
    h1a: "Trade Perps.",
    h1b: "Unleashed.",
    sub: "Pro-grade perpetuals across 16+ chains, up to 100x leverage and deep shared liquidity — with full self-custody.",
    trade: "Trade Perps",
    swap: "Instant Swap",
    launch: "Launch App",
    nav: {
      trade: "Trade",
      swap: "Swap",
      markets: "Markets",
      portfolio: "Portfolio",
      rewards: "Rewards",
      vaults: "Vaults",
      leaderboard: "Leaderboard",
    },
    stats: ["Chains", "Max leverage", "Markets", "Self-custody"],
    whyEy: "Why Tako",
    whyH: ["Built like a CEX.", "Owned like a wallet."],
    features: [
      {
        t: "CEX-grade speed",
        d: "Off-chain matching, on-chain settlement. Pro-level latency without giving up custody.",
      },
      {
        t: "Omnichain",
        d: "Deposit and trade from 16+ chains against one unified orderbook. No bridging headaches.",
      },
      {
        t: "Deep liquidity",
        d: "Shared liquidity across the whole Orderly network. Tight spreads, real depth, less slippage.",
      },
      {
        t: "Self-custody",
        d: "Your keys, your funds — always. No deposits into a black box, no custodial risk.",
      },
      {
        t: "Low fees",
        d: "Maker rebates and lean taker fees. More of your edge stays in your pocket.",
      },
      {
        t: "Up to 100x",
        d: "Trade 100+ perpetual markets with leverage up to 100x. Majors, alts and narratives.",
      },
    ],
    omniEy: "Omnichain",
    omniH: "Trade from anywhere.",
    omniS:
      "Deposit from your favorite chain and trade against one unified orderbook.",
    finalA: "The orderbook is ",
    finalB: "live.",
    finalS: "100+ markets. 100x leverage. Your move.",
    risk: "Trading derivatives involves risk.",
  },
  es: {
    kicker: "DEX de Perpetuos · Powered by Orderly",
    h1a: "Opera Perps.",
    h1b: "Sin Límites.",
    sub: "Perpetuos de nivel profesional en 16+ cadenas, hasta 100x de apalancamiento y liquidez compartida — con total autocustodia.",
    trade: "Operar Perps",
    swap: "Swap Instantáneo",
    launch: "Abrir App",
    nav: {
      trade: "Operar",
      swap: "Swap",
      markets: "Mercados",
      portfolio: "Portafolio",
      rewards: "Recompensas",
      vaults: "Bóvedas",
      leaderboard: "Ranking",
    },
    stats: ["Cadenas", "Apalancamiento máx.", "Mercados", "Autocustodia"],
    whyEy: "Por qué Tako",
    whyH: ["Hecho como un CEX.", "Tuyo como una wallet."],
    features: [
      {
        t: "Velocidad de CEX",
        d: "Matching off-chain, liquidación on-chain. Latencia profesional sin ceder la custodia.",
      },
      {
        t: "Omnichain",
        d: "Deposita y opera desde 16+ cadenas contra un solo orderbook. Sin líos de bridges.",
      },
      {
        t: "Liquidez profunda",
        d: "Liquidez compartida de toda la red Orderly. Spreads ajustados, profundidad real, menos slippage.",
      },
      {
        t: "Autocustodia",
        d: "Tus llaves, tus fondos — siempre. Sin depósitos en una caja negra, sin riesgo de custodia.",
      },
      {
        t: "Comisiones bajas",
        d: "Rebates de maker y comisiones taker ligeras. Más de tu ganancia se queda contigo.",
      },
      {
        t: "Hasta 100x",
        d: "Opera 100+ mercados de perpetuos con hasta 100x. Majors, alts y narrativas.",
      },
    ],
    omniEy: "Omnichain",
    omniH: "Opera desde donde sea.",
    omniS:
      "Deposita desde tu cadena favorita y opera contra un solo orderbook.",
    finalA: "El orderbook está ",
    finalB: "activo.",
    finalS: "100+ mercados. 100x de apalancamiento. Tu jugada.",
    risk: "Operar derivados implica riesgo.",
  },
  pt: {
    kicker: "DEX de Perpétuos · Powered by Orderly",
    h1a: "Opere Perps.",
    h1b: "Sem Limites.",
    sub: "Perpétuos de nível profissional em 16+ redes, até 100x de alavancagem e liquidez compartilhada — com total autocustódia.",
    trade: "Operar Perps",
    swap: "Swap Instantâneo",
    launch: "Abrir App",
    nav: {
      trade: "Operar",
      swap: "Swap",
      markets: "Mercados",
      portfolio: "Portfólio",
      rewards: "Recompensas",
      vaults: "Cofres",
      leaderboard: "Ranking",
    },
    stats: ["Redes", "Alavancagem máx.", "Mercados", "Autocustódia"],
    whyEy: "Por que Tako",
    whyH: ["Feito como uma CEX.", "Seu como uma wallet."],
    features: [
      {
        t: "Velocidade de CEX",
        d: "Matching off-chain, liquidação on-chain. Latência profissional sem abrir mão da custódia.",
      },
      {
        t: "Omnichain",
        d: "Deposite e opere de 16+ redes contra um único orderbook. Sem dor de cabeça com bridges.",
      },
      {
        t: "Liquidez profunda",
        d: "Liquidez compartilhada de toda a rede Orderly. Spreads apertados, profundidade real, menos slippage.",
      },
      {
        t: "Autocustódia",
        d: "Suas chaves, seus fundos — sempre. Sem depósitos numa caixa-preta, sem risco de custódia.",
      },
      {
        t: "Taxas baixas",
        d: "Rebates de maker e taxas taker enxutas. Mais do seu lucro fica no seu bolso.",
      },
      {
        t: "Até 100x",
        d: "Opere 100+ mercados de perpétuos com até 100x. Majors, alts e narrativas.",
      },
    ],
    omniEy: "Omnichain",
    omniH: "Opere de qualquer lugar.",
    omniS: "Deposite da sua rede favorita e opere contra um único orderbook.",
    finalA: "O orderbook está ",
    finalB: "ativo.",
    finalS: "100+ mercados. 100x de alavancagem. Sua vez.",
    risk: "Operar derivativos envolve risco.",
  },
};

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

function useCountUp(target: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const dur = 1400;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const v = useCountUp(value);
  return (
    <div className="tk-stat">
      <b>
        {v}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  );
}

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
const STAT_VALS = [
  { v: 16, s: "+" },
  { v: 100, s: "x" },
  { v: 100, s: "+" },
  { v: 100, s: "%" },
];

export default function Index() {
  const [searchParams] = useSearchParams();
  const qs = searchParams.toString();
  const appLink = `/perp/${DEFAULT_SYMBOL}${qs ? `?${qs}` : ""}`;
  const swapLink = `/swap${qs ? `?${qs}` : ""}`;

  const lang = (getUserLanguage() || "en").slice(0, 2);
  const t = STR[lang] || STR.en;

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
      <Helmet>
        {appDescription && <meta name="description" content={appDescription} />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <style>{LANDING_CSS}</style>
      <div className="tk">
        <div className="tk-aurora" />
        <div className="tk-orb o1" />
        <div className="tk-orb o2" />
        <div className="tk-orb o3" />
        <div className="tk-grid">
          <div className="tk-grid-inner" />
        </div>

        <header className="tk-nav">
          <img
            src={withBasePath("/logo.webp")}
            alt="Tako DEX"
            className="tk-logo"
          />
          <nav className="tk-nav-links">
            <Link to={appLink}>{t.nav.trade}</Link>
            <Link to={swapLink}>{t.nav.swap}</Link>
            <Link to="/markets">{t.nav.markets}</Link>
            <Link to="/portfolio">{t.nav.portfolio}</Link>
            <Link to="/rewards">{t.nav.rewards}</Link>
            <Link to="/vaults">{t.nav.vaults}</Link>
            <Link to="/leaderboard">{t.nav.leaderboard}</Link>
          </nav>
          <Link to={appLink} className="tk-btn tk-btn-sm">
            {t.launch}
          </Link>
        </header>

        {ticker.length > 0 && (
          <div className="tk-ticker">
            <div className="tk-ticker-track">
              {ticker.map((m, i) => (
                <Link
                  className="tk-tick"
                  key={i}
                  to={`/perp/${m.symbol}${qs ? `?${qs}` : ""}`}
                  title={`${t.nav.trade} ${m.sym}-PERP`}
                >
                  <b>{m.sym}</b>
                  <span className="tk-tick-p">${fmtPrice(m.price)}</span>
                  <span className={m.chg >= 0 ? "up" : "down"}>
                    {m.chg >= 0 ? "▲" : "▼"} {Math.abs(m.chg).toFixed(2)}%
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <section className="tk-hero">
          <div className="tk-kicker reveal">
            <span className="tk-dot" /> {t.kicker}
          </div>
          <h1 className="tk-h1 reveal">
            {t.h1a}
            <br />
            <span className="tk-grad">{t.h1b}</span>
          </h1>
          <p className="tk-sub reveal">{t.sub}</p>
          <div className="tk-cta reveal">
            <Link to={appLink} className="tk-btn tk-btn-hero">
              ⚡ {t.trade} →
            </Link>
            <Link to={swapLink} className="tk-btn tk-btn-hero2">
              ⇄ {t.swap}
            </Link>
          </div>
          <div className="tk-stats reveal">
            {STAT_VALS.map((s, i) => (
              <Stat key={i} value={s.v} suffix={s.s} label={t.stats[i]} />
            ))}
          </div>
        </section>

        <section className="tk-section">
          <div className="tk-eyebrow reveal">{t.whyEy}</div>
          <h2 className="tk-h2 reveal">
            {t.whyH[0]}
            <br />
            {t.whyH[1]}
          </h2>
          <div className="tk-grid-cards">
            {t.features.map((f: any, i: number) => (
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
                  <path d={ICONS[i]} />
                </svg>
                <div className="tk-card-t">{f.t}</div>
                <div className="tk-card-d">{f.d}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="tk-section tk-chains-sec">
          <div className="tk-eyebrow reveal">{t.omniEy}</div>
          <h2 className="tk-h2 reveal">{t.omniH}</h2>
          <p className="tk-sub2 reveal">{t.omniS}</p>
          <div className="tk-chains reveal">
            {CHAINS.map((c) => (
              <span className="tk-chain" key={c}>
                {c}
              </span>
            ))}
          </div>
        </section>

        <section className="tk-final reveal">
          <h2 className="tk-final-h">
            {t.finalA}
            <span className="tk-grad">{t.finalB}</span>
          </h2>
          <p className="tk-sub2">{t.finalS}</p>
          <div className="tk-cta">
            <Link to={appLink} className="tk-btn tk-btn-hero">
              ⚡ {t.trade} →
            </Link>
            <Link to={swapLink} className="tk-btn tk-btn-hero2">
              ⇄ {t.swap}
            </Link>
          </div>
        </section>

        <footer className="tk-foot">
          <div className="tk-foot-row">
            <img
              src={withBasePath("/logo.webp")}
              alt="Tako DEX"
              className="tk-logo"
            />
            <div className="tk-foot-links">
              <Link to="/markets">{t.nav.markets}</Link>
              <Link to="/portfolio">{t.nav.portfolio}</Link>
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
            © {new Date().getFullYear()} Tako · Powered by Orderly Network ·{" "}
            {t.risk}
          </div>
        </footer>
      </div>
    </>
  );
}

const LANDING_CSS = `
::selection{background:#e5fa37;color:#000}
.tk{position:fixed;inset:0;overflow-y:auto;overflow-x:hidden;background:#000;color:#f5f5fa;font-family:'Inter',system-ui,sans-serif}
.tk h1,.tk h2,.tk .tk-stat b,.tk .tk-btn,.tk-kicker,.tk-eyebrow,.tk-card-t,.tk-tick b{font-family:'Outfit','Inter',system-ui,sans-serif}
.tk-aurora{position:fixed;inset:-25% -10% auto -10%;height:95vh;z-index:0;pointer-events:none;opacity:.85;
  background:
    radial-gradient(38% 48% at 20% 16%, rgba(115,62,230,.34), transparent 70%),
    radial-gradient(34% 42% at 82% 10%, rgba(229,250,55,.10), transparent 70%),
    radial-gradient(52% 50% at 50% -4%, rgba(115,62,230,.36), transparent 72%);
  animation:tkAurora 16s ease-in-out infinite alternate}
@keyframes tkAurora{0%{transform:translate3d(-3%,0,0) scale(1)}100%{transform:translate3d(4%,2%,0) scale(1.14)}}
.tk-orb{position:fixed;border-radius:50%;filter:blur(70px);opacity:.28;z-index:0;pointer-events:none;animation:tkFloat 15s ease-in-out infinite}
.tk-orb.o1{width:360px;height:360px;background:#733ee6;top:6%;left:-70px}
.tk-orb.o2{width:300px;height:300px;background:#e5fa37;top:24%;right:-60px;animation-delay:-4s;opacity:.13}
.tk-orb.o3{width:280px;height:280px;background:#5b3ed0;top:48%;left:38%;animation-delay:-8s;opacity:.2}
@keyframes tkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(46px)}}
.tk-grid{position:fixed;bottom:0;left:0;right:0;height:60vh;z-index:0;pointer-events:none;perspective:340px;opacity:.4;
  -webkit-mask-image:linear-gradient(to top,#000 0%,transparent 92%);mask-image:linear-gradient(to top,#000 0%,transparent 92%)}
.tk-grid-inner{position:absolute;inset:0;transform:rotateX(74deg);transform-origin:bottom center;
  background-image:linear-gradient(rgba(115,62,230,.55) 1px,transparent 1px),linear-gradient(90deg,rgba(115,62,230,.42) 1px,transparent 1px);
  background-size:46px 46px;animation:tkGridMove 2.4s linear infinite}
@keyframes tkGridMove{0%{background-position:0 0}100%{background-position:0 46px}}

.tk-nav{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:22px;padding:14px clamp(16px,5vw,56px);
  backdrop-filter:blur(12px);background:rgba(0,0,0,.6);border-bottom:1px solid #18181c}
.tk-logo{height:30px;width:auto;display:block}
.tk-nav-links{display:flex;gap:22px;margin-left:14px;flex:1;min-width:0;overflow-x:auto;white-space:nowrap;scrollbar-width:none}
.tk-nav-links::-webkit-scrollbar{display:none}
.tk-nav-links a{color:rgba(245,245,250,.72);text-decoration:none;font-size:14.5px;font-weight:500;transition:color .15s;flex:0 0 auto}
.tk-nav-links a:hover{color:#e5fa37}
@media(max-width:560px){.tk-nav-links{display:none}}

.tk-btn{display:inline-flex;align-items:center;justify-content:center;padding:13px 26px;border-radius:12px;font-weight:700;font-size:15px;
  text-decoration:none;color:#fff;white-space:nowrap;letter-spacing:.01em;background:linear-gradient(92deg,#733ee6,#8557ee);
  box-shadow:0 8px 26px rgba(115,62,230,.4);transition:transform .1s ease,filter .15s ease;cursor:pointer}
.tk-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}
.tk-btn-sm{padding:9px 18px;font-size:14px;border-radius:10px}
.tk-btn-hero{position:relative;overflow:hidden;padding:18px 40px;font-size:17px;border-radius:14px;text-transform:uppercase;letter-spacing:.03em;animation:tkPulse 2.6s ease-in-out infinite}
.tk-btn-hero::after{content:"";position:absolute;top:0;left:-70%;width:45%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent);transform:skewX(-18deg);animation:tkShine 3.4s ease-in-out infinite}
@keyframes tkPulse{0%,100%{box-shadow:0 10px 30px rgba(115,62,230,.45),0 0 0 0 rgba(115,62,230,.45)}50%{box-shadow:0 16px 50px rgba(115,62,230,.7),0 0 40px 7px rgba(115,62,230,.4)}}
@keyframes tkShine{0%{left:-70%}45%,100%{left:140%}}
.tk-btn-hero2{padding:18px 36px;font-size:17px;border-radius:14px;background:transparent;color:#eef7c0;text-transform:uppercase;letter-spacing:.03em;
  border:1.5px solid rgba(229,250,55,.5);box-shadow:0 0 24px rgba(229,250,55,.1) inset}
.tk-btn-hero2:hover{border-color:#e5fa37;background:rgba(229,250,55,.1);color:#e5fa37}

.tk-ticker{position:relative;z-index:5;overflow:hidden;border-bottom:1px solid #18181c;background:rgba(245,245,250,.025);white-space:nowrap}
.tk-ticker-track{display:inline-flex;gap:34px;padding:10px 0;animation:tkMarquee 40s linear infinite}
.tk-ticker:hover .tk-ticker-track{animation-play-state:paused}
@keyframes tkMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.tk-tick{display:inline-flex;align-items:center;gap:9px;font-size:15px;font-variant-numeric:tabular-nums;text-decoration:none;cursor:pointer;padding:4px 12px;border-radius:9px;transition:background .15s,transform .12s}
.tk-tick:hover{background:rgba(115,62,230,.18);transform:translateY(-1px)}
.tk-tick:hover b{color:#e5fa37}
.tk-tick b{color:#fff;font-weight:700;letter-spacing:.02em}
.tk-tick-p{color:#c9c9d8}
.tk-tick .up{color:#25e0a4}
.tk-tick .down{color:#ff5d6c}

.tk-hero{position:relative;z-index:5;text-align:center;max-width:1000px;margin:0 auto;padding:clamp(58px,12vh,140px) clamp(18px,5vw,40px) clamp(44px,8vh,90px)}
.tk-kicker{display:inline-flex;align-items:center;gap:9px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#c3aaff;font-weight:600;margin-bottom:26px;padding:7px 16px;border:1px solid rgba(133,87,238,.32);border-radius:999px;background:rgba(115,62,230,.1)}
.tk-dot{width:8px;height:8px;border-radius:50%;background:#25e0a4;box-shadow:0 0 10px #25e0a4;animation:tkBlink 1.6s ease-in-out infinite}
@keyframes tkBlink{50%{opacity:.35}}
.tk-h1{font-size:clamp(52px,11vw,120px);line-height:.94;font-weight:900;letter-spacing:-.02em;text-transform:uppercase;margin:0 0 26px}
.tk-grad{color:#e5fa37;text-shadow:0 0 34px rgba(229,250,55,.28)}
.tk-sub{font-size:clamp(16px,2.2vw,22px);line-height:1.55;color:rgba(245,245,250,.62);max-width:600px;margin:0 auto 38px}
.tk-cta{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}

.tk-stats{display:flex;justify-content:center;gap:clamp(24px,7vw,72px);margin-top:66px;flex-wrap:wrap}
.tk-stat{display:flex;flex-direction:column;gap:5px}
.tk-stat b{font-size:clamp(34px,5vw,58px);font-weight:800;background:linear-gradient(92deg,#8557ee,#e5fa37);-webkit-background-clip:text;background-clip:text;color:transparent;font-variant-numeric:tabular-nums;line-height:1}
.tk-stat span{font-size:13px;color:rgba(245,245,250,.5);letter-spacing:.05em}

.tk-section{position:relative;z-index:5;max-width:1140px;margin:0 auto;padding:clamp(54px,10vh,110px) clamp(18px,5vw,40px)}
.tk-eyebrow{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#e5fa37;font-weight:700;margin-bottom:14px;text-align:center}
.tk-h2{font-size:clamp(32px,5.5vw,60px);font-weight:900;letter-spacing:-.025em;text-transform:uppercase;text-align:center;margin:0 0 14px;line-height:1}
.tk-sub2{text-align:center;color:rgba(245,245,250,.62);font-size:clamp(15px,1.9vw,18px);max-width:560px;margin:0 auto 18px;line-height:1.5}

.tk-grid-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:46px}
.tk-card{background:#0a0a0c;border:1px solid #18181c;border-radius:20px;padding:30px;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
.tk-card:hover{transform:translateY(-5px);border-color:rgba(115,62,230,.6);box-shadow:0 22px 60px rgba(115,62,230,.18)}
.tk-ico{width:32px;height:32px;color:#9a6bff;margin-bottom:16px}
.tk-card:hover .tk-ico{color:#e5fa37}
.tk-card-t{font-weight:700;font-size:19px;margin-bottom:8px;letter-spacing:.01em}
.tk-card-d{font-size:15px;line-height:1.55;color:rgba(245,245,250,.55)}

.tk-chains{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;margin-top:36px}
.tk-chain{padding:11px 20px;border-radius:999px;border:1px solid #18181c;background:rgba(245,245,250,.03);color:rgba(245,245,250,.8);font-size:15px;font-weight:500;transition:.15s}
.tk-chain:hover{border-color:rgba(229,250,55,.6);color:#e5fa37;background:rgba(229,250,55,.07)}

.tk-final{position:relative;z-index:5;text-align:center;max-width:820px;margin:0 auto;padding:clamp(64px,12vh,130px) clamp(18px,5vw,40px);border-top:1px solid #18181c}
.tk-final-h{font-family:'Outfit','Inter',sans-serif;font-size:clamp(38px,7vw,78px);font-weight:900;letter-spacing:-.02em;text-transform:uppercase;line-height:1;margin:0 0 14px}
.tk-final .tk-cta{margin-top:26px}

.tk-foot{position:relative;z-index:5;border-top:1px solid #18181c;padding:30px clamp(18px,5vw,56px);display:flex;flex-direction:column;gap:14px}
.tk-foot-row{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
.tk-foot-links{display:flex;gap:22px;flex-wrap:wrap}
.tk-foot-links a{color:rgba(245,245,250,.7);text-decoration:none;font-weight:600;font-size:14px;transition:color .15s}
.tk-foot-links a:hover{color:#e5fa37}
.tk-foot-meta{color:rgba(245,245,250,.35);font-size:12.5px}

.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
.reveal.in{opacity:1;transform:none}

@media(max-width:860px){.tk-grid-cards{grid-template-columns:1fr}.tk-orb{filter:blur(50px)}}
@media(prefers-reduced-motion:reduce){.tk-aurora,.tk-orb,.tk-grid-inner,.tk-btn-hero,.tk-btn-hero::after,.tk-dot,.tk-ticker-track{animation:none}}
`;
