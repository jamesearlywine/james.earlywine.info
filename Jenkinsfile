pipeline {
  agent any
  stages {
    stage('Deploy to S3') {
      when {
        expression {
          return env.BRANCH_NAME == 'master'
        }
      }
      steps {
        script {
          sh 'aws s3 sync ./public s3://james.earlywine.info/ --exclude ".git/*" --region us-east-2'
        }
      }
    }
    stage('Invalidate CloudFlare CDN Cache') {
      when {
        expression {
          return env.BRANCH_NAME == 'master'
        }
      }
      environment {
        CLOUDFLARE_EMAIL    = credentials('cloudflare_email_james.earlywine.info')
        CLOUDFLARE_ZONE     = credentials('cloudflare_zone_james.earlywine.info')
        CLOUDFLARE_API_KEY  = credentials('cloudflare_api_key.james.earlywine.info')
      }
      steps {
        script {
          sh 'curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/purge_cache" \
            -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
            -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
            -H "Content-Type: application/json" \
            --data \'{"purge_everything":true}\' \
          '
        }
      }
    }
  }
  post {
    always {
      cleanWs()
    }
  }
}