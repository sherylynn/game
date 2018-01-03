drone secret add \
    --repository=p/game \
    --name=ssh_key \
    --value="$(sudo cat ${HOME}/.ssh/id_rsa)" \
    --image=appleboy/drone-ssh
#drone secret add \
#    --repository=p/game \
#    --name=ssh_key \
#    --value=@$HOME/.ssh/id_rsa\
#    --image=appleboy/drone-ssh
# 直接指定@似乎不生效？
#again again
#设置文件权限400
#重新配置了自己的ssh
#如果git服务器不是ip地址 似乎不能直接git clone下来
#而用外网ip,git clone起来非常慢
#如果用内网ip,git clone 不下来
docker run --rm \
  -e PLUGIN_HOST=tx.18e.pub \
  -e PLUGIN_USERNAME=ubuntu \
  -e PLUGIN_KEY="$(cat ${HOME}/.ssh/id_rsa)" \
  -e PLUGIN_SCRIPT=whoami \
  -v $(pwd):$(pwd) \
  -w $(pwd) \
  appleboy/drone-ssh
