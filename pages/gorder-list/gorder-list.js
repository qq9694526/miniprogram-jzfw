// pages/gorder-list/gorder-list.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noOrderTip:"没有该类订单",
    activeItem: 0,
    statusTable: ["", "待支付", "待发货", "待收货", "已收货", "退款中", "已退款", "已取消", '已完成']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList();
  },
  onPullDownRefresh() {
    this.getOrderList();
    wx.stopPullDownRefresh()
  },
  changeListBar(e) {
    const index = e.target.dataset.item;
    this.setData({
      activeItem: index
    })
  },
  getOrderList() {
    const { id: userId } = app.globalData.user;
    util.get('api/wx/goods_order/list/' + userId).then((data) => {
      let orderList = [data[1], data[2], data[3], data[4]];
      orderList.forEach((v, i) => {
        if (v.length > 0) {
          v.forEach((n, m) => {
            orderList[i][m].time = util.formatTime(new Date(n.createTime));
          })
        }
      })
      this.setData({
        orderList
      })
    })
  },
  onShareAppMessage: function () {

  }
})