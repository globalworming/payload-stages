# Kubernetes Deployment Guide

## Prerequisites

- Kubernetes cluster (minikube, kind, or production cluster)
- kubectl configured
- Payload image built and available as `payload:latest`

## Build and Load Image (for local clusters)

```bash
# Build the image
cd src/payload-example
docker build -t payload:latest .

# For minikube
minikube image load payload:latest

# For kind
kind load docker-image payload:latest
```

## Deploy to Kubernetes

Apply manifests in the following order:

```bash
cd payload-example

# 1. Create namespace
kubectl apply -f namespace.yaml

# 2. Create secrets (contains database credentials and Payload config)
kubectl apply -f postgres-secret.yaml
kubectl apply -f payload-secret.yaml

# 3. Create persistent volume claim for PostgreSQL
kubectl apply -f postgres-pvc.yaml

# 4. Deploy PostgreSQL
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml

# 5. Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n payload-example --timeout=120s

# 6. Deploy Payload
kubectl apply -f payload-deployment.yaml
kubectl apply -f payload-service.yaml

# 7. Wait for Payload to be ready
kubectl wait --for=condition=ready pod -l app=payload -n payload-example --timeout=120s
```

## Apply all at once

```bash
kubectl apply -f payload-example/
```

## Access the Application

### Port-forward (for local development)

```bash
kubectl port-forward -n payload-example service/payload 3001:3000
```

Access Payload at: http://localhost:3001

### Expose via Ingress (for production)

Create an Ingress resource (example):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: payload-ingress
  namespace: payload-example
spec:
  rules:
  - host: payload.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: payload
            port:
              number: 3000
```

## Verify Deployment

```bash
# Check all resources
kubectl get all -n payload-example

# Check logs
kubectl logs -n payload-example -l app=payload --tail=100 -f
kubectl logs -n payload-example -l app=postgres --tail=100 -f

# Check secrets
kubectl get secrets -n payload-example
```

## Database Migrations

Migrations are run automatically on container startup via the Payload configuration.

## Troubleshooting

### Payload pod crashes or restarts

```bash
kubectl logs -n payload-example -l app=payload --previous
kubectl describe pod -n payload-example -l app=payload
```

### Database connection issues

```bash
# Verify PostgreSQL is running
kubectl get pods -n payload-example -l app=postgres

# Check PostgreSQL logs
kubectl logs -n payload-example -l app=postgres

# Test connection from Payload pod
kubectl exec -it -n payload-example deployment/payload -- sh
# Inside the pod:
# nc -zv postgres 5432
```

## Cleanup

```bash
kubectl delete namespace payload-example
```

## Security Considerations

**⚠️ IMPORTANT:** The secrets in this repository contain default credentials.

Before deploying to production:

1. Update `postgres-secret.yaml` with strong database credentials
2. Update `payload-secret.yaml` with a secure `PAYLOAD_SECRET` (generate with: `openssl rand -hex 32`)
3. Consider using external secret management (e.g., Sealed Secrets, External Secrets Operator, or cloud provider secret managers)

### Using kubectl to create secrets (recommended for production)

```bash
# Create postgres secret from env vars or file
kubectl create secret generic postgres-credentials \
  -n payload-example \
  --from-literal=POSTGRES_USER=payload \
  --from-literal=POSTGRES_PASSWORD=$(openssl rand -base64 32) \
  --from-literal=POSTGRES_DB=payload

# Create payload secret
kubectl create secret generic payload-config \
  -n payload-example \
  --from-literal=NODE_ENV=production \
  --from-literal=DATABASE_URI=postgres://payload:$(echo -n 'password' | base64)@postgres:5432/payload \
  --from-literal=PAYLOAD_SECRET=$(openssl rand -hex 32)
```

## Scaling

```bash
# Scale Payload deployment (PostgreSQL should remain at 1 replica)
kubectl scale deployment payload -n payload-example --replicas=3
```
