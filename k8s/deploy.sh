#!/bin/bash

set -e

echo "Building Docker images..."
docker build -t user-service:latest ./user-service
docker build -t flight-service:latest ./flight-service
docker build -t payment-service:latest ./payment-service
docker build -t booking-service:latest ./booking-service
docker build -t api-gateway:latest ./api-gateway
docker build -t frontend:latest ./skybook-frontend

echo "Loading images to kind cluster (if using kind)..."
kind load docker-image user-service:latest --name skybook
kind load docker-image flight-service:latest --name skybook
kind load docker-image payment-service:latest --name skybook
kind load docker-image booking-service:latest --name skybook
kind load docker-image api-gateway:latest --name skybook
kind load docker-image frontend:latest --name skybook

echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/frontend.yaml

echo "Waiting for deployments..."
kubectl rollout status deployment/mysql
kubectl rollout status deployment/user-service
kubectl rollout status deployment/flight-service
kubectl rollout status deployment/payment-service
kubectl rollout status deployment/booking-service
kubectl rollout status deployment/api-gateway
kubectl rollout status deployment/frontend

echo "Done! Getting service status..."
kubectl get pods
kubectl get services
