#!/bin/bash

eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 $TRAVIS_BUILD_DIR/.travis/deploy_key # Allow read access to the private key
ssh-add $TRAVIS_BUILD_DIR/.travis/deploy_key # Add the private key to SSH

ssh -p $SSH_PORT $SSH_USER@$SSH_SERVER -o StrictHostKeyChecking=no "$( cat <<EOT
  echo "$(date -u) Deploy '${DEPLOY_PROJECT}'"  >> ./deploy.log
  cd '${DEPLOY_PATH}'
  git pull
  npm install
  pm2 stop '${DEPLOY_PROJECT}'
  pm2 delete '${DEPLOY_PROJECT}'
  pm2 flush
  npm run prod
  exit
EOT
)"
