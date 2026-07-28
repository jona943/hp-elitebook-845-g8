# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" width="35" height="35" valign="middle" /> HP EliteBook 845 G8 — Linux Environment & Optimization

[![OS - Ubuntu 26.04 LTS](https://img.shields.io/badge/OS-Ubuntu%2026.04%20LTS-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)](https://ubuntu.com/)
[![Desktop - GNOME](https://img.shields.io/badge/Desktop-GNOME-4A154B?style=for-the-badge&logo=gnome&logoColor=white)](https://www.gnome.org/)
[![Hardware - HP EliteBook](https://img.shields.io/badge/Hardware-HP%20EliteBook-0096D6?style=for-the-badge&logo=hp&logoColor=white)](https://www.hp.com/)
[![Shell - Bash](https://img.shields.io/badge/Shell-Bash-4EAA25?style=for-the-badge&logo=gnubash&logoColor=white)](https://www.gnu.org/software/bash/)

Bienvenido al repositorio central de **configuración, optimización y diagnóstico técnico** para la laptop **HP EliteBook 845 G8** bajo el sistema operativo **Ubuntu 26.04 LTS (Resolute Raccoon)**.

---

## <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-original.svg" width="22" height="22" valign="middle" /> Propósito del Repositorio

Este espacio sirve como **bitácora técnica y base de conocimiento personal** destinada a:

* **Maximizar el rendimiento y la autonomía** mediante ajustes del kernel, desactivación de servicios innecesarios y perfiles de energía (`TLP` y `auto-cpufreq`).
* **Documentar diagnósticos de hardware** para controladores gráficos, adaptadores de red y periféricos.
* **Estandarizar procedimientos técnicos** como particionado GPT, sistemas de archivos Ext4, montaje automático `/etc/fstab` e integración de Passkeys.
* **Consolidar auditorías del sistema** mediante el análisis periódico de logs del kernel (`dmesg` / `journalctl`).

---

## <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" width="22" height="22" valign="middle" /> Especificaciones del Equipo

| Componente | Detalle Técnico | Insignia |
| :--- | :--- | :--- |
| **Modelo** | HP EliteBook 845 G8 Notebook PC | ![](https://img.shields.io/badge/HP-EliteBook-0096D6?style=flat-square&logo=hp&logoColor=white) |
| **Sistema Operativo** | Ubuntu 26.04 LTS (Resolute Raccoon) | ![](https://img.shields.io/badge/Ubuntu-26.04_LTS-E95420?style=flat-square&logo=ubuntu&logoColor=white) |
| **Entorno de Escritorio** | GNOME | ![](https://img.shields.io/badge/GNOME-Desktop-4A154B?style=flat-square&logo=gnome&logoColor=white) |
| **Kernel** | `Linux 7.0.0-15-generic` | ![](https://img.shields.io/badge/Kernel-7.0.0-FCC624?style=flat-square&logo=linux&logoColor=black) |
| **Gráficos** | AMD Radeon Graphics (`amdgpu`) | ![](https://img.shields.io/badge/GPU-AMD_Radeon-ED1C24?style=flat-square&logo=amd&logoColor=white) |
| **Red / WiFi** | Qualcomm QCNFA765 (`ath11k_pci`) | ![](https://img.shields.io/badge/WiFi-Qualcomm-0052CC?style=flat-square&logo=qualcomm&logoColor=white) |
| **Almacenamiento** | SSD STYL OS TECH 480GB (`Ext4` / `GPT`) | ![](https://img.shields.io/badge/Storage-SSD_480GB-000000?style=flat-square&logo=drive&logoColor=white) |

---

## <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg" width="22" height="22" valign="middle" /> Documentos y Guías del Proyecto

| Categoría | Documento | Resumen Técnico |
| :---: | :--- | :--- |
| ![](https://img.shields.io/badge/-Rendimiento-232F3E?style=flat-square&logo=speedtest&logoColor=white) | [**OPTIMIZACIONES.md**](./OPTIMIZACIONES.md) | **Bitácora de optimización:** Swappiness a 10, compresión `zram`, gestión de batería (`TLP`/`auto-cpufreq`), deshabilitación de servicios innecesarios y parches Qt6 para Zoom. |
| ![](https://img.shields.io/badge/-Red_WiFi-0052CC?style=flat-square&logo=wi-fi&logoColor=white) | [**DIAGNOSTICO_WIFI.md**](./DIAGNOSTICO_WIFI.md) | **Diagnóstico WiFi:** Resolución de caídas en interfaz Qualcomm `ath11k_pci` tras suspensión S0ix/S3, configuraciones en `tlp.conf` y hooks de reconexión. |
| ![](https://img.shields.io/badge/-Almacenamiento-000000?style=flat-square&logo=disk&logoColor=white) | [**FORMATO_SSD.md**](./FORMATO_SSD.md) | **Guía de particionado y montaje:** Esquema GPT con `parted`, formato `Ext4`, gestión de propiedad de carpetas y montaje en `/etc/fstab` con `nofail`. |
| ![](https://img.shields.io/badge/-Pantalla-4A154B?style=flat-square&logo=displayport&logoColor=white) | [**INFO_BRILLO.md**](./INFO_BRILLO.md) | **Investigación de retroiluminación:** AMD backlight (`amdgpu_bl1`), control de teclado por firmware y configuración de micro-niveles de brillo con `brightnessctl`. |
| ![](https://img.shields.io/badge/-Seguridad-00599C?style=flat-square&logo=bitwarden&logoColor=white) | [**PASSKEYS_LINUX.md**](./PASSKEYS_LINUX.md) | **Gestión de Passkeys y Huella:** Estado de WebAuthn/FIDO2 en Linux, limitaciones con Chrome y solución puente usando `fprintd` y Bitwarden. |
| ![](https://img.shields.io/badge/-Logs-FCC624?style=flat-square&logo=linux&logoColor=black) | [**reporte_kernel_2026-07-23.md**](./reportes/reporte_kernel_2026-07-23.md) | **Auditoría del Kernel:** Inspección de errores con `dmesg` y `journalctl`, evaluación de tablas ACPI en BIOS y virtualización KVM. |

---

## <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" width="22" height="22" valign="middle" /> Componentes Integrados

* **Gestión de Energía:** `TLP` + `auto-cpufreq`
* **Compresión de Memoria:** `zram-config` (RAM Swap comprimida)
* **Control de Brillo CLI:** `brightnessctl`
* **Autenticación Biométrica:** `fprintd` + `PAM` + `Bitwarden`

---

<p align="center">
  <sub>Documentación técnica para el ecosistema HP EliteBook en Linux 🐧</sub>
</p>
