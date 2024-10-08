pipeline {
    agent any
    tools {
        nodejs '20.17.0'
    }
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
                        string(credentialsId: '60850337-55a7-4857-a176-1f434d4cf8b5', variable: 'POSTGRES_PASSWORD'),
                        string(credentialsId: 'fc04f487-0afc-45fe-bfa2-b9348a6bf813', variable: 'JWT_SECRET')
                    ]) {
                def envContent = """
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
DATABASE_URL=postgresql://orientation:${POSTGRES_PASSWORD}@localhost:5432
JWT_SECRET=${JWT_SECRET}
URL=https://orientation.cssu.ca
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
                    sh 'docker compose up -d --wait'

                    sh 'prisma generate'
                    sh 'prisma migrate deploy'
                    sh 'prisma db seed'
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
        }
    }
}