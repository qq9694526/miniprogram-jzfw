// pages/classify/classify.js
const app=getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // menus:[],
    // items:[],
    activeIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.get('api/wx/allkind').then((data)=>{
      this.setData({menus: data })
      util.get('/api/wx/pro/' + data[0].id).then((data) => {
        this.setData({ items: data })
      })
    })
  },
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  goService(e){
    const id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../service/service?id=' + id
    })
  },
  setCurrentActive(e){
    const activeIndex = e.currentTarget.dataset.index,
      id = this.data.menus[activeIndex].id;
    util.get('/api/wx/pro/' + id).then((data) => {
      console.log(data)
      this.setData({ items: data, activeIndex })
    })

  }
})