#!/bin/bash

openssl aes-256-cbc -K $encrypted_52003b97e11e_key -iv $encrypted_52003b97e11e_iv -in deploy_rsa_node.enc -out deploy_key_node -d

eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 $TRAVIS_BUILD_DIR/deploy_key_node # Allow read access to the private key
ssh-add $TRAVIS_BUILD_DIR/deploy_key_node # Add the private key to SSH

ssh -p $sshPort $sshUser@$sshHost -o StrictHostKeyChecking=no "$( cat <<EOT
  source .zshrc
  cd '${depPath}'
  pm2 stop '${depProject}'
  pm2 delete '${depProject}'
  pm2 flush
  nvm install '${depNode}'
  nvm use '${depNode}'
  git stash
  git pull
  npm i
  WAOS_NODE_port='${depPort}' WAOS_NODE_cors_origin='${depCors}' NODE_ENV=production pm2 start server.js --name=waosNode
  echo "$(date -u) Deploy ${depProject} on node $(node -v) with npm $(npm -v)"  >> ./deploy.log
  exit
EOT
)"
