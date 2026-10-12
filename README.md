# 🎮 Quiz Application (MERN Stack on Kubernetes)

A full-stack, microservices-based quiz application containerized with Docker and deployed to a local Kubernetes cluster using Minikube and Nginx reverse proxying.

---

## 🏗️ Architecture Overview

The application follows a decoupled multi-tier architecture:

* **Frontend:** React SPA bundled and served via Nginx, handling single-page client routing (`try_files`) and proxying API requests.
* **Backend:** Node.js/Express REST API serving quiz questions and processing user sessions.
* **Database:** MongoDB instance running inside the cluster with persistent volume attachments.
* **Orchestration:** Managed via Kubernetes deployments, services (`ClusterIP` for backend/database, `NodePort` for frontend), and custom namespaces (`quiz-namespace`).

---

## 🛠️ Tech Stack

* **Frontend:** React, HTML5/CSS3, Nginx
* **Backend:** Node.js, Express.js, Mongoose
* **Database:** MongoDB
* **Containerization & Orchestration:** Docker, Kubernetes (kubectl), Minikube
* **DevOps Tools:** Terraform, GitHub Actions CI/CD (tfsec, Infracost)

---

## 📁 Repository Structure

```text
.
├── backend/                # Node.js Express API source code
├── frontend/               # React frontend source code & Dockerfile
├── nginx.conf              # Nginx server configuration (SPA fallback & API proxying)
├── k8s/                    # Kubernetes manifests (Deployments, Services, ConfigMaps, Secrets)
└── README.md

Local Deployment Guide (Minikube)
Prerequisites

Ensure you have the following installed on your machine:

    Docker

    Minikube

    kubectl

Step 1: Initial Deployment

    Start Minikube:
    Bash

    minikube start -p project7

    Apply Kubernetes Manifests:
    Bash

    kubectl apply -k . -n quiz-namespace

    Verify Pod Health:
    Bash

    kubectl get pods -n quiz-namespace

Step 2: Standard Startup Procedure

When starting or rebooting the Minikube cluster, run these 4 steps in order to ensure the database socket re-initializes cleanly without MongoTopologyClosedError connection drops:
Bash

# 1. Boot up the Minikube profile
minikube start -p project7

# 2. Restart backend to establish a fresh MongoDB socket connection
kubectl rollout restart deployment/backend-deployment -n quiz-namespace

# 3. Confirm rollout completion
kubectl rollout status deployment/backend-deployment -n quiz-namespace

# 4. Expose and launch the frontend application
minikube service frontend-service -n quiz-namespace -p project7

🔧 Nginx Reverse Proxy Configuration

The frontend container uses Nginx to handle both client-side route navigation and internal API request forwarding:
Nginx

server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend-service:2323;
    }
}

⚙️ Environment Variables & Configuration

Sensitive keys, environment variables, and database credentials are managed strictly outside of source control using Kubernetes Secrets (secret.yml).

Example .env.example structure:
Code snippet

PORT=2323
MONGO_URI=mongodb://mongodb-service:27017/quizdb
NODE_ENV=production

📄 License

This project is open-source and available under the MIT License.