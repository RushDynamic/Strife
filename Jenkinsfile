pipeline {

  /*
   * Run everything on an existing agent configured with a label 'docker'.
   * This agent will need docker, git and a jdk installed at a minimum.
   */
  agent any

  // using the Timestamper plugin we can add timestamps to the console log
  options {
    timestamps()
  }

  stages {
    stage('Stop Running Containers') {
      steps {
        sh 'sudo docker-compose down'
      }
    }
    stage('Setup Environment Variables') {
      steps {
        script {
          def envAccMgmtApi = "MONGODB_CONNECTION_URI=${MONGODB_CONNECTION_URI}\nS3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}\nS3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}\nS3_BUCKET_NAME=${S3_BUCKET_NAME}\nS3_AWS_REGION=${S3_AWS_REGION}\nCORS_ORIGIN_URL_ARRAY=${AM_CORS_ORIGIN_URL_ARRAY}\nUA_API_URL=${UA_API_URL}"
          def envUserAuthApi = "MONGODB_CONNECTION_URI=${MONGODB_CONNECTION_URI}\nACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}\nREFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}"
          def envStrifeChatApi = "CORS_ORIGIN_URL_ARRAY=${SC_CORS_ORIGIN_URL_ARRAY}\nAM_API_URL=${AM_API_URL}"

          writeFile(file: 'strife-server/account-management-api/.env', text: envAccMgmtApi)
          writeFile(file: 'strife-server/user-authorization-api/.env', text: envUserAuthApi)
          writeFile(file: 'strife-server/strife-chat-api/.env', text: envStrifeChatApi)
          sh "ls -l"
        }
      }
    }
    stage('Build') {
      steps {
        sh 'sudo docker-compose up --build -d'
      }
    }
    stage('NGINX Reload') {
      steps {
        sh """
          nginx -s reload
        """
      }
    }
  }
}