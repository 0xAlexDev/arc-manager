#!/bin/bash

# ==========================
# Configurazione percorsi
# ==========================

# Projects folders
react_client="arc-manager"
spring_backend="arc-manager-backend"

# Build folders
react_client_build="$react_client/build"
spring_backend_build="$spring_backend/target/arc-manager-0.0.1-SNAPSHOT.jar"

# Deploy folders
#react_client_deploy_folder="./Deploy/arc-manager/arc-manager-client/"
#spring_backend_deploy_folder="./Deploy/arc-manager/arc-manager-server/target"

# ==========================
# Build frontend React
# ==========================
cd ./$react_client || { echo "Cartella frontend non trovata"; exit 1; }

if npm install && npm run build; then
    echo "--- Build React completata con successo ---"
else
    echo "Errore nella build React."
    exit 1
fi

# ==========================
# Build backend Spring Boot
# ==========================
cd ..
cd ./$spring_backend || { echo "Cartella backend non trovata"; exit 1; }

if mvn clean package -DskipTests; then
    echo "--- Build Spring Boot completata con successo ---"
else
    echo "Errore nella build Spring Boot."
    exit 1
fi

# ==========================
# Copia build nelle cartelle deploy
# ==========================
# rm -rf "$react_client_deploy_folder"/*
# rm -rf "$spring_backend_deploy_folder"/*

# cp -r "$react_client_build" "$react_client_deploy_folder"
# cp "$spring_backend_build" "$spring_backend_deploy_folder"

echo "Operazione completata con successo!"
