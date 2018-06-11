// pages/cash/cash.js
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
  goPay(e) {
    console.log(e.detail);
    const { id:userId, opId:openId} = app.globalData.user;
    const { money: faceMoney}=e.detail.value;
    if (faceMoney==0){
      wx.showToast({
        title: '支付金额不能为0',
        icon:'none'
      })
      return;
    }
    util.post("api/wx/face_pay", { userId, faceMoney }).then((data) => {
      const { nonceStr, package: packages, paySign, signType, timeStamp, orderSn } = data;
      wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonceStr,
        'package': packages,
        'signType': signType,
        'paySign': paySign,
        'success': function (res) {
          console.log("res")
          console.log(res)
          util.get("api/wx/goods_payback/" + orderSn).then((data) => {
            console.log("data")
            console.log(data)
            wx.showToast({
              title: '支付成功'
            })
            setTimeout(()=>{
              wx.switchTab({
                url: '../index/index'
              })
            },1000)
          })
        },
        'fail': function (res) {
        }
      })
    })
  }
})