"use client";

import { useEffect, useState } from "react";
import { COPY, LOCATIONS, REGISTRIES, embedSrc, mapsLink, wazeLink, type Lang } from "./copy";
import { ChurchIcon, Cross, Fairway, Laurel, MapsIcon, PinFlag, WazeIcon } from "./icons";

const LS_LANG = "bautizo_lang";
const LS_UNLOCKED = "bautizo_unlocked_v1";

export default function BautizoPage() {
  const [lang, setLang] = useState<Lang>("es");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem(LS_LANG) as Lang | null;
      if (storedLang === "es" || storedLang === "en") setLang(storedLang);
      if (localStorage.getItem(LS_UNLOCKED) === "1") setUnlocked(true);
    } catch {}
  }, []);

  const updateLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LS_LANG, l);
    } catch {}
  };

  const onUnlock = () => {
    setUnlocked(true);
    try {
      localStorage.setItem(LS_UNLOCKED, "1");
    } catch {}
  };

  if (!unlocked) {
    return <PasswordGate lang={lang} setLang={updateLang} onUnlock={onUnlock} />;
  }

  return (
    <>
      <TopBar lang={lang} setLang={updateLang} />
      <Hero lang={lang} />
      <Schedule lang={lang} />
      <RSVP lang={lang} />
      <Registry lang={lang} />
      <Footer lang={lang} />
    </>
  );
}

/* ────────────────────────────── Password gate ────────────────────────────── */

function PasswordGate({
  lang,
  setLang,
  onUnlock,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  onUnlock: () => void;
}) {
  const t = COPY[lang];
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(false);
    try {
      const res = await fetch("/api/bautizo/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: val }),
      });
      if (res.ok) {
        onUnlock();
      } else {
        setErr(true);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setErr(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "linear-gradient(180deg, var(--marfil) 0%, var(--marfil-deep) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ position: "absolute", top: 24, right: 24, display: "flex", gap: 4 }}>
        {(["es", "en"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setLang(k)}
            style={{
              appearance: "none",
              border: 0,
              background: "transparent",
              padding: "6px 10px",
              cursor: "pointer",
              fontFamily: "var(--ff-label)",
              textTransform: "uppercase",
              letterSpacing: ".2em",
              fontSize: 10,
              color: lang === k ? "var(--azul-deep)" : "var(--taupe)",
              borderBottom: lang === k ? "1px solid var(--azul-deep)" : "1px solid transparent",
            }}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>

      <div
        style={{
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
          animation: shake ? "bautizo-shake .4s" : undefined,
        }}
      >
        <div className="ornament" style={{ marginBottom: 24 }}>
          <span className="line"></span>
          <Cross size={32} />
          <span className="line"></span>
        </div>
        <div className="t-cap" style={{ marginBottom: 14 }}>
          {t.welcome}
        </div>
        <h1
          className="t-display"
          style={{ fontSize: "clamp(44px, 7vw, 72px)", margin: "0 0 6px", color: "var(--tinta)" }}
        >
          Martín
        </h1>
        <div className="t-eyebrow" style={{ marginBottom: 28 }}>
          · Bautizo · 2026 ·
        </div>
        <p
          style={{
            color: "var(--taupe-deep)",
            margin: "0 0 28px",
            fontSize: 15,
            fontStyle: "italic",
            fontFamily: "var(--ff-display)",
          }}
        >
          {t.enterPwd}
        </p>
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}
        >
          <input
            autoFocus
            type="password"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              setErr(false);
            }}
            placeholder={t.pwdPlaceholder}
            style={{
              width: 280,
              textAlign: "center",
              padding: "12px 16px",
              border: "1px solid var(--beige)",
              background: "rgba(255,255,255,.5)",
              fontFamily: "var(--ff-display)",
              fontSize: 18,
              color: "var(--tinta)",
              letterSpacing: ".1em",
              borderRadius: 2,
              outline: "none",
            }}
          />
          {err && (
            <div style={{ color: "#a25c5c", fontSize: 12, fontStyle: "italic" }}>{t.wrong}</div>
          )}
          <button type="submit" className="btn" disabled={submitting}>
            {t.enter}
          </button>
        </form>
        <div className="ornament" style={{ marginTop: 40, opacity: 0.5 }}>
          <span className="line"></span>
          <span className="dot"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── Top bar ────────────────────────────── */

function TopBar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(245, 241, 235, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(168,159,148,.18)",
        padding: "14px var(--gutter)",
        paddingTop: "max(14px, env(safe-area-inset-top))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Cross size={20} />
        <div className="t-cap" style={{ fontSize: 10 }}>
          <span className="topbar-full">
            Martín · {lang === "en" ? "Baptism" : "Bautizo"} · 24 · 10 · 2026
          </span>
          <span className="topbar-short" style={{ display: "none" }}>
            Martín · 24.10.26
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {(["es", "en"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setLang(k)}
            style={{
              appearance: "none",
              border: 0,
              background: "transparent",
              padding: "6px 10px",
              cursor: "pointer",
              fontFamily: "var(--ff-label)",
              textTransform: "uppercase",
              letterSpacing: ".2em",
              fontSize: 10,
              color: lang === k ? "var(--azul-deep)" : "var(--taupe)",
              borderBottom: lang === k ? "1px solid var(--azul-deep)" : "1px solid transparent",
            }}
          >
            {k.toUpperCase()}
          </button>
        ))}
        <a
          href="#rsvp"
          className="btn"
          style={{ marginLeft: 12, padding: "10px 18px", fontSize: 10 }}
        >
          RSVP
        </a>
      </div>
    </div>
  );
}

/* ────────────────────────────── Hero ────────────────────────────── */

function Hero({ lang }: { lang: Lang }) {
  const monthLabel = lang === "en" ? "October" : "Octubre";
  const dayLabel = lang === "en" ? "Saturday" : "Sábado";
  const cityLabel = lang === "en" ? "Atizapán, Mexico" : "Atizapán, Edo. de México";

  return (
    <section
      className="section section--cream"
      style={{
        paddingTop: "clamp(72px, 10vw, 120px)",
        paddingBottom: "clamp(64px, 8vw, 96px)",
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ position: "absolute", inset: "auto 0 0 0", opacity: 0.35, pointerEvents: "none" }}>
        <Fairway />
      </div>

      <div className="section-inner" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)",
            gap: "clamp(32px, 6vw, 88px)",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ height: 1, width: 40, background: "var(--azul-deep)" }}></div>
              <div className="t-cap" style={{ color: "var(--azul-deep)" }}>
                {lang === "en" ? "Baptism · 2026" : "Bautizo · 2026"}
              </div>
            </div>

            <h1
              className="t-display"
              style={{
                fontSize: "clamp(72px, 12vw, 184px)",
                margin: 0,
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                color: "var(--tinta)",
              }}
            >
              Mart<span style={{ fontStyle: "italic" }}>ín</span>
            </h1>
            <div
              style={{
                fontFamily: "var(--ff-label)",
                textTransform: "uppercase",
                letterSpacing: ".4em",
                fontSize: 12,
                color: "var(--taupe-deep)",
                marginTop: 16,
              }}
            >
              Mexía Moreno
            </div>

            <div style={{ marginTop: 40 }}>
              <div className="t-cap" style={{ marginBottom: 10 }}>
                {dayLabel} · {monthLabel} · 2026
              </div>
              <div
                className="t-display"
                style={{
                  fontSize: "clamp(56px, 8vw, 112px)",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--tinta)",
                  whiteSpace: "nowrap",
                }}
              >
                24<span style={{ color: "var(--taupe)", fontStyle: "italic" }}>.</span>10
                <span style={{ color: "var(--taupe)", fontStyle: "italic" }}>.</span>26
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: "var(--ff-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(20px, 2.2vw, 26px)",
                  color: "var(--azul-deep)",
                  whiteSpace: "nowrap",
                }}
              >
                1:00 pm
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 28,
                color: "var(--taupe-deep)",
              }}
            >
              <PinFlag size={18} />
              <div style={{ fontFamily: "var(--ff-display)", fontSize: 17, fontStyle: "italic" }}>
                {cityLabel}
              </div>
            </div>

            <div
              style={{
                marginTop: "clamp(36px, 5vw, 56px)",
                paddingTop: 24,
                borderTop: "1px solid rgba(168,159,148,.3)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 28,
              }}
            >
              <div>
                <div
                  className="t-cap"
                  style={{ fontSize: 9.5, marginBottom: 8, color: "var(--azul-deep)" }}
                >
                  {lang === "en" ? "Parents" : "Padres"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "var(--tinta)",
                  }}
                >
                  Perla N. Moreno Cortés
                  <br />
                  Martín A. Mexía Ponce
                </div>
              </div>
              <div>
                <div
                  className="t-cap"
                  style={{ fontSize: 9.5, marginBottom: 8, color: "var(--azul-deep)" }}
                >
                  {lang === "en" ? "Godparents" : "Padrinos"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: "var(--tinta)",
                  }}
                >
                  Patricia K. Moreno Cortés
                  <br />
                  Isabel Aguirre Stillman
                  <br />
                  Jorge A. Mexía Ponce
                  <br />
                  Ángel Papadopulos Sandoval
                </div>
              </div>
            </div>
          </div>

          <div
            className="hero-bear"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bautizo/bear.png"
              alt="Tinchito"
              style={{
                width: "100%",
                maxWidth: 460,
                height: "auto",
                display: "block",
                filter: "drop-shadow(0 18px 40px rgba(140, 130, 120, 0.25))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── Schedule ────────────────────────────── */

function Schedule({ lang }: { lang: Lang }) {
  const t = COPY[lang];

  return (
    <section className="section section--ivory">
      <div className="section-inner">
        <div
          style={{
            marginBottom: 48,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="t-cap" style={{ marginBottom: 12, color: "var(--azul-deep)" }}>
              {t.schedule}
            </div>
            <h2
              className="t-display"
              style={{
                fontSize: "clamp(40px, 5.5vw, 72px)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {lang === "en" ? "The day " : "El día "}
              <span style={{ fontStyle: "italic", color: "var(--azul-deep)" }}>
                {lang === "en" ? "in detail" : "en detalle"}
              </span>
            </h2>
          </div>
          <div
            style={{
              fontFamily: "var(--ff-display)",
              fontStyle: "italic",
              color: "var(--taupe-deep)",
              fontSize: 18,
            }}
          >
            {lang === "en" ? "Saturday · 24 · 10 · 2026" : "Sábado · 24 · 10 · 2026"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 28,
          }}
        >
          <ScheduleCard
            time="1:00 pm"
            type={t.ceremony}
            place={LOCATIONS.parroquia}
            placeLabel={t.parroquia}
            placeSub={t.parroquiaLoc}
            lang={lang}
            icon={<ChurchIcon />}
          />
          <ScheduleCard
            time="2:00 pm"
            type={t.reception}
            place={LOCATIONS.club}
            placeLabel={t.club}
            placeSub={t.clubLoc}
            lang={lang}
            icon={<PinFlag size={26} color="var(--azul-deep)" />}
          />
        </div>
      </div>
    </section>
  );
}

function ScheduleCard({
  time,
  type,
  place,
  placeLabel,
  placeSub,
  lang,
  icon,
}: {
  time: string;
  type: string;
  place: { lat: number; lng: number; query: string };
  placeLabel: string;
  placeSub: string;
  lang: Lang;
  icon: React.ReactNode;
}) {
  const t = COPY[lang];
  return (
    <div className="card card--bordered" style={{ padding: 0, overflow: "hidden" }}>
      <span className="card-corner tl"></span>
      <span className="card-corner tr"></span>
      <span className="card-corner bl"></span>
      <span className="card-corner br"></span>

      <div style={{ padding: "36px 36px 24px", textAlign: "center" }}>
        <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>{icon}</div>
        <div className="t-cap">{type}</div>
        <div
          className="t-display"
          style={{
            fontSize: 56,
            lineHeight: 1,
            color: "var(--azul-deep)",
            margin: "10px 0",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {time}
        </div>
        <div className="t-display" style={{ fontSize: 22, color: "var(--tinta)", marginBottom: 4 }}>
          {placeLabel}
        </div>
        <div
          style={{
            color: "var(--taupe-deep)",
            fontSize: 14,
            fontStyle: "italic",
            fontFamily: "var(--ff-display)",
          }}
        >
          {placeSub}
        </div>
      </div>

      <div style={{ position: "relative", borderTop: "1px solid var(--beige)" }}>
        <iframe
          src={embedSrc(place)}
          style={{
            width: "100%",
            height: 240,
            border: 0,
            display: "block",
            filter: "saturate(.6) contrast(.95)",
          }}
          loading="lazy"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          background: "var(--beige)",
          borderTop: "1px solid var(--beige)",
        }}
      >
        <a
          href={wazeLink(place)}
          target="_blank"
          rel="noopener"
          className="btn btn--ghost"
          style={{
            borderRadius: 0,
            border: 0,
            background: "var(--marfil)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <WazeIcon /> {t.openWaze}
        </a>
        <a
          href={mapsLink(place)}
          target="_blank"
          rel="noopener"
          className="btn btn--ghost"
          style={{
            borderRadius: 0,
            border: 0,
            background: "var(--marfil)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <MapsIcon /> {t.openMaps}
        </a>
      </div>
    </div>
  );
}

/* ────────────────────────────── RSVP ────────────────────────────── */

type RsvpForm = {
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  adults: number;
  kids: number;
  dietary: string;
  message: string;
};

function RSVP({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<RsvpForm>({
    name: "",
    email: "",
    phone: "",
    attending: "yes",
    adults: 1,
    kids: 0,
    dietary: "",
    message: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bautizo/rsvp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, language: lang }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "submit_failed");
      }
      setSubmitted(true);
      window.scrollTo({
        top: document.getElementById("rsvp")!.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "submit_failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="section section--cream" style={{ position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          color: "var(--azul-deep)",
        }}
      >
        <span style={{ width: 1, height: 36, background: "currentColor", opacity: 0.5 }}></span>
        <span
          style={{
            width: 8,
            height: 8,
            transform: "rotate(45deg)",
            border: "1px solid currentColor",
            background: "var(--marfil)",
          }}
        ></span>
      </div>
      <div className="section-inner" style={{ maxWidth: 720, textAlign: "center", paddingTop: 24 }}>
        <div className="t-cap" style={{ marginBottom: 14 }}>
          {t.rsvp}
        </div>
        <h2
          className="t-display"
          style={{ fontSize: "clamp(40px, 5.5vw, 64px)", margin: "0 0 8px" }}
        >
          {lang === "en" ? "Will you join us?" : "¿Nos acompañas?"}
        </h2>
        <p
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            color: "var(--taupe-deep)",
            marginTop: 14,
          }}
        >
          {t.rsvpSub}
        </p>

        <div className="ornament" style={{ marginTop: 20, marginBottom: 36 }}>
          <span className="line"></span>
          <span className="dot"></span>
          <span className="line"></span>
        </div>

        {submitted ? (
          <div className="card card--bordered" style={{ textAlign: "center", padding: 56 }}>
            <span className="card-corner tl"></span>
            <span className="card-corner tr"></span>
            <span className="card-corner bl"></span>
            <span className="card-corner br"></span>
            <Laurel size={50} />
            <h3
              className="t-display"
              style={{ fontSize: 36, margin: "16px 0 10px", color: "var(--azul-deep)" }}
            >
              {t.submittedTitle}
            </h3>
            <p
              style={{
                fontFamily: "var(--ff-display)",
                fontStyle: "italic",
                color: "var(--taupe-deep)",
                margin: 0,
              }}
            >
              {t.submittedSub}
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="card card--bordered"
            style={{ padding: 36, textAlign: "left" }}
          >
            <span className="card-corner tl"></span>
            <span className="card-corner tr"></span>
            <span className="card-corner bl"></span>
            <span className="card-corner br"></span>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 24,
              }}
            >
              <div className="field">
                <label>{t.name}</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>{t.email}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label>{t.phone}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="field">
                <label>{t.attending}</label>
                <div style={{ display: "flex", gap: 16, paddingTop: 6 }}>
                  {(
                    [
                      { v: "yes" as const, l: lang === "en" ? "Yes" : "Sí" },
                      { v: "no" as const, l: "No" },
                    ]
                  ).map((o) => (
                    <label
                      key={o.v}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        fontFamily: "var(--ff-body)",
                        fontSize: 15,
                        textTransform: "none",
                        letterSpacing: 0,
                        color: "var(--tinta)",
                      }}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={o.v}
                        checked={form.attending === o.v}
                        onChange={() => setForm({ ...form, attending: o.v })}
                        style={{ accentColor: "var(--azul-deep)" }}
                      />
                      {o.l}
                    </label>
                  ))}
                </div>
              </div>

              {form.attending === "yes" && (
                <>
                  <div className="field">
                    <label>{t.guests}</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={form.adults}
                      onChange={(e) =>
                        setForm({ ...form, adults: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="field">
                    <label>{t.kids}</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={form.kids}
                      onChange={(e) => setForm({ ...form, kids: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label>{t.dietary}</label>
                    <input
                      value={form.dietary}
                      onChange={(e) => setForm({ ...form, dietary: e.target.value })}
                      placeholder={lang === "en" ? "Optional" : "Opcional"}
                    />
                  </div>
                </>
              )}

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>{t.message}</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  marginTop: 18,
                  textAlign: "center",
                  color: "#a25c5c",
                  fontFamily: "var(--ff-display)",
                  fontStyle: "italic",
                  fontSize: 14,
                }}
              >
                {lang === "en"
                  ? "We couldn't save your RSVP. Please try again."
                  : "No pudimos guardar tu RSVP. Inténtalo de nuevo."}
              </div>
            )}

            <div style={{ marginTop: 28, textAlign: "center" }}>
              <button type="submit" className="btn btn--blue" disabled={submitting}>
                {submitting ? "…" : t.submit} <span style={{ opacity: 0.7 }}>→</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

/* ────────────────────────────── Registry ────────────────────────────── */

function Registry({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="section section--sand" style={{ position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          color: "var(--azul-deep)",
        }}
      >
        <span style={{ width: 1, height: 36, background: "currentColor", opacity: 0.5 }}></span>
        <span
          style={{
            width: 8,
            height: 8,
            transform: "rotate(45deg)",
            border: "1px solid currentColor",
            background: "var(--marfil-deep)",
          }}
        ></span>
      </div>
      <div className="section-inner" style={{ textAlign: "center", maxWidth: 920, paddingTop: 24 }}>
        <h2
          className="t-display"
          style={{
            fontSize: "clamp(56px, 8vw, 104px)",
            margin: "0 0 16px",
            letterSpacing: "-0.01em",
            lineHeight: 1.02,
            color: "var(--tinta)",
          }}
        >
          {lang === "en" ? "Gift " : "Mesa de "}
          <span style={{ fontStyle: "italic" }}>
            {lang === "en" ? "Registry" : "Regalos"}
          </span>
        </h2>
        <p
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            color: "var(--taupe-deep)",
            maxWidth: 540,
            margin: "0 auto",
            fontSize: 18,
          }}
        >
          {t.registrySub}
        </p>
        <div className="ornament" style={{ marginTop: 28, marginBottom: 48 }}>
          <span className="line"></span>
          <span className="dot"></span>
          <span className="line"></span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 22,
          }}
        >
          {REGISTRIES.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener"
              className="card card--bordered"
              style={{
                textDecoration: "none",
                color: "var(--tinta)",
                padding: "36px 28px",
                textAlign: "center",
                transition: "all .25s ease",
                display: "block",
              }}
            >
              <span className="card-corner tl"></span>
              <span className="card-corner tr"></span>
              <span className="card-corner bl"></span>
              <span className="card-corner br"></span>

              <div className="t-cap" style={{ marginBottom: 10 }}>
                {lang === "en" ? "Store" : "Tienda"}
              </div>
              <div className="t-display" style={{ fontSize: 26, color: "var(--tinta)" }}>
                {r.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--ff-body)",
                  color: "var(--taupe-deep)",
                  fontSize: 13,
                  marginTop: 8,
                  letterSpacing: ".05em",
                }}
              >
                {lang === "en" ? "Code" : "Código"}:{" "}
                <strong style={{ color: "var(--tinta)" }}>{r.code}</strong>
              </div>
              <div className="t-cap" style={{ marginTop: 22, color: "var(--azul-deep)" }}>
                {t.visit} →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── Footer ────────────────────────────── */

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer
      className="section section--cream"
      style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center" }}
    >
      <div className="ornament" style={{ marginBottom: 24 }}>
        <span className="line"></span>
        <Cross size={36} />
        <span className="line"></span>
      </div>
      <div
        className="t-display"
        style={{
          fontSize: 32,
          fontStyle: "italic",
          color: "var(--azul-deep)",
          marginBottom: 6,
        }}
      >
        {lang === "en" ? "We can't wait" : "Te esperamos"}
      </div>
      <div className="t-cap">Martín · 24 · 10 · 2026</div>
      <div
        style={{
          marginTop: 32,
          fontSize: 11,
          fontFamily: "var(--ff-label)",
          letterSpacing: ".3em",
          textTransform: "uppercase",
          color: "var(--taupe)",
        }}
      >
        Familia Mexía Moreno
      </div>
    </footer>
  );
}
