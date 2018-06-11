// pages/gorder-detail/gorder-detail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPriceModal: false,
    showCommentModal: false,
    id: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { orderSn } = options;
    this.getOrder(orderSn);
  },
  onPullDownRefresh() {
    this.getOrder();
    wx.stopPullDownRefresh();
  },
  getOrder(orderSn) {
    const orderSn1 = orderSn || this.data.order.orderSn;
    util.get('api/wx/goods_order/info/' + orderSn1).then((data) => {
      console.log(data)
      const stateTabel = util.goodsStateTabel(data.orderStatus);
      let order = data;
      order.time = util.formatTime(new Date(data.createTime));
      const comment = order.remark3 || "",
        starArr = comment.split(",");
      this.setData({
        id: order.id,
        order,
        starArr,
        stateTabel
      })
    })
  },
  showCommentModal() {
    this.setData({
      showCommentModal: true
    })
  },
  hideCommentModal() {
    this.setData({
      showCommentModal: false
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const { slider0, slider1, slider2 } = e.detail.value,
      id = this.data.id,
      remark3 = `${slider0},${slider1},${slider2}`;
    console.log(remark3);
    util.post("api/wx/goods_order/evaluate", {
      id,
      remark3
    }).then((data) => {
      console.log(data);
      if (data == 0) {
        wx.showToast({
          title: '评价成功',
          icon: 'none'
        })
        this.hideCommentModal();
        this.getOrder();
      }
    })
  },
  confrimGet() {
    const id = this.data.id;
    util.get('api/wx/goods_order/confirm/' + id).then((data) => {
      wx.showToast({
        title: '确认成功',
        icon: "none"
      })
      this.getOrder();
    })
  },
  onShareAppMessage: function () {

  },
  goPay() {
    const { orderSn, orderActulPrice } = this.data.order,
      { opId: openId } = app.globalData.user;
    if (orderActulPrice == 0) {
      sucessCallBack();
    } else {
      util.post('api/wx/goods_order/sign', {
        orderSn,
        openId
      }).then((data) => {
        const { nonceStr, package: packages, paySign, signType, timeStamp } = data;
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': packages,
          'signType': signType,
          'paySign': paySign,
          'success': function (res) {
            sucessCallBack();
          },
          'fail': function (res) {
          }
        })
      })
    }
    function sucessCallBack() {
      util.get("api/wx/goods_payback/" + orderSn).then((data) => {
        wx.showToast({
          title: '支付成功'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '../gorder-detail/gorder-detail?orderSn=' + orderSn,
          })
        }, 1000)
      })
    }
  },
  cancelOrder() {
    const id = this.data.order.id;
    console.log(id);
    wx.showModal({
      title: '取消订单',
      content: '您确定要取消该订单吗',
      success: function (res) {
        if (res.confirm) {
          util.get("api/wx/goods_order/cancel/" + id).then((data) => {
            if (data == 0) {
              wx.showToast({
                title: '取消成功',
                icon: 'none'
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: "../gorder-list/gorder-list"
                })
              }, 1000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})