
ImageManager.loadMenusMain = function(filename) {
    return this.loadBitmap('img/pictures/', filename, 0, true);
};

//一个容器，这里可以把菜单背景图片放进来
var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
Scene_Menu.prototype.createBackground = function() {
	_Scene_Menu_createBackground .call(this);
	this._field = new Sprite();
	this.addChild(this._field);	
};

var _Scene_Menu_create = Scene_Menu.prototype.create; 

Scene_Menu.prototype.create = function() {
     _Scene_Menu_create.call(this);
     //命令列表
    this._commandWindow.x = 100;
	this._commandWindow.y = 120;
	this._commandWindow.contents.fontSize = 12;	
	this._commandWindowOrg = [this._commandWindow.x,this._commandWindow.y];
    this._commandWindow.width = 120;
    //角色状态栏
    this._statusWindow.x = 220;
    this._statusWindow.y = 120;
    this._statusWindow.contents.fontSize = 12;	
	this._statusWindowOrg = [this._statusWindow.x,this._statusWindow.y];
    this._statusWindow.width = 500;
    this._statusWindow.height = 350;
     this.createMenuElement();
    }; 
//在这里创建和菜单相关的元素
Scene_Menu.prototype.createMenuElement = function() {
    this.createLayout();
    this.createLayoutCommand();
	 
};

Scene_Menu.prototype.createLayout = function() {
    this._layout = new Sprite(ImageManager.loadMenusMain("layout"));
    this._field.addChild(this._layout);
};

Scene_Menu.prototype.createLayoutCommand = function() {
	this._layoutCommand = new Sprite(ImageManager.loadMenusMain("LayoutCommand"));
	this._field.addChild(this._layoutCommand);	
};

Scene_Menu.prototype.updateMenuElement = function() {
	this.updateLayout()
};

Scene_Menu.prototype.updateLayout = function() {
	this._layoutCommand.x = 100;
	this._layoutCommand.y = 120;
	this._layoutCommand.opacity = this._commandWindow.contentsOpacity;
    this._commandWindow.opacity = 0;
    
    this._statusWindow.opacity = 0;	

};

var _Scene_Menu_update = Scene_Menu.prototype.update;
Scene_Menu.prototype.update = function() {
	_Scene_Menu_update.call(this);
    if (this._layout) {this.updateMenuElement()};
};