// pages/account/account.js
const app=getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:{
      totalAcount: 0.00,
      availAcount: 0.00,
      unPointAcount:0.00
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
  }, 
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  extract(){
    const that=this,
      availAcount = that.data.account.availAcount;
    console.log(availAcount)
    if (parseFloat(availAcount)<=0){
      wx.showToast({
        icon: "none",
        title: '无可提现金额',
        duration: 2500
      })
      return;
    }
    const userId = app.globalData.user.id;
    util.post("api/acount/extract", {
      userId
    }).then((data) => {
      if (data==0){
        that.getInfo();
      }
    })
  },
  extracting(){
    wx.showToast({
      icon:"none",
      title: '您有一单提现申请正在处理中,3-5个工作日内会以微信红包形式发放',
      duration:2500
    })
  },
  getInfo(){
    const userId = app.globalData.user.id;
    util.get("api/acount/info", {
      userId
    }).then((data) => {
      console.log(data);
      this.setData({
        account: data
      })
    })
  }
})