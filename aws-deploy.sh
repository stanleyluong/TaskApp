#!/bin/bash

# AWS Configuration
AWS_REGION="us-east-1"  # Change this to your preferred region
ECR_REPOSITORY="taskapp"
ECS_CLUSTER="taskapp-cluster"
ECS_SERVICE="taskapp-service"
ECS_TASK_DEFINITION="taskapp-task"

# Build and push Docker image
echo "Building Docker image..."
docker build -t $ECR_REPOSITORY .

# Login to Amazon ECR
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Create ECR repository if it doesn't exist
aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION || aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION

# Tag and push the image
ECR_REPOSITORY_URI=$(aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text)
docker tag $ECR_REPOSITORY:latest $ECR_REPOSITORY_URI:latest
docker push $ECR_REPOSITORY_URI:latest

# Create ECS task definition
echo "Creating ECS task definition..."
cat > task-definition.json << EOF
{
    "family": "$ECS_TASK_DEFINITION",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "containerDefinitions": [
        {
            "name": "taskapp",
            "image": "$ECR_REPOSITORY_URI:latest",
            "portMappings": [
                {
                    "containerPort": 3000,
                    "protocol": "tcp"
                }
            ],
            "environment": [
                {
                    "name": "DATABASE_URL",
                    "value": "postgresql://user:password@your-rds-endpoint:5432/taskapp"
                }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/$ECS_TASK_DEFINITION",
                    "awslogs-region": "$AWS_REGION",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}
EOF

# Register the task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json --region $AWS_REGION

# Create ECS cluster if it doesn't exist
aws ecs describe-clusters --clusters $ECS_CLUSTER --region $AWS_REGION || aws ecs create-cluster --cluster-name $ECS_CLUSTER --region $AWS_REGION

# Create or update the service
aws ecs create-service \
    --cluster $ECS_CLUSTER \
    --service-name $ECS_SERVICE \
    --task-definition $ECS_TASK_DEFINITION \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
    --region $AWS_REGION || \
aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service $ECS_SERVICE \
    --task-definition $ECS_TASK_DEFINITION \
    --region $AWS_REGION

echo "Deployment completed!" 