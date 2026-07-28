# Investigación de Brillo - HP EliteBook 845 G8

Este documento detalla los niveles de brillo y las capacidades de control detectadas en el sistema (Linux) para el teclado y la pantalla.

## 1. Retroiluminación del Teclado (KBD Backlight)

La retroiluminación general del teclado **no está expuesta al sistema operativo** como un dispositivo LED controlable (falta `/sys/class/leds/hp::kbd_backlight`).

*   **Gestión:** El brillo es controlado directamente por el **Firmware/Hardware** mediante teclas físicas (ej. `Fn + F3`).
*   **Niveles típicos (Hardware):** Apagado, Bajo, Alto.
*   **Configuración en BIOS:**
    *   **Tiempo de espera (Timeout):** 15 segundos (Valor actual).
    *   **Opciones disponibles:** 5s, 15s, 30s, 1m, 5m, Nunca.

## 2. LEDs de Teclas de Bloqueo

Los indicadores LED de las teclas individuales son detectados como dispositivos binarios:

| Dispositivo | Brillo Mínimo | Brillo Máximo | Función |
| :--- | :---: | :---: | :--- |
| `input4::capslock` | 0 | 1 | Indicador Mayúsculas |
| `input4::numlock` | 0 | 1 | Indicador Bloq Num |
| `input4::scrolllock` | 0 | 1 | Indicador Bloq Despl |

## 3. Brillo de la Pantalla (Display)

El panel principal es controlado a través del driver `amdgpu`.

*   **Dispositivo:** `/sys/class/backlight/amdgpu_bl1`
*   **Brillo Mínimo:** `0`
*   **Brillo Máximo:** `62,451`
*   **Estado de la investigación:** El sistema permite un control granular de más de 62,000 niveles para la retroiluminación del panel.

## 4. Otros Indicadores

*   **Mute / MicMute:** Los LEDs de silencio de audio y micrófono también operan en rango binario (`0-1`).
*   **Controladores cargados:** `hp_wmi`, `hp_bioscfg`, `amdgpu`.

## 5. Control de Brillo Avanzado (CLI)

Se ha instalado `brightnessctl` para permitir un control más fino del brillo de la pantalla, superando las limitaciones de los pasos estándar del entorno de escritorio.

### Comandos de uso:

*   **Ver información detallada:**
    ```bash
    brightnessctl info
    ```
*   **Establecer brillo a un nivel extremadamente bajo (ej. 100 de 62451):**
    ```bash
    sudo brightnessctl set 100
    ```
*   **Ajustes porcentuales finos (pasos de 1%):**
    ```bash
    sudo brightnessctl set +1%  # Subir
    sudo brightnessctl set 1%-  # Bajar
    ```

> **Nota:** El valor mínimo "seguro" del entorno de escritorio suele ser **624**. Valores por debajo de este (como **100**) permiten trabajar en entornos muy oscuros, pero deben usarse con precaución para no apagar la pantalla por completo accidentalmente.
