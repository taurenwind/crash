cc.Class({
    name: 'UserHistory',
    extends: cc.Component,

    properties: {
        roundId: cc.Label,
        result: cc.Label,
        stake: cc.Label,
        reward: cc.Label,
        hash: cc.Label
    },
    init: function(data) {
        this.roundId.string = data.round_id;
        this.result.string = data.bust;
        this.stake.string = data.stake == null?'-':data.stake;
        this.reward.string = data.reward== null?'-':data.reward;
        this.hash.string = data.hash;
    }
});