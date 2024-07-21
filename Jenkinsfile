pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }
        
        stage('Deploy and Migrate') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }
    }
    
    post {
        failure {
            sh 'docker-compose down'
        }
    }
}