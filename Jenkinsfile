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
        sh """
          nginx -s reload
        """
      }
    }
  }
}