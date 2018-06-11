// pages/coupons-all/coupons-all.js
const app = getApp()
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
    this.getCoupons()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getCoupons() {
    util.get("api/wx/coupons").then((data) => {
      console.log(data)
      data.forEach((v,i)=>{
        let time = util.formatTime(new Date(v.endTime));
        data[i].time = time;
      })
      this.setData({
        coupons: data
      })
    })
  },
  getCoupon(e) {
    const userId = app.globalData.user.id,
      conponId = e.currentTarget.dataset.id;
    util.post("api/wx/get/coupon", { userId, conponId }).then((data) => {
      console.log(data)
      if (data == 0) {//领取成功
        wx.showToast({
          title: '领取成功',
          icon:'none'
        })
      } else if (data == 1) {
        wx.showToast({
          title: '您已领取该优惠券',
          icon: 'none'
        })
      } else if (data == 3) {
        wx.showToast({
          title: '您已使用该优惠券',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '领取失败，请稍后重试',
          icon: 'none'
        })
      }
    })
  }
})