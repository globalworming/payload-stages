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

has some warnings like

```json
{"level":"warning","msg":"Unable to parse updated settings: server.secretkey is missing","time":"2025-10-06T08:16:04Z"}
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
minikube kubectl -- create namespace example-1
```

## build image
make sensepitch available for argo by building with minikube

```shell
# use minikube docker
eval $(minikube -p minikube docker-env)
cd $SENSEPITCH_DIR 
docker build -t sensepitch:latest .
```

## create application
in argo UI, add app, edit as yaml

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: sensepitch-stages
spec:
  destination:
    namespace: default
    server: https://kubernetes.default.svc
  source:
    path: .
    repoURL: https://github.com/globalworming/sensepitch-stages
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
