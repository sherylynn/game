#drone secrets add \
#    --repository=p/game \
#    --name=ssh_key \
#    --value="$(sudo cat ~/.ssh/id_rsa)" \
#    --image=appleboy/drone-ssh
drone secret add \
    --repository=p/game \
    --name=ssh_key \
    --value=@$HOME/.ssh/id_rsa\
    --image=appleboy/drone-ssh
