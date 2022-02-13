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
    stage('Setup Environment Variables') {
      steps {
        script {
          def envAM = "MONGODB_CONNECTION_URI=${MONGODB_CONNECTION_URI}\nS3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}\nS3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}\nS3_BUCKET_NAMES3_AWS_REGION=${S3_BUCKET_NAMES3_AWS_REGION}\nCORS_ORIGIN_URL_ARRAY=${AM_CORS_ORIGIN_URL_ARRAY}\nUA_API_URL=${UA_API_URL}"
          writeFile(file: '/strife-server/account-management-api/.env', text: envAM)
          sh "ls -l"
        }
      }
    }
    stage('Build') {
      steps {
        sh 'sudo docker-compose up --build -d'
      }
      post {
        success {
          mail to: 'rushdynamic1ms@gmail.com',
            subject: "Successful Pipeline Run: ${currentBuild.fullDisplayName}",
            body: "Build completed: ${env.BUILD_URL}"
        }
      }
    }
    stage('NGINX Reload') {
      steps {
        sh ""
        "
        nginx - s reload ""
        "
      }
    }
  }
}