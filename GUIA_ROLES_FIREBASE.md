# DamAcademy — Roles desde Firebase (sin scripts ni Cloud Functions)

## 1. Publicar las reglas de seguridad (OBLIGATORIO)
1. Entra en Firebase Console > proyecto `damacademyv` > Firestore Database > Reglas.
2. Copia el contenido completo del archivo `firestore.rules` de este ZIP.
3. Pulsa **Publicar**. No basta con subir `firestore.rules` a GitHub.

## 2. Activar tu cuenta como superadmin
1. Firebase Console > Firestore Database > Datos > colección `users`.
2. Abre el documento cuyo ID sea el UID de tu cuenta autenticada.
3. Crea o edita el campo `role` como tipo **string**, valor **`superadmin`**.
4. Guarda. Este cambio debe hacerlo el propietario del proyecto desde Firebase Console, no desde la web.

## 3. Administrar otros usuarios
En Firebase Console > Firestore > `users` > UID, modifica `role` a `student`, `admin` o `superadmin`.
La interfaz escucha el documento de rol en tiempo real. `admin` puede consultar alumnos y progresos; `superadmin` también puede asignar `student` o `admin` desde el panel de la web. Para asignar `superadmin` a otra cuenta, utiliza la consola Firebase.

## 4. Publicar en Vercel
1. Sustituye los archivos de tu repositorio por los de la carpeta `apuntes-dam-web` de este ZIP y sube los cambios a GitHub.
2. Comprueba en Vercel > Settings > Environment Variables las seis variables `NEXT_PUBLIC_FIREBASE_*` que ya usas. Los valores de referencia están en `.env.example`.
3. Vercel desplegará el commit. Si fuera necesario, ve a Deployments > Redeploy.
4. Inicia sesión en DamAcademy, pulsa tu perfil y entra en la pestaña **Alumnos**.

## 5. Seguridad y límites
- Nunca pongas un JSON de cuenta de servicio ni claves privadas en el repositorio.
- El ZIP excluye `.git`, `node_modules` y los archivos secretos locales.
- Las reglas impiden que un estudiante cambie su propio `role`.
- El panel solo es una interfaz; las autorizaciones reales dependen de publicar las reglas de Firestore.
- Este cambio elimina la antigua API de roles basada en custom claims y su dependencia de Firebase Admin SDK para ese propósito.
- Las reglas mantienen las colecciones `directory`, `chats`, `tickets` y `progress` de tu proyecto original.
