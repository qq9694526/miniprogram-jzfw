// pages/order/order.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeItem: 0,
    noOrderTip: "您还没有订单",
    userFlag: 0 //0展示用户订单1展示零工订单
  },
  onLoad: function (options) {
    const { orderReceiving } = options;
    const userFlag = orderReceiving == 1 ? 1 : 0;
    this.setData({
      userFlag
    })
  },
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  onShow() {
    this.init()
  },
  onPullDownRefresh() {
    this.init(() => {
      wx.stopPullDownRefresh()
    })
  },
  showPriceModal(e) {
    const currentOrderId = e.currentTarget.dataset.id;
    let showPriceModal = this.data.showPriceModal;
    showPriceModal = !showPriceModal;
    this.setData({
      currentOrderId,
      showPriceModal
    })
  },
  submitPrice(e) {
    const { currentOrderId: id } = this.data;
    const { goodprice: goodsPrice } = e.detail.value;
    util.post("api/order/update", { id, goodsPrice }).then((data) => {
      if (data == 0) {
        wx.showToast({
          title: '改价成功',
          icon: 'none'
        })
        this.setData({
          showPriceModal: false
        })
        this.init()
      }
    })
  },
  getBooks() {
    const { id } = app.globalData.user;
    return new Promise((resolve) => {
      util.post("api/wx/reserved/worker/" + id).then((data) => {
        data.forEach((v, i) => {
          const { name } = util.booksStateTabel(v.reState),
            time = util.formatTime(new Date(v.createTime));
          data[i].stateStr = name;
          data[i].time = time;
        })
        resolve(data);
      })
    })


  },
  getService() {
    const { id } = app.globalData.user;
    const userFlag = this.data.userFlag;
    return new Promise((resolve) => {
      util.post('api/order/all', {
        userFlag,
        id
      }).then((data) => {
        let list = [];
        data.forEach((v, i) => {
          if (new Date().getTime() - v.createTime > 1296000000) {
            return;
          }
          const { name } = util.stateTabel(v.orderState, userFlag),
            time = util.formatTime(new Date(v.createTime));
          v.stateStr = name;
          v.time = time;
          list.push(v);
        })
        resolve(list);
      })
    })
  },
  changeListBar(e) {
    let index = e.target.dataset.item;
    this.setData({
      activeItem: index
    })
  },
  init(callback) {
    Promise.all([this.getService(), this.getBooks()]).then((data) => {
      console.log(data);
      this.setData({
        list:data
      })
      if (callback) { callback() }
    })
  }
})