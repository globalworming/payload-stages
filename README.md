# sensepitch-stages

## install minikube

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
```

```shell
minikube start \
  --driver=docker # others? kvm2?

# minikube stop   
```

```shell
# kubectl not found. If you need it, try: 
minikube kubectl -- get pods -A
# maybe set an alias
#alias kubectl="minikube kubectl --"
```

## setup argo

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
# in its own namespace
minikube kubectl -- create namespace payload-example
```

## build image
make payload available for argo by building with minikube

```shell
# use minikube docker
eval $(minikube -p minikube docker-env)
 
docker build -t sensepitch:latest .
```

## create application
in argo UI, add app, edit as yaml

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payload-stages
spec:
  destination:
    namespace: payload-example
    server: https://kubernetes.default.svc
  source:
    path: .
    repoURL: https://github.com/globalworming/payload-stages
    targetRevision: main
    directory:
      recurse: true
  sources: []
  project: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: false
      enabled: true


```

<img src="./argo.png" width="600"/>

## test example-1

```shell
minikube kubectl -- port-forward deployment/sensepitch-proxy 8443:17443 -n example-1
```

```shell
curl -k https://localhost:8443
```
