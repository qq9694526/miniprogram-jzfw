// pages/shop-classify/shop-classify.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // menus: [],
    // items: [],
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.get('api/wx/market/category').then((data) => {
      this.setData({ menus: data })
      util.post('/api/wx/market/goods/' + data[0].id).then((data) => {
        this.setData({ items: data })
      })
    })
  },
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  goService(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods-detail/goods-detail?id=' + id
    })
  },
  setCurrentActive(e) {
    const activeIndex = e.currentTarget.dataset.index,
      id = this.data.menus[activeIndex].id;
    util.post('/api/wx/market/goods/' + id).then((data) => {
      console.log(data)
      this.setData({ items: data, activeIndex })
    })

  }
})