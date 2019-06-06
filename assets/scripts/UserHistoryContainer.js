cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab
    },

    // onLoad () {},

    start () {

    },

    addItem: function(data) {
        var item = cc.instantiate(this.itemPrefab);
        this.node.addChild(item);
        item.getComponent('UserHistory').init(data);
    }
});
