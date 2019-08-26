// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var selectColor = new cc.Color(64, 70, 86);
var unSelectColor = new cc.Color(163, 168, 176);
cc.Class({
    extends: cc.Button,

    properties: {
        title : cc.Label,
        indicator : cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    select() {
        this.title.node.color = selectColor;
        this.indicator.node.active = true;
    },

    unSelect() {
        this.title.node.color = unSelectColor;
        this.indicator.node.active = false;
    }

    // update (dt) {},
});
