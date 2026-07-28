# Formateo y Configuración del SSD de 480 GB

Este documento detalla el proceso técnico, comandos y configuraciones aplicadas para preparar y formatear el SSD de 480 GB en un formato nativo y compatible con Linux.

---

## 1. Identificación del Dispositivo

Antes de proceder, se identificaron los dispositivos de almacenamiento mediante `lsblk` para localizar la unidad correcta:

```bash
lsblk -o NAME,FSTYPE,SIZE,MOUNTPOINTS,LABEL,MODEL,UUID
```

**Información detectada del SSD:**
*   **Identificador:** `/dev/sda`
*   **Modelo de disco:** OS TECH 480G (SSD STYL OS TECH 480G)
*   **Capacidad real detectada:** 447.1 GiB / 480 GB (480,103,981,056 bytes)
*   **Estado inicial:** Sin particiones montadas y con un esquema de partición obsoleto (`dos`/MBR) sin divisiones activas.

---

## 2. Creación de la Tabla de Particiones (GPT)

Para un disco de almacenamiento moderno en Linux, se configuró una tabla de particiones **GPT (GUID Partition Table)**, que supera las limitaciones de MBR (sistema DOS heredado).

### Herramienta utilizada
Se utilizó `parted` por su precisión y compatibilidad con scripts automatizados.

### Comandos ejecutados:
1.  **Creación de la tabla GPT:**
    ```bash
    sudo parted -s /dev/sda mklabel gpt
    ```
2.  **Creación de la partición primaria (100% del espacio):**
    ```bash
    sudo parted -s /dev/sda mkpart primary ext4 0% 100%
    ```

---

## 3. Formateo en Sistema de Archivos Ext4

El sistema de archivos **Ext4 (Fourth Extended Filesystem)** es el estándar en Linux debido a su alta fiabilidad, soporte para journaling y excelente rendimiento.

### Comando ejecutado:
Se aplicó un formateo forzado (`-F` para sobrescribir restos de firmas antiguas) y se asignó la etiqueta descriptiva `SSD-480GB` (`-L`):

```bash
sudo mkfs.ext4 -F -L SSD-480GB /dev/sda1
```

### Salida del formateo:
```text
mke2fs 1.47.2 (1-Jan-2025)
/dev/sda1 contiene un sistema de ficheros ntfs etiquetado 'Reservado para el sistema'
Se está creando un sistema de ficheros con 117212416 bloques de 4k y 29310976 nodos-i
UUID del sistema de ficheros: 83d12041-a192-4222-9f63-9682e6eab28c
Respaldos del superbloque guardados en los bloques: 
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
        4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 
        102400000

Reservando las tablas de grupo: hecho                            
Escribiendo las tablas de nodos-i: hecho                            
Creando el fichero de transacciones (262144 bloques): hecho
Escribiendo superbloques y la información contable del sistema de archivos: hecho
```

---

## 4. Verificación Final de la Estructura

Se verificó el resultado final con `lsblk` obteniendo los siguientes metadatos:

```bash
lsblk -o NAME,FSTYPE,SIZE,MOUNTPOINTS,LABEL,UUID /dev/sda
```

**Resultado:**
```text
NAME FSTYPE   SIZE MOUNTPOINTS LABEL     UUID
sda         447.1G                       
└─sda1
     ext4   447.1G             SSD-480GB 83d12041-a192-4222-9f63-9682e6eab28c
```

---

## 5. Guía de Uso Post-Formateo (Recomendada)

Los discos recién formateados en Ext4 pertenecen por defecto al usuario `root`. Para utilizarlos de manera normal, sigue estos pasos:

### Paso 5.1: Crear un punto de montaje y montar la unidad
Crea un directorio (por ejemplo, en `/media` o `/mnt`) y monta la partición:

```bash
sudo mkdir -p /mnt/almacenamiento
sudo mount /dev/sda1 /mnt/almacenamiento
```

### Paso 5.2: Asignar permisos al usuario actual
Cambia el propietario de la carpeta de montaje para que tu usuario (`jonathan-medina`) tenga permisos completos de lectura y escritura:

```bash
sudo chown -R jonathan-medina:jonathan-medina /mnt/almacenamiento
```

### Paso 5.3: Configurar Montaje Automático en el Arranque (`/etc/fstab`)
Para que el disco se monte automáticamente al encender el equipo usando su **UUID** (lo cual evita problemas si cambia el orden de las letras de los discos):

1.  Abre el archivo de configuración con privilegios:
    ```bash
    sudo nano /etc/fstab
    ```
2.  Añade la siguiente línea al final del archivo:
    ```text
    UUID=83d12041-a192-4222-9f63-9682e6eab28c  /mnt/almacenamiento  ext4  defaults,nofail,x-systemd.device-timeout=5s  0  2
    ```
    *   *Nota: La opción `nofail` asegura que si el SSD no está conectado en el arranque (p.ej. si fuera externo), el sistema operativo continúe iniciando con normalidad.*
