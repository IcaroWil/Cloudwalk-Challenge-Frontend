# Cloudwalk Challenge — Frontend (React + Vite + TypeScript)

Simple chat UI that talks to the **Backend API** and shows which **agent** answered (**MathAgent** or **KnowledgeAgent**).  
Supports **multiple conversations**, **Docker**, and **Kubernetes (Minikube + Ingress)**.

> This repository contains **only the Frontend**. The Backend runs in a separate repo/service.

---

## 1. Quickstart

```bash
# development (Vite dev server)
npm ci
npm run dev
# open http://localhost:5173
```
Set the backend URL in `.env.development` (see **Environment variables** below).

---
## 2. Environment variables
Create these files (examples included):

`./.env.development`
```bash
VITE_API_BASE_URL=http://localhost:3001
```
`./.env.production`
```bash
VITE_API_BASE_URL=http://backend.local
```
The backend must allow CORS for:

`http://localhost:5173`, `http://localhost:8080`, `http://frontend.local`.

---

## 3. Run with Docker

3.1 Build & run (Docker only)
```bash
# build with the backend URL baked into the bundle
docker build -t cloudwalk-frontend \
  --build-arg VITE_API_BASE_URL=http://localhost:3001 .

# run
docker run --rm -p 8080:80 cloudwalk-frontend
# open http://localhost:8080
```

3.2 (Optional) docker-compose (frontend only)

Create `docker-compose.yml` in this repo:
```bash
version: "3.9"
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: "http://localhost:3001"  # change to your backend URL
    ports:
      - "8080:80"
```

Run:
```bash
docker compose up -d --build
# open http://localhost:8080
```

---

## 4. Run on Kubernetes (Minikube + Ingress)
    Assumes the Backend is exposed at `http://backend.local` (Ingress in the same Minikube).

4.1 Build the image inside Minikube
```bash
# Git Bash
eval $(minikube -p minikube docker-env)

# build the frontend with the backend ingress URL
docker build -t frontend-frontend:local \
  --build-arg VITE_API_BASE_URL=http://backend.local .
```

4.2 Apply manifests (in this repo)
Create a `k8s/` folder with:

- `k8s/frontend-deployment.yaml`
- `k8s/frontend-service.yaml`
- `k8s/frontend-ingress.yaml`

Apply:
```bash
# enable ingress and run the tunnel (if not yet)
minikube addons enable ingress
minikube tunnel   # keep running in an admin terminal

# apply manifests
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/frontend-ingress.yaml
```

Add to `etc\hosts`:
```bash
127.0.0.1 frontend.local
127.0.0.1 backend.local   # backend must also be reachable via Ingress
```

Open:
```bash
http://frontend.local
```
    If KnowledgeAgent answers look generic, the Backend’s Redis likely needs **seed data**. Run the Backend repo’s seed script against the cluster Redis.

---

## 5. Architecture (UI → API)
```bash
Browser → Frontend (React + Vite)
            └─ POST /chat  ─────────> Backend
                           <───────── JSON { response, agent_workflow }
```

---

## 6. How to test multiple conversations
- Click “+ **New conversation**” in the sidebar to create new threads.
- Each thread uses a unique `conversation_id`, tracked independently by the Backend.

---

## 7. Project structure (reference)
```bash
src/
  api/           # axios client + /chat call
  components/    # ConversationList, ChatWindow, MessageBubble, ChatInput
  store/         # Zustand store (conversations/messages)
  types/         # request/response DTOs
  App.tsx
  main.tsx
.env.development
.env.production
Dockerfile
k8s/ (deployment, service, ingress)
```

---

## 8. Dockerfile (reference)
```bash
# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# serve static
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf 'server { \
  listen 80; \
  server_name _; \
  root /usr/share/nginx/html; \
  location / { try_files $uri /index.html; } \
} \
' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**.dockerignore**
```bash
node_modules
dist
.git
.vscode
*.log
```
