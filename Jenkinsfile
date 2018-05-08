pipeline {
  agent any
  stages {
    stage('Deploy to S3') {
      steps {
        script {
          if(env.BRANCH_NAME == 'master') {
            sh 'aws s3 sync ./public s3://james.earlywine.info/ --recursive  --exclude ".git/*" --region us-east-2'
          }
        }
      }
    }
  }
}