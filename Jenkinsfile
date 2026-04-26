pipeline {
    agent any

    environment {
        NODEJS_HOME = '/Users/prateek/.nvm/versions/node/v25.4.0'
        PATH = "${NODEJS_HOME}/bin:/usr/local/bin:/opt/homebrew/bin:${env.PATH}"
        FRONTEND_IMAGE_NAME = 'prateekkumaryadav/turf-frontend'
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_HUB_CREDS = credentials('dockerhub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Frontend Dependencies...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running Frontend Tests...'
                sh 'npm run test -- --run'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Multi-Arch Frontend Docker Image...'
                sh "docker buildx create --use --name multiarch_builder || true"
                sh """
                docker buildx build \\
                  --platform linux/amd64,linux/arm64 \\
                  -t ${FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_TAG} \\
                  -t ${FRONTEND_IMAGE_NAME}:latest \\
                  .
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Frontend Docker Image...'
                sh "echo ${DOCKER_HUB_CREDS_PSW} | docker login -u ${DOCKER_HUB_CREDS_USR} --password-stdin"
                sh """
                docker buildx build \\
                  --platform linux/amd64,linux/arm64 \\
                  -t ${FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_TAG} \\
                  -t ${FRONTEND_IMAGE_NAME}:latest \\
                  --push .
                """
            }
        }
    }

    post {
        always {
            echo "Frontend Pipeline run completed."
        }
        success {
            emailext (
                subject: "BUILD SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Frontend build was successful!\nProject: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                to: 'prateek.student20@gmail.com',
                mimeType: 'text/plain'
            )
        }
        failure {
            emailext (
                subject: "BUILD FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Frontend build has failed!\nProject: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}\nCheck the console output",
                recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                to: 'prateek.student20@gmail.com',
                mimeType: 'text/plain'
            )
        }
    }
}
