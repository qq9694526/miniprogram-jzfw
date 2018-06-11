// pages/order-confrim/order-confrim.js
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id;
    console.log(id)
    util.get("api/wx/product/" + id).then((data) => {
      console.log(data);
      this.setData({
        service: data
      })
    })
  },
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  chooseAddress() {
    const that = this;
    wx.chooseAddress({
      success: function (res) {
        const detail = res.provinceName + res.cityName + res.countyName + res.detailInfo;
        that.setData({
          address: {
            name: res.userName,
            tel: res.telNumber,
            detail
          }
        })
      }
    })
  },
  goOrderDetail(e) {
    if (!this.data.address) {
      wx.showToast({ title: '请选择服务地址', icon: 'none' })
      return
    } 
    const userId = app.globalData.user.id;
    const {
      address: { name: orderUser, tel: userTele, detail: address },
      service: { id: goodsId, goodsTitle: goodsName, goodsPrice, serviceKinds }
    } = this.data;
    const {formId:remarkB}=e.detail;
    util.post('api/order/save', {
      orderUser,
      userId,
      address,
      userTele,
      goodsId,
      goodsName,
      serviceKinds,
      goodsPrice,
      remarkB,
      orderState: 1
    }).then((data) => {
      if (data.orderState == 1) {//预约成功
        wx.redirectTo({
          url: '../order-detail/order-detail?id=' + data.id,
        })
      }
    })

  }
})