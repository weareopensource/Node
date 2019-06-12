#!/bin/bash

eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 $TRAVIS_BUILD_DIR/.travis/deploy_key # Allow read access to the private key
ssh-add $TRAVIS_BUILD_DIR/.travis/deploy_key # Add the private key to SSH

ssh -p $sshPort $sshUser@$sshHost -o StrictHostKeyChecking=no "$( cat <<EOT
  echo "$(date -u) Deploy '${depProject}'"  >> ./deploy.log
  cd '${depPath}'
  git pull
  npm install
  pm2 stop '${depProject}'
  pm2 delete '${depProject}'
  pm2 flush
  npm run prod
  exit
EOT
)"
