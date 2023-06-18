# Serverless Function on Kyma Runtime (SAP BTP)

This repository explains how to create a serverless function on the Kyma runtime (SAP BTP).

## Repository Structure

The repository directory consists of the following components:

- `deployments` folder: This folder holds the Redis deployment, its secret, and its service definition so that functions can access it within Kyma.
- `functions` folder: This folder contains the serverless function itself, which will be exposed through its API rule.

## Deployment Approaches

To deploy everything in Kyma, two approaches were used to provide a better understanding of how to use Kyma.

### Redis Deployment

The Redis deployment will happen through the Kyma dashboard. Follow these steps to deploy Redis:

1. Upload the three YAML files for Redis to the Kyma dashboard. These files include the Redis configuration, its service definition, and secrets.

### Serverless Function Deployment

The serverless functions, on the other hand, will be deployed using the Kyma and Kubernetes CLI. Follow these steps to deploy the functions:

1. Change the directory to the `functions/get-file` directory.
2. Execute the following commands:

```bash
kyma apply function
kubectl apply -f apirule.yaml
```

These commands will deploy the serverless function and expose it through an API rule.

**Note:** Make sure to substitute the cluster domain, host, and other configuration-specific values according to your setup.

## Conclusion

By following the instructions in this repository, you will be able to create and deploy a serverless function on the Kyma runtime (SAP BTP) using different deployment approaches.
