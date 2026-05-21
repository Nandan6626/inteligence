pipeline {
    agent any

    options {
        timestamps()
        ansiColor('xterm')
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
                            sh 'npm ci'
                        }
                    }
                }

                stage('Run validations / tests') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm run lint'
                            sh 'npm run test'
                        }
                    }
                }

                stage('Build application') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm run build'
                        }
                    }
                }

                stage('Docker image creation') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'docker build --build-arg VITE_API_URL=/api/v1 -t "${FRONTEND_IMAGE}" .'
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
                            sh 'python -m pip install --upgrade pip'
                            sh 'python -m pip install -r requirements.txt'
                        }
                    }
                }

                stage('Execute tests') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'python test_run.py'
                        }
                    }
                }

                stage('Build services') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'python -m compileall app'
                        }
                    }
                }

                stage('Docker image creation') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'docker build -t "${BACKEND_IMAGE}" .'
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
                            sh 'python -m pip install -r requirements.txt'
                        }
                    }
                }

                stage('Multi-agent orchestration setup') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'python -c "from dotenv import load_dotenv; from app.graph import workflow_app; load_dotenv(); print(\'LangGraph workflow initialized:\', workflow_app is not None)"'
                        }
                    }
                }

                stage('Service initialization') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'python -c "from app.config.settings import settings; from app.main import app; print(\'Backend service initialized:\', settings.APP_NAME); print(\'FastAPI app title:\', app.title)"'
                        }
                    }
                }

                stage('Workflow execution') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'python test_run.py'
                        }
                    }
                }
            }
        }

        stage('Full-Stack Integration Pipeline') {
            steps {
                sh '''
                    set -e

                    COMPOSE_CMD=$(docker compose version >/dev/null 2>&1 && echo 'docker compose' || echo 'docker-compose')

                    $COMPOSE_CMD up -d --build backend frontend redis

                    curl --fail --silent --show-error --retry 5 --retry-delay 2 --retry-all-errors http://localhost:8000/health/
                    curl --fail --silent --show-error --retry 5 --retry-delay 2 --retry-all-errors http://localhost/
                '''
            }
        }
    }

    post {
        always {
            sh '''
                COMPOSE_CMD=$(docker compose version >/dev/null 2>&1 && echo 'docker compose' || echo 'docker-compose')
                $COMPOSE_CMD down -v --remove-orphans || true
            '''
        }

        failure {
            sh '''
                COMPOSE_CMD=$(docker compose version >/dev/null 2>&1 && echo 'docker compose' || echo 'docker-compose')
                $COMPOSE_CMD logs --no-color --tail 100 || true
            '''
        }
    }
}