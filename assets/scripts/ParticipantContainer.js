
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    addItem: function(data) {
        var item = cc.instantiate(this.itemPrefab);
        this.node.addChild(item);
        item.getComponent('RoundParticipant').init(data);
    },

    updateItem: function(data) {
        var children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            const item = children[i].getComponent('RoundParticipant');
            if(item.userId == data.userId) {
                item.updateResult(data);
                break;
            }
        }
    },
});
