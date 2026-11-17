import "server-only"

type MailKind = "verify" | "reset"

function htmlEscape(input: string) {
  return input.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] || ch)
}

export async function sendDamAcademyMail(to: string, link: string, kind: MailKind) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const testEmail = process.env.RESEND_TEST_RECIPIENT?.trim().toLowerCase()
  if (!key || !from || !testEmail) throw new Error("Configuración de Resend incompleta")
  // onboarding@resend.dev solo puede enviar al correo de la cuenta Resend.
  if (to.trim().toLowerCase() !== testEmail) throw new Error("Destinatario fuera del modo de pruebas")
  if (!link.startsWith("https://")) throw new Error("Enlace no seguro")
  const verify = kind === "verify"
  const title = verify ? "Verifica tu correo electrónico" : "Restablece tu contraseña"
  const button = verify ? "Verificar mi correo" : "Restablecer contraseña"
  const description = verify
    ? "Confirma tu dirección de correo para activar tu cuenta de DamAcademy."
    : "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de DamAcademy."
  const html = `<div style="background:#0b0d19;padding:30px 15px;font-family:Arial,sans-serif"><div style="max-width:520px;margin:0 auto;background:#171b2d;border:1px solid #343954;border-radius:14px;padding:30px"><h1 style="color:#a99bff;font-size:28px">🎓 DamAcademy</h1><h2 style="color:#fff;font-size:22px">${title}</h2><p style="color:#c4c9db;font-size:15px;line-height:1.7">¡Hola! ${description}</p><p style="text-align:center;margin:30px 0"><a href="${htmlEscape(link)}" style="background:#7964f5;color:#fff;padding:14px 25px;border-radius:9px;text-decoration:none;font-weight:bold;display:inline-block">${button}</a></p><p style="color:#c4c9db;font-size:13px;line-height:1.7">Si no has solicitado este mensaje, puedes ignorarlo.</p><hr style="border:0;border-top:1px solid #343954;margin:25px 0"><p style="color:#8e95b1;font-size:12px;text-align:center">DamAcademy · Aprende Java a tu ritmo</p></div></div>`
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject: `${verify ? "✉️" : "🔐"} ${title} | DamAcademy`, html }),
    cache: "no-store",
  })
  if (!response.ok) { console.error("Resend error", response.status); throw new Error("No se pudo enviar el correo") }
}
