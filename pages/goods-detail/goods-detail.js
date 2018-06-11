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
    console.log(id);
    this.getCarts();
    util.get("api/wx/market/goods_info/" + id).then((data) => {
      console.log(data);
      this.setData({
        good: data
      })
    })
    const { userMobile: tel, session_key } = app.globalData.user;
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
    const { iv, encryptedData: decryptData } = e.detail;
    const { id, sessionKey } = app.globalData.user;
    util.post("/api/user_info/update", {
      id,
      sessionKey,
      iv,
      decryptData
    }).then((data) => {
      console.log(data);
      this.orderConfrim()
    })
  },
  addCart() {
    const { id: userId } = app.globalData.user,
      goodsId = this.data.good.id;
    let goodsNum = this.data.goodsNum;
    util.post("api/market/cart_add", {
      goodsId,
      userId
    }).then((data) => {
      console.log(data)
      goodsNum+=1;
      this.setData({
        goodsNum
      });
      wx.navigateTo({
        url: `../goods-cart/goods-cart`
      })
    })
  },
  orderConfrim() {
    const { id } = this.data.good;
    wx.navigateTo({
      url: `../goods-cart/goods-cart`
    })
    // wx.navigateTo({
    //   url: `../order-confrim/order-confrim?id=${id}`
    // })
  },
  getCarts() {
    const { id: userId } = app.globalData.user;
    util.get("api/market/cart_list", {
      userId
    }).then((data) => {
      console.log(data);
      let goodsNum = 0;
      data.forEach((v, i) => {
        goodsNum += parseInt(v.goodsNum);
      })
      this.setData({
        goodsNum
      });
    })
  }
})