# DamAcademy — integración Firebase

## Instalación

1. Copia `.env.example` a `.env.local` (o configura esas seis variables `NEXT_PUBLIC_...` en Vercel → Settings → Environment Variables).
2. Ejecuta `npm install` y `npm run dev`.
3. En Firebase Console → Firestore Database → Reglas, publica **el archivo `firestore.rules` incluido**, que coincide con los campos utilizados por esta versión.
4. Comprueba que Firebase Authentication → Sign-in method → Email/Password está activado y que tu dominio está autorizado.
5. Haz una prueba con un alumno: regístrate, completa una lección, recarga e inicia sesión desde otro navegador.

## Seguridad y cuentas

- El registro crea un documento `users/{uid}` con rol `student`.
- El progreso se almacena en `progress/{uid}`. No se comparte entre usuarios.
- La web permite consultar lecciones sin iniciar sesión, pero **para guardar progreso es necesario iniciar sesión**.
- Las reglas usan custom claims `admin` y `superadmin`. **No se asignan desde el navegador**. Para conceder el primer superadministrador, utiliza Firebase Admin SDK desde un entorno de confianza y el UID real de la cuenta creada. Nunca subas una clave privada a GitHub ni a Vercel con prefijo `NEXT_PUBLIC_`.
- Esta entrega no incluye todavía un panel de administración. Se implementará después de habilitar el primer superadministrador.

## Nota sobre dependencias

El proyecto usa npm. El entorno de preparación no pudo conectarse al registro de paquetes para ejecutar `npm install` ni verificar `npm run build`. Comprueba el build en Vercel antes de desplegar en producción. Si Vercel conserva la configuración de instalación `pnpm`, cámbiala a `npm install` en Project Settings → Build and Deployment.
