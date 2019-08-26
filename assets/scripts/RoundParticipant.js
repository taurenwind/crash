cc.Class({
    extends: cc.Component,

    properties: {
        userId : {
            default:'',
            visible:false
        },
        avatar : cc.Sprite,
        username: cc.Label,
        returnRate: cc.Label,
        stake: cc.Label,
        returnNum: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init ( data ) {
        var self = this;
        cc.loader.load(data.avatar, function(err, texture){   
            self.avatar.spriteFrame = new cc.SpriteFrame(texture);
        });
        self.username.string = data.username;
        self.returnRate.string = data.returnRate?data.returnRate+'x':'--';
        self.stake.string = data.stake;
        self.returnNum.string = data.returnNum?data.returnNum+'EVA':'--';
        self.userId = data.userId;
    },
    updateResult(data) {
        this.returnRate.string = data.returnRate?data.returnRate+'x':'--';
        this.returnNum.string = data.returnNum?data.returnNum+'EVA':'--';
    }
});
