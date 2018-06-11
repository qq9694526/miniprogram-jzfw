// pages/user-edit/uesr-edit.js
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
    this.setData({
      user: app.globalData.user
    })
    this.getAudit();
  },
  getAudit() {
    const { id } = app.globalData.user;
    util.get('api/user_certi/info/' + id).then((data) => {
      console.log(data);
      this.setData({
        audit: data
      })
    })
  },
  formSubmit: function (e) {
    const { userName, userMobile, userAddress, userBankNum, userWxId } = e.detail.value;
    console.log(e.detail.value)
    util.post("/api/user_info/update", {
      id: this.data.user.id,
      userName,
      userMobile,
      userAddress,
      userBankNum,
      userWxId
    }).then((data) => {
      console.log(data);
      if (data == 0) {
        app.save("", function () {//重新获取个人信息
          wx.showToast({
            title: '修改成功',
            icon:'none'
          })
        });
        setTimeout(() => {
          wx.switchTab({
            url: '../user/user',
          })
        }, 1000)

      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})