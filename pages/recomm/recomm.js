// pages/recomm/recomm.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    noTaskText:"您还没有推荐任何用户",
    activeItem:0
  },
  onLoad: function (options) {
    const userId = app.globalData.user.id;
    util.get('api/user_info/recomm', {
      userId
    }).then((data) => {
      let { commUserList: user,commWorkList:worker}=data;
      user.forEach((v,i)=>{
        let time = util.formatTime(new Date(v.createTime));
        user[i].time=time;
      })
      worker.forEach((v, i) => {
        let time = util.formatTime(new Date(v.createTime));
        worker[i].time = time;
      })
      const activeItem = options.flag==1?1:0;
      const title = options.flag==1?"我的工友":"我的用户";
      this.setData({ list: [user, worker], activeItem})
      wx.setNavigationBarTitle({
        title
      })
    })
  },
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  changeListBar(e) {
    let texts = ["您还没有推荐任何用户", "您还没有推荐任何零工"],
      index = e.target.dataset.item;
    this.setData({
      activeItem: index,
      noTaskText: texts[index]
    })
  }
})
