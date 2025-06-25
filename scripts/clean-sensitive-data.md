# Instrucciones para eliminar datos sensibles del historial de Git

## 1. Instalar BFG Repo-Cleaner

Descarga BFG desde: https://rtyley.github.io/bfg-repo-cleaner/

## 2. Hacer un clon espejo del repositorio (esto es importante)

```bash
# Crear un clon espejo en una carpeta temporal
git clone --mirror https://github.com/LilBeast999/Proyecto_Admin_U2_U3.git repo-temp.git
```

## 3. Ejecutar BFG para eliminar archivos sensibles

```bash
# Asegúrate de estar en el directorio donde descargaste BFG
java -jar bfg.jar --delete-files "*.pem" repo-temp.git
java -jar bfg.jar --delete-files "*.key" repo-temp.git
java -jar bfg.jar --delete-files "keys.json" repo-temp.git
```

## 4. Limpiar y empaquetar el repositorio

```bash
cd repo-temp.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## 5. Subir los cambios al repositorio remoto

```bash
git push --force
```

## 6. Clonar de nuevo el repositorio limpio

```bash
cd ..
rm -rf Proyecto_Admin_U2_U3
git clone https://github.com/LilBeast999/Proyecto_Admin_U2_U3.git
```
