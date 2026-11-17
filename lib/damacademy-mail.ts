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
    ? "Gracias por registrarte. Para activar tu cuenta y comenzar a aprender Java, necesitamos confirmar tu dirección de correo electrónico."
    : "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de DamAcademy."
  const greeting = verify ? "¡Bienvenido a DamAcademy!" : "¡Hola!"
  const notice = verify
    ? "Si no has creado una cuenta en DamAcademy, puedes ignorar este mensaje."
    : "Si no has solicitado este cambio, puedes ignorar este correo. Tu contraseña seguirá siendo la misma."
  const html = `<div style="background-color:#0b0d19;padding:30px 15px;font-family:Arial,sans-serif"><div style="max-width:520px;margin:0 auto;background-color:#171b2d;border:1px solid #343954;border-radius:14px;padding:30px"><h1 style="color:#a99bff;font-size:28px;margin-top:0">DamAcademy</h1><h2 style="color:#ffffff;font-size:22px">${title}</h2><p style="color:#c4c9db;font-size:15px;line-height:1.7">${greeting}</p><p style="color:#c4c9db;font-size:15px;line-height:1.7">${description}</p><p style="text-align:center;margin:30px 0"><a href="${htmlEscape(link)}" style="background-color:#7964f5;color:#ffffff;padding:14px 25px;border-radius:9px;text-decoration:none;font-weight:bold;display:inline-block">${button}</a></p><p style="color:#c4c9db;font-size:14px;line-height:1.7">${notice}</p><hr style="border:0;border-top:1px solid #343954;margin:25px 0"><p style="color:#8e95b1;font-size:12px;text-align:center">DamAcademy · Aprende Java a tu ritmo</p></div></div>`
  const plainText = `${title}\n\n${greeting}\n\n${description}\n\n${button}: ${link}\n\n${notice}\n\nDamAcademy · Aprende Java a tu ritmo`
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject: verify ? "Verifica tu cuenta de DamAcademy" : "Restablece tu contraseña de DamAcademy", html, text: plainText }),
    cache: "no-store",
  })
  if (!response.ok) { console.error("Resend error", response.status); throw new Error("No se pudo enviar el correo") }
}
