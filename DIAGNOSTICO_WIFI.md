# Diagnóstico de Red: Fallo WiFi tras Suspensión (Qualcomm QCNFA765)

## 1. Síntomas
- Al reanudar el sistema tras una suspensión, la interfaz WiFi (`wlp1s0`) pierde conectividad.
- NetworkManager muestra intentos fallidos de reconexión o la interfaz desaparece.
- El hardware afectado es un adaptador **Qualcomm Technologies, Inc QCNFA765** utilizando el driver `ath11k_pci`.

## 2. Hallazgos Técnicos (Kernel y Drivers)
- **Driver:** `ath11k_pci` (módulo `ath11k`).
- **Versión del Kernel:** 7.0.0-15-generic.
- **Errores Críticos Identificados:**
  - `ath11k_pci 0000:01:00.0: Failed to set the requested Country regulatory setting`: El driver falla al restablecer el dominio regulatorio (MX/00) después de despertar.
  - `failed to process regulatory info -22`: Error de procesamiento que bloquea la inicialización de la radio.
  - **Gestión de Energía:** El sistema tiene activo `tlp` con `WIFI_PWR_ON_BAT="on"`, lo que fuerza estados de bajo consumo que el driver `ath11k` no gestiona correctamente durante la transición S0ix/S3.

## 3. Causa Raíz
El driver `ath11k_pci` presenta una inestabilidad conocida en kernels recientes al interactuar con las funciones de ahorro de energía de los estados de suspensión profunda de ACPI (Modern Standby/S0ix). La pérdida del contexto regulatorio impide que el firmware de Qualcomm vuelva a habilitar las frecuencias de transmisión de forma segura.

## 4. Soluciones Propuestas

### A. Desactivación de Ahorro de Energía (Recomendado)
Modificar `/etc/tlp.conf` para evitar que el WiFi entre en modo de bajo consumo:
```text
WIFI_PWR_ON_AC=off
WIFI_PWR_ON_BAT=off
```

### B. Reinicio Automatizado del Módulo (Workaround)
Crear un hook en systemd para recargar el driver al despertar:
**Archivo:** `/lib/systemd/system-sleep/reinit-ath11k`
```bash
#!/bin/sh
case $1 in
  post)
    modprobe -r ath11k_pci && sleep 1 && modprobe ath11k_pci
    ;;
esac
```

### C. Parámetros del Kernel
En caso de persistencia, evaluar añadir `pcie_aspm=off` a los parámetros de arranque de GRUB para estabilizar el bus PCIe de la tarjeta Qualcomm.

---
**Fecha de Diagnóstico:** 1 de junio de 2026
**Herramientas Usadas:** `dmesg`, `journalctl`, `lspci`, `nmcli`, `tlp-stat`.

   # Verificar si el WiFi está bloqueado por software/hardware
   `rfkill list`
   # Intentar reiniciar el módulo del driver manualmente
   `sudo modprobe -r ath11k_pci && sudo modprobe ath11k_pci`
