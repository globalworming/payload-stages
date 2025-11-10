# payload-stages

## payload-stages with docker

```shell
docker compose -f docker-compose.yml up -d --build
```

## payload-stages with minikube

### install minikube

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
```

```shell
minikube start --driver=docker
```

```shell
# kubectl not found. If you need it, try: 
minikube kubectl -- get pods -A
# maybe set an alias
#alias kubectl="minikube kubectl --"
```

### setup argo
```shell
# in its own namespace
minikube kubectl -- create namespace argocd
```

```shell
# install argocd, might take a minute or two 
minikube kubectl -- apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

```

argocd-server has some warnings like

```JSON
[
{"level":"warning","msg":"Unable to parse updated settings: server.secretkey is missing","time":"2025-10-28T10:33:15Z"},
{"level":"warning","msg":"Static assets directory \"/shared/app\" does not exist, using only embedded assets","time":"2025-10-28T10:33:16Z"},
{"level":"warning","msg":"Failed to resync revoked tokens. retrying again in 1 minute: dial tcp 10.106.84.98:6379: connect: connection refused","time":"2025-10-28T10:33:20Z"},
]
```

```shell
# make argo ui accessible on port 8080 
minikube kubectl -- port-forward svc/argocd-server -n argocd 8080:443
```
username: admin  
password:
```shell
# get argocd admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

add more ns
```shell
minikube kubectl -- create namespace payload-example
minikube kubectl -- create namespace payload-example-ecommerce
```

### build image
make payload available for argo by building with minikube

```shell
# use minikube docker
eval $(minikube -p minikube docker-env)
current_dir=$(pwd)
for dir in "payload-example" "payload-example-ecommerce"; do
  cd "src/$dir"
  docker build -t "$dir:latest" .
  cd "$current_dir"
done
```

### create application
in argo UI, add app, edit as yaml

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payload-example
spec:
  destination:
    namespace: payload-example
    server: https://kubernetes.default.svc
  source:
    path: ./payload-example
    repoURL: https://github.com/globalworming/payload-stages
    targetRevision: main
    directory:
      recurse: false
  sources: []
  project: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: false
      enabled: true


```

same for

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payload-example-ecommerce
spec:
  destination:
    namespace: payload-example-ecommerce
    server: https://kubernetes.default.svc
  source:
    path: ./payload-example-ecommerce
    repoURL: https://github.com/globalworming/payload-stages
    targetRevision: main
    directory:
      recurse: false
  sources: []
  project: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: false
      enabled: true


```

### test 

```bash
kubectl port-forward -n payload-example service/payload 3001:3000
```

open http://localhost:3001, login with `admin@payload.test:123123123`  
or  
open http://localhost:3001, login with `creator@payload.test:123123123`

```bash
kubectl port-forward -n payload-example-ecommerce service/payload 3002:3000
```

open http://localhost:3002, create admin, go to admin, press `seed`