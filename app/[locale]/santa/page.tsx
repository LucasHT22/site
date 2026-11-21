import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { buildPageMetadata } from "@/lib/seo";

const YEAR = 2026;
const SIGNUPS_OPEN = true;
const FORM_URL = `https://forms.hackclub.com/${YEAR}-secret-santa-form`;
const RULES_URL = "https://hackclub.slack.com/archives/C01D7AHKMPF/p1671483616032169";
const OG_IMAGE = "https://cloud-9kgqrlg7o-hack-club-bot.vercel.app/0santa.png";
const ORPHEUS_IMAGE =
  "https://cdn.hackclub.com/01a1ff7c-db82-7b14-8adf-807097f12a07/secret_santa.png";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Santa" });
  return buildPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    canonical: "/santa",
    locale,
    image: OG_IMAGE,
    imageAlt: t("metaTitle"),
  });
}

const SNOWFLAKES = Array.from({ length: 60 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: `${(r(1) * 100).toFixed(2)}%`,
    size: 3 + Math.round(r(2) * 6),
    duration: `${(8 + r(3) * 12).toFixed(2)}s`,
    delay: `${(-r(4) * 20).toFixed(2)}s`,
    drift: `${Math.round((r(5) - 0.5) * 80)}px`,
    opacity: (0.5 + r(6) * 0.5).toFixed(2),
  };
});

export default async function SantaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Santa");

  return (
    <main id="main" tabIndex={-1} className="santa-page">
      <section className="santa-hero">
        <div className="santa-snow" aria-hidden="true">
          {SNOWFLAKES.map((f, i) => (
            <span
              key={i}
              style={
                {
                  left: f.left,
                  width: f.size,
                  height: f.size,
                  opacity: f.opacity,
                  animationDuration: f.duration,
                  animationDelay: f.delay,
                  "--drift": f.drift,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <Navbar />

        <div className="santa-shell">
          <p className="santa-intro">
            <span className="santa-fade" style={{ animationDelay: "300ms" }}>
              {t("introLine1", { year: YEAR })}{" "}
            </span>
            <span className="santa-fade" style={{ animationDelay: "1200ms" }}>
              {t("introLine2")}
              <br />
            </span>
            <span className="santa-fade" style={{ animationDelay: "2300ms" }}>
              {t("introLine3")}
            </span>
          </p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="santa-orpheus"
            src={ORPHEUS_IMAGE}
            alt={t("orpheusAlt")}
            width={384}
            height={384}
          />

          <div className="santa-fade" style={{ animationDelay: "3300ms" }}>
            <h1 className="santa-title">{t("title")}</h1>
            <p className="santa-lede">{t("lede")}</p>

            {SIGNUPS_OPEN ? (
              <form className="santa-form" method="get" action={FORM_URL}>
                <h2 className="santa-form__title">{t("formTitle")}</h2>
                <p className="santa-form__note">
                  {t.rich("formRulesNote", {
                    rules: (chunks) => (
                      <a href={RULES_URL} target="_blank" rel="noopener noreferrer">
                        {chunks}
                      </a>
                    ),
                  })}
                </p>

                <label className="santa-field">
                  <span>{t("nameLabel")}</span>
                  <input name="name" type="text" placeholder={t("namePlaceholder")} required />
                </label>
                <label className="santa-field">
                  <span>{t("likesLabel")}</span>
                  <input name="likes" type="text" placeholder={t("likesPlaceholder")} required />
                </label>
                <label className="santa-field">
                  <span>{t("dislikesLabel")}</span>
                  <input
                    name="dislikes"
                    type="text"
                    placeholder={t("dislikesPlaceholder")}
                    required
                  />
                </label>

                <button type="submit" className="santa-button">
                  <span className="santa-button__incomplete">{t("submitIncomplete")}</span>
                  <span className="santa-button__ready">{t("submitReady")}</span>
                </button>
              </form>
            ) : (
              <button type="button" className="santa-button santa-button--closed" disabled>
                {t("signupsClosed")}
              </button>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .santa-page {
          background: var(--background);
          color: var(--foreground);
          overflow-x: hidden;
        }

        .santa-hero {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          text-align: center;
          background: linear-gradient(to right bottom, #2d9ee4, #298fce);
          padding: 140px 0 96px;
        }

        .santa-shell {
          position: relative;
          z-index: 2;
          width: min(1000px, calc(100vw - 48px));
          margin: 0 auto;
        }

        /* ── snow ── */
        .santa-snow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .santa-snow span {
          position: absolute;
          top: -12px;
          border-radius: 50%;
          background: #fff;
          animation-name: santa-snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes santa-snowfall {
          to {
            transform: translate(var(--drift), calc(100vh + 200px));
          }
        }

        /* ── fade-in (replaces old <FadeIn>) ── */
        .santa-fade {
          opacity: 0;
          animation: santa-fade-in 600ms ease-out forwards;
        }
        @keyframes santa-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }

        .santa-intro {
          margin: 0 0 32px;
          font-family: var(--font-phantom);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          font-size: clamp(1.5rem, 3.4vw, 2.25rem);
          line-height: 1.25;
          color: rgba(255, 255, 255, 0.8);
        }

        .santa-orpheus {
          display: block;
          margin: 0 auto;
          width: min(384px, 80vw);
          height: auto;
          animation: santa-float 8s cubic-bezier(.55,.03,.43,.98) infinite alternate;
        }
        @keyframes santa-float {
          from { transform: translateY(20px) rotate(0deg); }
          to { transform: translateY(-20px) rotate(5deg); }
        }

        .santa-title {
          margin: 24px auto 0;
          font-family: var(--font-zarathustra);
          font-weight: 400;
          font-size: clamp(2.6rem, 6vw, 4.5rem);
          line-height: 1.05;
          color: #fff;
        }

        .santa-lede {
          max-width: 48rem;
          margin: 18px auto;
          font-family: var(--font-phantom);
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          line-height: 1.5;
          color: #f9f9fa;
        }

        /* ── form ── */
        .santa-form {
          display: grid;
          width: min(512px, 100%);
          margin: 32px auto 0;
          padding: 32px;
          border-radius: 18px;
          background: var(--background);
          color: var(--foreground);
          text-align: left;
          box-shadow: 0 10px 28px rgba(23, 23, 29, 0.18);
        }
        .santa-form__title {
          margin: 0 0 8px;
          font-family: var(--font-zarathustra);
          font-weight: 400;
          font-size: 2rem;
        }
        .santa-form__note {
          margin: 0 0 8px;
          font-family: var(--font-phantom);
          color: var(--muted);
        }
        .santa-form__note a {
          color: #338eda;
          text-decoration: underline;
        }

        .santa-field {
          display: grid;
          gap: 6px;
          margin: 8px 0;
          font-family: var(--font-phantom);
        }
        .santa-field span {
          font-size: 18px;
          color: var(--muted);
        }
        .santa-field input {
          font: inherit;
          font-size: 16px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--foreground);
          outline: none;
        }
        .santa-field input:focus {
          box-shadow: 0 0 0 2px #338eda;
        }

        .santa-button {
          margin-top: 16px;
          padding: 14px 20px;
          border: none;
          border-radius: 9999px;
          background: #338eda;
          color: #fff;
          font-family: var(--font-phantom);
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .santa-button:hover { transform: scale(1.02); }

        /* "Finish N fields" vs "Sign up!" without client JS */
        .santa-button__ready { display: none; }
        .santa-form:valid .santa-button__incomplete { display: none; }
        .santa-form:valid .santa-button__ready { display: inline; }
        .santa-form:invalid .santa-button { opacity: 0.75; }

        .santa-button--closed {
          margin-top: 32px;
          background: var(--red);
          cursor: not-allowed;
          opacity: 0.9;
        }
        .santa-button--closed:hover { transform: none; }

        @media (max-width: 767px) {
          .santa-shell { width: calc(100vw - 32px); }
          .santa-hero { padding: 108px 0 64px; }
          .santa-form { padding: 24px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .santa-snow { display: none; }
          .santa-orpheus { animation: none; }
          .santa-fade { animation: none; opacity: 1; }
        }
      `}</style>
    </main>
  );
}
