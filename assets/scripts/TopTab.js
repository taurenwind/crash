
cc.Class({
    extends: cc.Component,

    properties: {
        tabs : [cc.Node]
    },

    onLoad () {
        if(this.tabs) {
            for (let index = 0; index < this.tabs.length; index++) {
                this.tabs[index] = this.tabs[index].getComponent("TabItem");
            }
        }
    },

    start () {

    },

    select (index) {
        if(this.tabs) {
            if(index < this.tabs.length && index >= 0) {
                for (let i = 0; i < this.tabs.length; i++) {
                    if(i == index)
                        this.tabs[i].select();
                    else
                        this.tabs[i].unSelect();
                }
            }
        }
    }
});
