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
            publishChecks name: 'Jenkins CI', 
                          title: 'Build Succeeded', 
                          summary: 'The build completed successfully',
                          text: 'All stages completed without any issues',
                          conclusion: 'SUCCESS'
        }
        failure {
            publishChecks name: 'Jenkins CI', 
                          title: 'Build Failed', 
                          summary: 'The build failed',
                          text: 'One or more stages failed. Docker compose was shut down.',
                          conclusion: 'FAILURE'
            sh 'docker compose down'
        }
    }
}