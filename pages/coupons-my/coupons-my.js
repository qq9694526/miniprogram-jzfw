// pages/coupons-my/coupons-my.js
const app = getApp();
const util = require('../../utils/util.js');
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
    this.getCoupons();
  },
  onShareAppMessage: function () {
  
  },
  getCoupons() {
    const { id: userId}= app.globalData.user;
    util.get("api/wx/user/coupon/"+userId).then((data) => {
      console.log(data)
      const nowTime = new Date().getTime();
      data.forEach((v, i) => {
        let time = util.formatTime(new Date(v.endTime)).split(" ")[0];
        data[i].time = time;
        if (nowTime > v.endTime){//已过期
          data[i].hasEnd=true;
        }else{
          data[i].hasEnd = false;
        }
      })
      this.setData({
        coupons: data
      })
    })
  }
})