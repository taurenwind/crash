const ADD_STAKE = "add";
const REDUCE_STAKE = "reduce";
const MAX_STAKE = "max";
const MIN_STAKE = "min";
const DOUBLE_STAKE = "double";
const HALF_STAKE = "half";
const RESET_STAKE = "reset";
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
        nameLabel: cc.Label,
        moneyLabel: cc.Label,

        historyContainer: cc.Node,
        userHistoryContainer: cc.Node,

        roundParticipantContainer: cc.Node,

        topTab: cc.Node,
        tabs:[cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initSocket();
        this.historyContainer = this.historyContainer.getComponent('GameHistoryContainer');
        this.userHistoryContainer = this.userHistoryContainer.getComponent('UserHistoryContainer');
        this.topTab = this.topTab.getComponent("TopTab");

        this.roundParticipantContainer = this.roundParticipantContainer.getComponent('ParticipantContainer');
        this._backgroundUpdater = this.node.getComponent("BackgroundUpdate");
        this._countdown = 5;
    },

    start () {
      this.selectTab(null, 0);
    },

    update (dt) {},

    _startStateSchedule(state){
      if(this._callBack) {
        this.unschedule(this._callBack);
      }
      let self = this;
      self._countdown = 4;
      this._callBack = function() {
        if(self._countdown <= 0) {
          self.stateLabel.string = '';
          return;
        }
        if(state == 'config')
          self.stateLabel.string = '准备';
        else if (state == 'stake')
          self.stateLabel.string = '请下注 ' + self._countdown;
        else
          self.stateLabel.string = '';
        self._countdown--;
      }
      this.schedule(this._callBack, 1);
    },
    _cancelStateSchedule() {
      if(this._callBack) {
        this.unschedule(this._callBack);
        this.stateLabel.string = '';
      }
    },

    initSocket() {
        var self = this;
        var socket = io.connect('http://192.168.1.123:3000',{
            query: 'token=' + 543456 + '&userId='+'12345'
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
          });
          socket.on('state', function(msg) {
            cc.log("log:state=" + msg);
            let state = JSON.parse(msg);
            self.updateState(state);
          });
          socket.on('config', function(msg) {
            cc.log("log:config=" + msg);
            var config = JSON.parse(msg);
            self._initStake = config.stakeInit;
            self._minStake = config.stakeMin;
            self._maxStake = config.stakeMax;
            self._maxReturn = config.returnMax;
            self._initSpeed = config.initSpeed;
            self._acc = config.acc;
          });
          socket.on('userinfo', function(msg){
            self._userinfo = JSON.parse(msg);
            self.nameLabel.string = self._userinfo.username;
            self.moneyLabel.string = self._userinfo.money;
          });
          socket.on('reward', function(msg){
           // label.string = 'ever winner, chicken dinner ' + msg;
            var reward = JSON.parse(msg);
            self._userinfo.money = reward.account;
            self.moneyLabel.string = reward.account;
            self.roundParticipantContainer.updateItem(reward);
          });
          socket.on('stake',function(msg){
            cc.log("log:stake=" + msg);
            let stake = JSON.parse(msg);
            self.roundParticipantContainer.addItem(stake);
            if(stake.userId == self._userinfo.userId) {
              self._userinfo.money = stake.money;
              self.moneyLabel.string = stake.money;
              self._joined = true;
              if(self._state == 'lift_up') {
                self.actionButton.enabled = true;
              }
            }
          });
          socket.on('history', function(msg) {
            self._refreshUserHistory(msg);
          });
    },

    updateState(state) {
      this._state = state.state;
      // this.stateLabel.string = state.state;
      this.actionButton.enabled = false;
      switch(state.state) {
        case 'config':
            this.timesLabel.string = '1.00x';
            this._height = 100;
            this._speed = this._initSpeed;
            this._joined = false;
            this._backgroundUpdater.initPos();
            this._startStateSchedule(this._state);
            this.roundParticipantContainer.node.removeAllChildren();
        break;
        case 'waiting':

        break;
        case 'stake':
          this.actionButtonLable.string = '投注';
          this.actionButton.enabled = true;
          this._startStateSchedule(this._state);
        break;
        case 'lift_up':
          this._backgroundUpdater.go();
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
          this._cancelStateSchedule();
        break;
        case 'crashed':
          if(this._timer)
            clearInterval(this._timer);
          this.timesLabel.string = (state.data.crashpoint * 1.0 / 100).toFixed(2) + 'x';
          if(this.historyContainer.node.childrenCount >= 5)
            this.historyContainer.node.removeChild(this.historyContainer.node.children[0]);
          this.historyContainer.addItem(state.data);
          this._backgroundUpdater.stop();
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
      }
    },
    _escape() {
      if(this._socketIO) {
        this._socketIO.emit('escape', '');
        this._joined = false;
        this.actionButton.enabled = false;
      }
    },
    _refreshUserHistory(msg) {
      var history = JSON.parse(msg);
      if(history.length > 0) {
        this.userHistoryContainer.node.removeAllChildren();
        history.forEach(item => {
          item.avatar = "http://47.107.68.19/static/uploads/image/m2w614hq85lt_x_large_1GmM_6db70000859f125f-1539763481.jpg";
          this.userHistoryContainer.addItem(item);
        });
      }
          //   this.historyContainer.node.removeChild(this.historyContainer.node.children[0]);
          // this.historyContainer.addItem(state.data);
    },
    doAction() {
      if(this._state == 'stake')
        this._sendStake();
      else if(this._state == 'lift_up')
        this._escape();
    },
    selectTab(_, index) {
      cc.log("select tab " + index);
      this.topTab.select(index);
      if(index >= 0 && index <= this.tabs.length) {
        for (let i = 0; i < this.tabs.length; i++) {
          if(i == index - 1)
            this.tabs[i].active = true;
          else
            this.tabs[i].active = false;
        }
        this.tabs[index-1];
      }
    },
    // addStake() {
    //   this.stakeInput.string = parseInt(this.stakeInput.string) + 20;
    //   if(this.stakeInput.string > this._maxStake)
    //     this.stakeInput.string = this._maxStake;
    // },
    // reduceStake() {
    //   this.stakeInput.string = this.stakeInput.string - 20;
    //   if(this.stakeInput.string < this._minStake)
    //     this.stakeInput.string = this._minStake;
    // },
    stakeAction(_, type) {
      switch (type) {
        case ADD_STAKE:
          this.stakeInput.string = parseInt(this.stakeInput.string) + 20;
          break;
        case REDUCE_STAKE:
          this.stakeInput.string = this.stakeInput.string - 20;
          break;
        case MAX_STAKE:
            this.stakeInput.string = this._maxStake;
            break;
        case MIN_STAKE:
            this.stakeInput.string = this._minStake;
            break;
        case DOUBLE_STAKE:
            this.stakeInput.string = this.stakeInput.string * 2;
            break;
        case HALF_STAKE:
            this.stakeInput.string = this.stakeInput.string / 2;
            break;
        case RESET_STAKE:
            this.stakeInput.string = this._initStake;
            break;
        default:
          break;
      }
      if(this.stakeInput.string > this._maxStake)
          this.stakeInput.string = this._maxStake;
      if(this.stakeInput.string < this._minStake)
          this.stakeInput.string = this._minStake;
    }
});
