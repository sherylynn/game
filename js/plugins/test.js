/*:
  * @plugindesc 测试用例
  * @author sherylynn
  *
  * @param screen width
  * @desc 游戏屏幕宽度
  * @default 816
  *
  * @param screen height
  * @desc 游戏屏幕高度
  * @default 624
*/

var params =PluginManager.parameters('test')
var screen_width=Number(params['screen width']) ||1366
var screen_height=Number(params['screen height'])||768
alert(1)
function set_screen_size(screen_width,screen_height){
  var delta_width=screen_width-window.innerWidth
  var delta_height=screen_height-window.innerHeight
  window.moveBy(- delta_width/2,-delta_height/2)
  window.resizeBy(delta_width,delta_height)
}
set_screen_size(screen_width,screen_height)
