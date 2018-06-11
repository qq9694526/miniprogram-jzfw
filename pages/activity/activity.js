// pages/activity/activity.js
const app = getApp();
const util = require('../../utils/util.js');
const WxParse = require('../../tpl/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id,
    that=this;
    util.get('api/wx/content/' + id).then((data)=>{
      let activity=data;
      activity.time = util.formatTime(new Date(data.createTime));
      var article = '<div>' + activity.content+'</div>';
      WxParse.wxParse('article', 'html', article, that, 5);
      this.setData({
        activity
      })
    })
  },
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  }
})