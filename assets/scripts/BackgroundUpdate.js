// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const SCREEN_HEIGHT = 960;

const STATE_STATIC = 'static';
const STATE_DYNAMIC = 'dynamic';
cc.Class({
    extends: cc.Component,

    properties: {
        baseBG : cc.Sprite,
        repeatBG : [cc.Sprite],
        speed : 100,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initPos();
        this._state = STATE_STATIC;
    },

    start () {
        this.go();
    },

    update (dt) {
        if(this._state == STATE_DYNAMIC) {
            if(this.baseBG && !this._outOfScreen(this.baseBG)) {
                this.baseBG.node.y -= this.speed * dt;
            }
            for(let i = 0; i < this.repeatBG.length; i++) {
                let tile = this.repeatBG[i];
                tile.node.y -= this.speed * dt;
            }
            for(let i = 0; i < this.repeatBG.length; i++) {
                let tile = this.repeatBG[i];
                if(this._outOfScreen(tile)) {
                    let preIndex = i - 1 < 0 ? this.repeatBG.length - 1 : i - 1;
                    let preTile = this.repeatBG[preIndex];
                    tile.node.y = preTile.node.y + preTile.node.height/2 + tile.node.height/2;
                }
            }
        }
    },

    initPos() {
        if(this.baseBG) {
            this.baseBG.node.x = 0;
            this.baseBG.node.y = 0;
        }
        for(let i = 0; i < this.repeatBG.length; i++) {
            let tile = this.repeatBG[i];
            if(i == 0) {
                if(this.baseBG) {
                    tile.node.y = this.baseBG.node.height / 2+ tile.node.height/2;
                } else
                    tile.node.y = 0;
            } else {
                var preTile = this.repeatBG[i - 1];
                tile.node.y = preTile.node.y + preTile.node.height/2 + tile.node.height/2;
            }    
        }
    },
    go() {
        this._state = STATE_DYNAMIC;
    },
    stop() {
        this._state = STATE_STATIC;
    },
    _outOfScreen(tile) {
        if(tile.node.y + tile.node.height/2 <= -SCREEN_HEIGHT/2)
            return true;
    }
});
