// Ejecutar SOLO desde un equipo seguro, con GOOGLE_APPLICATION_CREDENTIALS apuntando a un JSON privado.
const admin = require("firebase-admin")
const readline = require("node:readline/promises")
const { stdin, stdout } = require("node:process")
const UID = "opkHLkyREVMrIREf1H2INJ3txBO2"
async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) throw new Error("Configura GOOGLE_APPLICATION_CREDENTIALS con la ruta del JSON privado")
  admin.initializeApp({ credential: admin.credential.applicationDefault() })
  const user = await admin.auth().getUser(UID)
  console.log("Cuenta encontrada:", user.email, "UID:", UID)
  const rl = readline.createInterface({ input: stdin, output: stdout })
  const answer = await rl.question("¿Confirmas que esta es TU cuenta? Escribe CONFIRMAR: ")
  rl.close()
  if (answer !== "CONFIRMAR") return console.log("Cancelado")
  await admin.auth().setCustomUserClaims(UID, { ...user.customClaims, superadmin: true, admin: true })
  await admin.firestore().collection("users").doc(UID).update({ role: "superadmin" })
  console.log("Superadmin activado. Cierra sesión y vuelve a entrar.")
}
main().catch(e => { console.error(e); process.exitCode = 1 })
