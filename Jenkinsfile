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
        BACKEND_PYTHON = 'C:\\Users\\nnaik\\AppData\\Local\\Programs\\Python\\Python310\\python.exe'
        FRONTEND_IMAGE = "ggraph-frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "ggraph-backend:${BUILD_NUMBER}"
        COMPOSE_PROJECT_NAME = "ggraph-${BUILD_NUMBER}"
        VITE_API_URL = '/api/v1'
        DOCKER_BUILDKIT = '1'
        COMPOSE_DOCKER_CLI_BUILD = '1'
        BACKEND_RUNTIME_AVAILABLE = 'true'
        BACKEND_CREDENTIALS_AVAILABLE = 'false'
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

        stage('Backend Toolchain Check') {
            steps {
                script {
                    def backendPythonExists = fileExists(env.BACKEND_PYTHON)
                    env.BACKEND_RUNTIME_AVAILABLE = backendPythonExists ? 'true' : 'false'

                    if (env.BACKEND_RUNTIME_AVAILABLE != 'true') {
                        error "Backend Python is not available at ${env.BACKEND_PYTHON}."
                    } else {
                        echo "Backend Python runtime detected at ${env.BACKEND_PYTHON}."
                    }
                }
            }
        }

        stage('Backend Credential Check') {
            steps {
                script {
                    def requiredKeys = [
                        env.OPENAI_API_KEY,
                        env.GOOGLE_API_KEY,
                        env.GEMINI_API_KEY,
                        env.CEREBRAS_API_KEY,
                        env.GROQ_API_KEY
                    ]

                    env.BACKEND_CREDENTIALS_AVAILABLE = requiredKeys.any { it?.trim() } ? 'true' : 'false'

                    if (env.BACKEND_CREDENTIALS_AVAILABLE != 'true') {
                        echo 'Backend API credentials are not configured in Jenkins. Agentic workflow stages will be skipped.'
                    } else {
                        echo 'Backend API credentials detected in Jenkins environment.'
                    }
                }
            }
        }

        stage('Back-end Pipeline') {

            when {
                expression { env.BACKEND_RUNTIME_AVAILABLE == 'true' }
            }

            stages {

                stage('Install dependencies') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat '"%BACKEND_PYTHON%" -m pip install --upgrade pip'
                            bat '"%BACKEND_PYTHON%" -m pip install -r requirements.txt'
                        }
                    }
                }

                stage('Execute tests') {
                    when {
                        expression { env.BACKEND_CREDENTIALS_AVAILABLE == 'true' }
                    }
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat '"%BACKEND_PYTHON%" test_run.py'
                        }
                    }
                }

                stage('Build services') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat '"%BACKEND_PYTHON%" -m compileall app'
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

            when {
                allOf {
                    expression { env.BACKEND_RUNTIME_AVAILABLE == 'true' }
                    expression { env.BACKEND_CREDENTIALS_AVAILABLE == 'true' }
                }
            }

            stages {

                stage('Dependency handling') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat '"%BACKEND_PYTHON%" -m pip install -r requirements.txt'
                        }
                    }
                }

                stage('Multi-agent orchestration setup') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat '"%BACKEND_PYTHON%" -c "from dotenv import load_dotenv; from app.graph import workflow_app; load_dotenv(); print(\'LangGraph workflow initialized:\', workflow_app is not None)"'
                        }
                    }
                }

                stage('Service initialization') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat '"%BACKEND_PYTHON%" -c "from app.config.settings import settings; from app.main import app; print(\'Backend service initialized:\', settings.APP_NAME); print(\'FastAPI app title:\', app.title)"'
                        }
                    }
                }

                stage('Workflow execution') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            bat '"%BACKEND_PYTHON%" test_run.py'
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