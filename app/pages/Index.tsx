import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { withBasePath } from "@/utils/base-path";
import { getRuntimeConfig } from "@/utils/runtime-config";
import { getPageMeta } from "@/utils/seo";
import { renderSEOTags } from "@/utils/seo-tags";
import { DEFAULT_SYMBOL } from "@/utils/storage";

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

  return (
    <>
      {renderSEOTags(pageMeta, appName)}
      {appDescription && (
        <Helmet>
          <meta name="description" content={appDescription} />
        </Helmet>
      )}
      <style>{LANDING_CSS}</style>
      <div className="tk-land">
        <div className="tk-glow" />

        <header className="tk-nav">
          <img
            src={withBasePath("/logo.webp")}
            alt="Tako DEX"
            className="tk-logo"
          />
          <Link to={appLink} className="tk-btn tk-btn-sm">
            Launch App
          </Link>
        </header>

        <main className="tk-hero">
          <div className="tk-kicker">Perpetuals DEX · Powered by Orderly</div>
          <h1 className="tk-h1">
            Trade Perpetuals,
            <br />
            <span className="tk-grad">On-Chain.</span>
          </h1>
          <p className="tk-sub">
            Pro-grade perps across 16+ chains. Low fees, deep liquidity, and
            full self-custody — your keys, your funds.
          </p>
          <div className="tk-cta">
            <Link to={appLink} className="tk-btn">
              Launch App →
            </Link>
            <Link to="/markets" className="tk-btn tk-ghost">
              Explore Markets
            </Link>
          </div>

          <div className="tk-cards">
            <div className="tk-card">
              <div className="tk-card-t">16+ Chains</div>
              <div className="tk-card-d">
                Trade from Ethereum, Arbitrum, Base, Solana and more — one
                unified orderbook, deposit from anywhere.
              </div>
            </div>
            <div className="tk-card">
              <div className="tk-card-t">Low Fees, Deep Liquidity</div>
              <div className="tk-card-d">
                CEX-grade matching with on-chain settlement. Tight spreads and
                real depth, not a thin pool.
              </div>
            </div>
            <div className="tk-card">
              <div className="tk-card-t">Self-Custody</div>
              <div className="tk-card-d">
                No deposits into a black box. You hold custody of your assets at
                every step. Your keys, your funds.
              </div>
            </div>
          </div>
        </main>

        <footer className="tk-foot">
          <div className="tk-foot-links">
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
          <div className="tk-foot-meta">
            © {new Date().getFullYear()} Tako · Powered by Orderly Network
          </div>
        </footer>
      </div>
    </>
  );
}

const LANDING_CSS = `
.tk-land{position:fixed;inset:0;overflow-y:auto;background:#08080d;color:#f4f4f8;
  font-family:'Manrope',system-ui,sans-serif;display:flex;flex-direction:column;min-height:100%}
.tk-glow{position:absolute;top:-12%;left:50%;transform:translateX(-50%);width:1100px;height:720px;
  max-width:130vw;background:radial-gradient(closest-side, rgba(124,77,255,.30), rgba(124,77,255,.06) 55%, transparent 72%);
  pointer-events:none;z-index:0}
.tk-nav{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;
  padding:22px clamp(18px,5vw,56px)}
.tk-logo{height:30px;width:auto;display:block}
.tk-hero{position:relative;z-index:2;flex:1;width:100%;max-width:1000px;margin:0 auto;
  padding:clamp(36px,8vh,104px) clamp(18px,5vw,40px) 60px;text-align:center}
.tk-kicker{font-size:13px;letter-spacing:.26em;text-transform:uppercase;color:#b79cff;font-weight:600;margin-bottom:22px}
.tk-h1{font-size:clamp(40px,8vw,76px);line-height:1.04;font-weight:800;letter-spacing:-.02em;margin:0 0 22px}
.tk-grad{background:linear-gradient(92deg,#4d6bff,#7c4dff 45%,#b23cff);-webkit-background-clip:text;background-clip:text;color:transparent}
.tk-sub{font-size:clamp(16px,2.2vw,20px);line-height:1.5;color:#9a9ab0;max-width:620px;margin:0 auto 36px}
.tk-cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:64px}
.tk-btn{display:inline-flex;align-items:center;justify-content:center;padding:15px 30px;border-radius:12px;
  font-weight:700;font-size:16px;text-decoration:none;color:#fff;
  background:linear-gradient(92deg,#4d6bff,#7c4dff 50%,#b23cff);box-shadow:0 10px 30px rgba(124,77,255,.32);
  transition:transform .1s ease,filter .15s ease;cursor:pointer}
.tk-btn:hover{filter:brightness(1.08);transform:translateY(-1px)}
.tk-btn-sm{padding:10px 20px;font-size:14px;border-radius:10px}
.tk-ghost{background:transparent;border:1px solid rgba(183,156,255,.4);color:#e7e2ff;box-shadow:none}
.tk-ghost:hover{border-color:#b79cff;background:rgba(124,77,255,.08)}
.tk-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;text-align:left;max-width:920px;margin:0 auto}
.tk-card{background:linear-gradient(180deg,rgba(20,20,28,.9),rgba(11,11,17,.9));border:1px solid rgba(255,255,255,.07);
  border-radius:16px;padding:24px}
.tk-card-t{font-weight:700;font-size:17px;margin-bottom:8px;color:#f4f4f8}
.tk-card-d{font-size:14px;line-height:1.5;color:#8f8fa6}
.tk-foot{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:16px;
  flex-wrap:wrap;padding:24px clamp(18px,5vw,56px);border-top:1px solid rgba(255,255,255,.06);color:#7a7a90;font-size:13px}
.tk-foot-links{display:flex;gap:20px}
.tk-foot-links a{color:#b79cff;text-decoration:none;font-weight:600}
.tk-foot-links a:hover{color:#fff}
.tk-foot-meta{opacity:.8}
@media(max-width:760px){.tk-cards{grid-template-columns:1fr}.tk-foot{justify-content:center;text-align:center}}
`;
