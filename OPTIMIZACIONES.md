# Optimización del Sistema HP EliteBook
**Fecha de Inicio:** 2026-04-29
**Sistema Operativo:** Ubuntu 26.04 LTS (Resolute Raccoon)
**Entorno de Escritorio:** GNOME

## Bitácora de Modificaciones

| Fecha | Componente | Modificación | Resultado Esperado |
|-------|------------|--------------|-------------------|
| 2026-04-29 | Documentación | Creación del archivo de seguimiento | Organización del proyecto |
| 2026-04-29 | Investigación | Análisis de servicios y parámetros vm | Identificación de candidatos iniciales |
| 2026-04-29 | Servicios | Desactivación de apport, whoopsie, ModemManager, CUPS, SSSD y Cloud-init | Reducción de carga al inicio y memoria libre |
| 2026-04-29 | Memoria | Ajuste de swappiness de 60 a 10 | Mejor respuesta del sistema (menos uso de disco para swap) |
| 2026-04-29 | Arranque | Desactivación de NetworkManager-wait-online y kdump-tools | Reducción de ~20s en el tiempo de arranque |
| 2026-04-29 | Snap | Ajuste de retención de versiones (refresh.retain=2) | Ahorro de espacio en disco |
| 2026-04-29 | Usuario | Desactivación de alarmas de Evolution en autostart | Menor consumo de RAM al iniciar sesión |
| 2026-04-29 | Sistema | Desactivación de timers apt-daily | Evita picos de IO y CPU al encender la máquina |
| 2026-04-29 | Disco | Activación de 'noatime' en fstab | Reduce escrituras en SSD y mejora velocidad de lectura |
| 2026-04-29 | Memoria | Instalación y configuración de zram-config | Compresión de swap en RAM (más velocidad que disco) |
| 2026-04-29 | Limpieza | Ejecución de autoremove y clean | Liberación de ~300MB y eliminación de kernels antiguos |
| 2026-04-30 | Aplicaciones | Resolución de dependencias de Zoom (Qt6/OpenGL) | Zoom funcional en Ubuntu 26.04 |
| 2026-05-08 | Limpieza | Desinstalación de Zoom y Steam | Liberación de ~1GB de espacio en disco |
| 2026-05-08 | Energía | Instalación de TLP y eliminación de power-profiles-daemon | Gestión avanzada de energía y ahorro de batería |
| 2026-05-08 | Energía | Instalación de auto-cpufreq vía Snap | Optimización dinámica de frecuencias de CPU |
| 2026-05-08 | Batería | Configuración de umbrales (75%/80%) | Carga inteligente para prolongar vida útil |
| 2026-05-08 | Inicio | Desactivación de avahi, geoclue y alarmas de Evolution | Reducción de despertares (wakeups) del procesador |

## Aplicaciones Específicas

### Zoom Workplace
En Ubuntu 26.04 (Resolute Raccoon), el paquete oficial de Zoom (`7.0.0.1666`) no instala automáticamente todas las librerías de Qt6 y OpenGL necesarias.

**Error reportado:**
`error while loading shared libraries: libOpenGL.so.0: cannot open shared object file: No such file or directory`

**Solución aplicada:**
Instalación manual de las librerías faltantes detectadas mediante `ldd`:
```bash
sudo apt update && sudo apt install -y \
    libopengl0 libqt6core5compat6 libqt6core6t64 libqt6dbus6 \
    libqt6gui6 libqt6network6 libqt6opengl6 libqt6qml6 \
    libqt6qmlmeta6 libqt6qmlmodels6 libqt6qmlworkerscript6 \
    libqt6quick6 libqt6quickwidgets6 libqt6svg6 libqt6widgets6 libqt6xml6
```

---

## Estado Inicial del Sistema
- **Kernel:** 7.0.0-15-generic
- **Swappiness:** 60
- **Principales procesos por consumo:**
    - `gnome-shell`: ~3.8% CPU, 2.1% RAM
    - `snapd`: ~1.1% CPU
    - `evolution-data-server`: Activo
    - `fwupd`: Activo
    - `packagekitd`: Activo

## Servicios Candidatos a Desactivar/Optimizar
1. **Reporte de Errores:** `apport.service`, `whoopsie.service`.
2. **Servicios de Nube:** `cloud-init`, `cloud-config`, `cloud-final`, `cloud-init-local`.
3. **Red/Hardware:** `avahi-daemon` (Descubrimiento red), `ModemManager` (Módem celular), `cups` (Impresión), `bluetooth` (Si no se usa).
4. **Corporativo:** `sssd`.

## Estrategia de Optimización
1. Identificar servicios no esenciales basándose en el uso del usuario.
2. Optimizar la gestión de memoria (Swappiness a 10).
3. Revisar aplicaciones al inicio.
4. Mantener la integridad de GNOME Shell para no afectar animaciones.

## Aplicaciones Innecesarias Identificadas (Bloatware)
Se ha identificado el siguiente software que puede ser eliminado si no se utiliza, para liberar recursos:

### 1. Herramientas de Accesibilidad
Si no se utilizan lectores de pantalla o pantallas Braille, estos paquetes consumen recursos en segundo plano:
- `brltty`: Soporte para dispositivos Braille.
- `orca`: Lector de pantalla para personas con discapacidad visual.

### 2. Servicios de Compartición y Multimedia
- `rygel`: Servidor multimedia UPnP/DLNA (suele venir activado por defecto pero rara vez se usa manualmente).
- `modemmanager`: Si no se usa un módem 3G/4G/LTE, este servicio es innecesario.

### 3. Aplicaciones de "Relleno" y Juegos
- Juegos preinstalados: `aisleriot`, `gnome-mahjongg`, `gnome-mines`, `gnome-sudoku`.
- `remmina`: Cliente de escritorio remoto (útil solo si se realizan conexiones por RDP/VNC).

**Comando sugerido para limpieza profunda:**
```bash
sudo apt purge -y brltty orca rygel modemmanager aisleriot remmina
sudo apt autoremove -y
```
