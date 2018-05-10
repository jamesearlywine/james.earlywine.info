pipeline {
  agent any
  stages {
    stage('Deploy to S3') {
      steps {
        script {
          if(env.BRANCH_NAME == 'master') {
            sh 'aws s3 sync ./public s3://james.earlywine.info/ --exclude ".git/*" --region us-east-2'
          }
        }
      }
    }
    stage('Invalidate CloudFlare CDN Cache') {
      environment {
        CLOUDFLARE_EMAIL=credential('cloudflare_email_james.earlywine.info')
        CLOUDFLARE_ZONE=credential('cloudflare_zone_james.earlywine.info')
        CLOUDFLARE_API_KEY=credential('cloudflare_api_key.james.earlywine.info')
      }
      steps {
        script {
          if(env.BRANCH_NAME == 'master') {
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
  }
}