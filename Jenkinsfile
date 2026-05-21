pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        FRONTEND_IMAGE = "ggraph-frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "ggraph-backend:${BUILD_NUMBER}"
        COMPOSE_PROJECT_NAME = "ggraph-${BUILD_NUMBER}"
        VITE_API_URL = '/api/v1'
        DOCKER_BUILDKIT = '1'
        COMPOSE_DOCKER_CLI_BUILD = '1'
    }

    stages {

        stage('Front-end Pipeline') {

            stages {

                stage('Install dependencies') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            bat 'npm ci'
                        }
                    }
                }

                stage('Run validations / tests') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            bat 'npm run lint'
                            bat 'npm run test'
                        }
                    }
                }

                stage('Build application') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            bat 'npm run build'
                        }
                    }
                }

                stage('Docker image creation') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            bat '''
                                where docker >nul 2>nul || exit /b 0
                                docker build --build-arg VITE_API_URL=/api/v1 -t "%FRONTEND_IMAGE%" .
                            '''
                        }
                    }
                }
            }
        }

        stage('Back-end Pipeline') {

            stages {

                stage('Install dependencies') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat 'python -m pip install --upgrade pip'
                            bat 'python -m pip install -r requirements.txt'
                        }
                    }
                }

                stage('Execute tests') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat 'python test_run.py'
                        }
                    }
                }

                stage('Build services') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat 'python -m compileall app'
                        }
                    }
                }

                stage('Docker image creation') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat '''
                                where docker >nul 2>nul || exit /b 0
                                docker build -t "%BACKEND_IMAGE%" .
                            '''
                        }
                    }
                }
            }
        }

        stage('Agentic Orchestration Pipeline') {

            stages {

                stage('Dependency handling') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat 'python -m pip install -r requirements.txt'
                        }
                    }
                }

                stage('Multi-agent orchestration setup') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat 'python -c "from dotenv import load_dotenv; from app.graph import workflow_app; load_dotenv(); print(\'LangGraph workflow initialized:\', workflow_app is not None)"'
                        }
                    }
                }

                stage('Service initialization') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat 'python -c "from app.config.settings import settings; from app.main import app; print(\'Backend service initialized:\', settings.APP_NAME); print(\'FastAPI app title:\', app.title)"'
                        }
                    }
                }

                stage('Workflow execution') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat 'python test_run.py'
                        }
                    }
                }
            }
        }

        stage('Full-Stack Integration Pipeline') {

            steps {

                bat '''
                    where docker >nul 2>nul || exit /b 0
                    docker compose up -d --build backend frontend redis

                    powershell -NoProfile -Command "Invoke-WebRequest -UseBasicParsing http://localhost:8000/health/ | Out-Null"
                    powershell -NoProfile -Command "Invoke-WebRequest -UseBasicParsing http://localhost/ | Out-Null"
                '''
            }
        }
    }

    post {

        always {

            bat '''
                where docker >nul 2>nul || exit /b 0
                docker compose down -v --remove-orphans
            '''
        }

        failure {

            bat '''
                where docker >nul 2>nul || exit /b 0
                docker compose logs --no-color --tail 100
            '''
        }
    }
}