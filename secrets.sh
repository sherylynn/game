#drone secrets add \
#    --repository=p/game \
#    --name=ssh_key \
#    --value="$(sudo cat ~/.ssh/id_rsa)" \
#    --image=appleboy/drone-ssh
#drone secret add \
#    --repository=p/game \
#    --name=ssh_key \
#    --value=@$HOME/.ssh/id_rsa\
#    --image=appleboy/drone-ssh
# 直接指定@似乎不生效？

#如果git服务器不是ip地址 似乎不能直接git clone下来
#而用外网ip,git clone起来非常慢
#如果用内网ip,git clone 不下来
