
cc.Class({
    name: 'GameHistory',
    extends: cc.Component,

    properties: {
        roundId: cc.Label,
        result: cc.Label
    },
    init: function(data) {
        this.roundId.string = data.roundId;
        this.result.string = (data.crashpoint * 1.0 / 100).toFixed(2);
    }
});
