# Soporte y Configuración de Passkeys (Llaves de Acceso) en Linux

Este documento recopila la información sobre las limitaciones de las llaves de acceso (*passkeys*) en sistemas Linux y cómo configurar alternativas funcionales, incluyendo el uso del lector de huellas de la laptop.

---

## 1. El Problema: "No se puede crear una llave de acceso en este dispositivo"
Al intentar crear una llave de acceso en Google Chrome en Linux (por ejemplo, para proteger tu cuenta de Google), el navegador muestra un error de incompatibilidad.

### ¿Por qué ocurre?
* **Falta de soporte a nivel de S.O.:** A diferencia de Windows (Windows Hello) o macOS (iCloud Keychain), Linux carece de un sistema nativo unificado que gestione llaves criptográficas de plataforma integradas directamente con Chrome.
* **Restricción de Google Account:** Por seguridad, Google no almacena las llaves de acceso de tu propia cuenta de Google dentro de su propio administrador en la nube. Exige que se guarden localmente en el hardware del dispositivo.

---

## 2. El Lector de Huellas en Linux
Aunque tu laptop cuente con un sensor de huellas físico funcional en Linux (configurado con `fprintd` y `PAM`), **no puedes usarlo directamente en Chrome** debido a que:
* Las herramientas de huellas en Linux solo validan la identidad localmente (comparación básica).
* No están conectadas a las APIs de WebAuthn/FIDO2 que emplean los navegadores para firmar solicitudes criptográficas de la web.

---

## 3. Alternativas y Soluciones

### Opción A: Desbloqueo Biométrico con Bitwarden (Recomendado)
Es la mejor manera de aprovechar el lector de huellas de la laptop para rellenar llaves de acceso en el navegador.

1. **Instalar Bitwarden de escritorio:** Instala la aplicación de escritorio oficial de Bitwarden en tu Linux.
2. **Activar Biometría:** Dentro de la app de Bitwarden, ve a Ajustes y activa **"Desbloquear con datos biométricos"** (esto se vinculará con tu sensor de huellas).
3. **Instalar Extensión de Chrome:** Instala la extensión oficial de Bitwarden en Chrome y activa la opción **"Permitir la integración con la aplicación de escritorio"** en su configuración.
4. **Uso:** Al iniciar sesión en sitios que requieran *passkeys*, Bitwarden interceptará la solicitud y te permitirá autorizarla colocando tu huella en el lector de la laptop.

### Opción B: Dispositivo Externo (Cross-Device)
1. Al intentar iniciar sesión, selecciona la opción **"Usar otro dispositivo"** en la ventana de Chrome.
2. Selecciona **"Teléfono o tablet"** y escanea el código QR que se muestra con tu móvil.
3. El inicio de sesión se completará de forma segura vía Bluetooth entre tu PC Linux y el teléfono.

### Opción C: Almacenamiento Local (KeePassXC)
Si prefieres una solución 100% offline y de código abrir:
1. Instala **KeePassXC** en Linux y su correspondiente extensión para el navegador (**KeePassXC-Browser**).
2. Guarda tus passkeys de forma local dentro de la base de datos cifrada de KeePassXC.
