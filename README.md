# Kubernetes Auth Action

Authenticate kubectl with a service token, and deauthenticate after job completion.

## Requirements

Requires `kubectl` to be installed and available on the `PATH`.

## Environment variables

Expects the `KUBERNETES_AUTH_TOKEN` to contain the authentication token for the cluster.

## Inputs

| Name | Default | Required | Description |
| kubernetesClusterDomain | | yes | Fully qualified domain name of the cluster. |
| kubernetesServer | `https://<cluster-domain>:6443` | no | Kubernetes server. If this is not specified, the value used will be https://<kubernetesClusterDomain>:6443. Specify this paramater if a different server is required. |
| kubernetesContext | | yes | Kubernetes context name. Usually the name of the cluster, but can be random. |
| kubernetesNamespace | | yes | Kubernetes namespace name. Should be similar to service name. |

## Example usage


``` yaml
name: Build & Deploy

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
jobs:
  do-things:
    needs: build
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v2
      - name: Auth
        env:
          KUBERNETES_AUTH_TOKEN: ${{ secrets.KUBERNETES_AUTH_TOKEN }}
        uses: smartlyio/kubernetes-auth-action@v1
        with:
          kubernetesClusterDomain: my-kubernetes-server.example.com
          kubernetesContext: kube-prod
          kubernetesNamespace: my-service-name
```

## Development

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

 PASS  ./index.test.js
  ✓ ...

...
```
