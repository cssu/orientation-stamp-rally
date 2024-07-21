pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Write .env File') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: '6a92ef53-8130-4dd8-968f-12600d877ec4', variable: 'POSTGRES_PASSWORD'),
                        string(credentialsId: '81758b43-11de-4075-a725-9157d2ea11bf', variable: 'JWT_SECRET')
                    ]) {
                def envContent = """
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
JWT_SECRET=${JWT_SECRET}
"""
                        writeFile file: '.env', text: envContent.trim()
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }
        
        stage('Deploy and Migrate') {
            steps {
                script {
                    sh 'docker compose up -d'
                }
            }
        }
    }
    
    post {
        success {
            setBuildStatus("Build succeeded", "SUCCESS")
        }
        failure {
            sh 'docker compose down'
            setBuildStatus("Build failed", "FAILURE")
        }
    }

    void setBuildStatus(String message, String state) {
        step([
            $class: "GitHubCommitStatusSetter",
            reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/cssu/orientation-stamp-rally"],
            contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
            errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
            statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
        ]);
    }
}