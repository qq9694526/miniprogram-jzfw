// pages/service/service.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id;
    console.log(id)
    util.get("api/wx/product/" + id).then((data)=>{
      console.log(data);
      this.setData({
        service: data
      })
    })
    const { userMobile:tel, session_key} = app.globalData.user;
    if (tel) {
      this.setData({
        tel
      })
    }
  },
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  getPhoneNumber: function (e) {
    const { iv, encryptedData: decryptData}=e.detail;
    const { id, sessionKey}=app.globalData.user;
    util.post("/api/user_info/update",{
      id,
      sessionKey,
      iv,
      decryptData
    }).then((data) => {
      console.log(data);
      this.orderConfrim()
    })
  },
  orderConfrim(){
    const {id}=this.data.service;
    wx.navigateTo({
      url: `../order-confrim/order-confrim?id=${id}`
    })
  }
})