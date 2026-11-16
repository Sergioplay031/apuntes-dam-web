# DamAcademy — Perfil, administración, mensajería y soporte

## Cambios incluidos

- El perfil inferior izquierdo abre un centro de cuenta con edición de nombre, cambio de correo mediante verificación y cambio de contraseña con reautenticación.
- El panel de administración lista alumnos y progreso (solo lectura) **únicamente** si Firebase Authentication tiene custom claim `admin: true` o `superadmin: true`.
- Mensajes privados entre usuarios registrados, guardados en `chats/{id}/messages`, con escucha en tiempo real.
- Tickets de soporte con respuestas de administradores.
- Ventana de login centrada, con fondo oscurecido y desenfoque.
- Conserva las lecciones y ejercicios del proyecto original.

## Pasos imprescindibles

1. **Publica el nuevo `firestore.rules`** en Firebase Console → Firestore Database → Reglas. Sin estas reglas, el chat, soporte y directorio no funcionarán. Las reglas anteriores no sirven para las nuevas colecciones.
2. Conserva en Vercel las seis variables `NEXT_PUBLIC_FIREBASE_...` que ya configuraste. No necesitas nuevas claves.
3. Sube el contenido de la carpeta del proyecto a GitHub (no la carpeta `.git`), espera a que Vercel termine el despliegue y comprueba los flujos con dos cuentas de prueba.
4. Los usuarios existentes aparecerán en el directorio después de volver a iniciar sesión. El directorio expone el nombre visible a otros usuarios autenticados; no publica su correo.
5. Si Firestore pide crear un índice para los tickets, sigue el enlace que aparece en la consola y espera a que termine.

## Cómo activar tu superadministrador de forma segura

No basta con escribir `superadmin` en Firestore. El panel se basa en custom claims de Firebase Authentication, asignados mediante Admin SDK en un entorno seguro. Identifica tu UID en Firebase Console → Authentication → Usuarios. Ejecuta un script de administración fuera de la web con una credencial de servicio segura; nunca subas esa credencial al repositorio ni la compartas. Ejemplo conceptual con Admin SDK:

```js
await admin.auth().setCustomUserClaims('UID_REAL_DEL_USUARIO', { superadmin: true });
```

Después cierra sesión y vuelve a entrar para actualizar el token. El campo `role` del documento del usuario es solo informativo y no concede privilegios.

## Consideraciones

- Las conversaciones privadas solo pueden leerse por sus participantes. El directorio es visible para usuarios autenticados.
- Los administradores pueden leer los perfiles y el progreso, pero no modificar el progreso de alumnos.
- No se incluye una función para borrar cuentas desde el navegador. Esa operación requiere un backend seguro.
- No se ha podido ejecutar un build completo con dependencias en este entorno; revisa el despliegue de Vercel antes de reemplazar la versión de producción.
