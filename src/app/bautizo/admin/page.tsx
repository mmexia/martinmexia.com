import { db, ensureSchema, type RsvpRow } from "@/lib/bautizo-db";
import { isAdminAuthed } from "@/lib/bautizo-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BautizoAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const authed = await isAdminAuthed();

  if (!authed) {
    return <Login error={sp.error === "1"} />;
  }

  await ensureSchema();
  const result = await db().execute(
    "SELECT id, name, email, phone, attending, adults, kids, dietary, message, language, submitted_at FROM rsvps ORDER BY submitted_at DESC"
  );
  const rows = result.rows as unknown as RsvpRow[];

  const totalGuests = rows
    .filter((r) => r.attending === "yes")
    .reduce((acc, r) => acc + (r.adults || 0) + (r.kids || 0), 0);
  const yesCount = rows.filter((r) => r.attending === "yes").length;
  const noCount = rows.filter((r) => r.attending === "no").length;

  return (
    <div style={{ padding: "32px var(--gutter)", maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="t-cap">Admin · RSVP database</div>
          <h1
            className="t-display"
            style={{ fontSize: 40, margin: "8px 0 0", letterSpacing: "-0.01em" }}
          >
            {rows.length} <span style={{ color: "var(--taupe)" }}>respuestas</span>
            <span style={{ marginLeft: 18, color: "var(--azul-deep)", fontSize: 28 }}>
              · {totalGuests} confirmados
            </span>
          </h1>
          <div style={{ marginTop: 6, color: "var(--taupe-deep)", fontSize: 13 }}>
            Sí: {yesCount} · No: {noCount}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a className="btn btn--ghost" href="/api/bautizo/rsvp.csv">
            Exportar CSV
          </a>
          <a className="btn btn--ghost" href="/bautizo">
            Volver
          </a>
        </div>
      </div>

      <div className="card card--bordered" style={{ padding: 0, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--marfil-deep)" }}>
              {[
                "Nombre",
                "Email",
                "Teléfono",
                "Asiste",
                "Adultos",
                "Niños",
                "Dietas",
                "Mensaje",
                "Idioma",
                "Fecha",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 14px",
                    textAlign: "left",
                    fontFamily: "var(--ff-label)",
                    textTransform: "uppercase",
                    letterSpacing: ".15em",
                    fontSize: 10,
                    color: "var(--taupe-deep)",
                    borderBottom: "1px solid var(--beige)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    padding: 32,
                    textAlign: "center",
                    color: "var(--taupe)",
                    fontStyle: "italic",
                  }}
                >
                  Sin respuestas todavía.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--marfil-deep)" }}>
                <td style={{ padding: "10px 14px" }}>{r.name}</td>
                <td style={{ padding: "10px 14px" }}>{r.email}</td>
                <td style={{ padding: "10px 14px" }}>{r.phone || ""}</td>
                <td
                  style={{
                    padding: "10px 14px",
                    color: r.attending === "yes" ? "var(--azul-deep)" : "#a25c5c",
                  }}
                >
                  {r.attending === "yes" ? "Sí" : "No"}
                </td>
                <td style={{ padding: "10px 14px" }}>{r.adults}</td>
                <td style={{ padding: "10px 14px" }}>{r.kids}</td>
                <td style={{ padding: "10px 14px" }}>{r.dietary || ""}</td>
                <td
                  style={{
                    padding: "10px 14px",
                    maxWidth: 240,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={r.message || ""}
                >
                  {r.message || ""}
                </td>
                <td style={{ padding: "10px 14px", color: "var(--taupe)" }}>{r.language || ""}</td>
                <td style={{ padding: "10px 14px", color: "var(--taupe)" }}>
                  {new Date(r.submitted_at + "Z").toLocaleString("es-MX", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Login({ error }: { error: boolean }) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <form
        method="post"
        action="/api/bautizo/admin-login"
        className="card card--bordered"
        style={{ width: "100%", maxWidth: 380, padding: 36, textAlign: "center" }}
      >
        <span className="card-corner tl" />
        <span className="card-corner tr" />
        <span className="card-corner bl" />
        <span className="card-corner br" />
        <div className="t-cap" style={{ marginBottom: 12 }}>
          Admin
        </div>
        <h1
          className="t-display"
          style={{
            fontSize: 36,
            margin: "0 0 18px",
            color: "var(--tinta)",
          }}
        >
          RSVPs
        </h1>
        <div className="field" style={{ marginBottom: 18, textAlign: "left" }}>
          <label htmlFor="bautizo-admin-pwd">Contraseña</label>
          <input
            id="bautizo-admin-pwd"
            name="password"
            type="password"
            autoFocus
            required
          />
        </div>
        {error && (
          <div
            style={{
              color: "#a25c5c",
              fontSize: 12,
              fontStyle: "italic",
              marginBottom: 12,
            }}
          >
            Contraseña incorrecta.
          </div>
        )}
        <button type="submit" className="btn btn--blue" style={{ width: "100%" }}>
          Entrar
        </button>
      </form>
    </div>
  );
}
