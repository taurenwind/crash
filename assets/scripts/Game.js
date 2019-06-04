// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        socketInfo: cc.Label,
        stateLabel: cc.Label,
        timesLabel: cc.Label,
        stakeInput: cc.EditBox,
        escapeInput: cc.EditBox,
        actionButton: cc.Button,
        actionButtonLable: cc.Label,

        historyContainer: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initSocket();
        this.historyContainer = this.historyContainer.getComponent('GameHistoryContainer');
    },

    start () {

    },

    update (dt) {},

    initSocket() {
        var self = this;
        var label = this.socketInfo;
        var socket = io.connect('http://127.0.0.1:3000',{
            query: 'token=' + 543456
        });
        this._socketIO = socket;
        socket.on('connected', function(){
            cc.log("log:a user connected");
            console.log('a user connected');
            socket.emit('message', 'hihihi');
          });

          socket.on('disconnect', function(){
            console.log('user disconnected');
          });
          socket.on('message', function(message) {
              cc.log("log:message=" + message);
              socket.emit('message', 'hihihi111');
              label.string = message;
          });
          socket.on('state', function(msg) {
            cc.log("log:state=" + msg);
            let state = JSON.parse(msg);
            self.updateState(state);
          });
          socket.on('config', function(msg) {
            var config = JSON.parse(msg);
            self._minStake = config.minStake;
            self._maxStake = config.maxStake;
            self._initSpeed = config.initSpeed;
            self._acc = config.acc;
          });
          socket.on('reward', function(msg){
            label.string = 'ever winner, chicken dinner ' + msg
          });
    },

    updateState(state) {
      this._state = state.state;
      this.stateLabel.string = state.state;
      this.actionButton.enabled = false;
      switch(state.state) {
        case 'config':
            this.timesLabel.string = '1.00x';
            this._height = 100;
            this._speed = this._initSpeed;
            this._joined = false;
        break;
        case 'waiting':

        break;
        case 'stake':
          this.actionButtonLable.string = '投注';
          this.actionButton.enabled = true;
        break;
        case 'lift_up':
          this.actionButtonLable.string = '逃跑';
          if(this._joined)
            this.actionButton.enabled = true;
          this._height = state.data.height;
          this._speed = state.data.speed;
          this._acc = state.data.acc;
          this.timesLabel.string = (this._height * 1.0 / 100).toFixed(2) + 'x';
          var self = this;
          if(this._timer) {
            clearInterval(this._timer);
          }
          this._timer = setInterval(function() {
            self._height = self._height  + self._speed * 100 / 1000;
            self._speed = self._speed + self._acc * 100 / 1000;
            self.timesLabel.string = (self._height * 1.0 / 100).toFixed(2) + 'x';
          }, 100);
        break;
        case 'crashed':
          if(this._timer)
            clearInterval(this._timer);
          this.timesLabel.string = (state.data.crashpoint * 1.0 / 100).toFixed(2) + 'x';
          if(this.historyContainer.node.childrenCount >= 5)
            this.historyContainer.node.removeChild(this.historyContainer.node.children[0]);
          this.historyContainer.addItem(state.data);
        break;
      }
    },
    _sendStake() {
      if(this._socketIO) {
        var pack = {
          stake: this.stakeInput.string,
          autoLine: this.escapeInput.string
        };
        this._socketIO.emit('stake', JSON.stringify(pack));
        this._joined = true;
      }
    },
    _escape() {
      if(this._socketIO) {
        this._socketIO.emit('escape', '');
        this._joined = false;
        this.actionButton.enabled = false;
      }
    },
    doAction() {
      if(this._state == 'stake')
        this._sendStake();
      else if(this._state == 'lift_up')
        this._escape();
    }
});
