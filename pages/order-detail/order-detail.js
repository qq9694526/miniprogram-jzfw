// pages/order-detail/order-detial.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPriceModal: false,
    showCommentModal: false,
    couponIndex: "0",
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, orderReceiving } = options;
    console.log(orderReceiving)
    const userFlag = orderReceiving == 1 ? 1 : 0;
    this.setData({ id, userFlag })
    this.init(id)
  },
  onPullDownRefresh() {
    const id = this.data.id;
    this.init(id);
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  init(id) {
    // const { userFlag } = app.globalData.user;

    const userFlag = this.data.userFlag;
    util.get("api/order/detail", {
      id
    }).then((data) => {
      let order = data,
        time = util.formatTime(new Date(data.createTime));
      order.time = time;
      const comment = order.comment || "",
        starArr = comment.split(",");
      this.setData({
        totle: order.goodsPrice,
        order,
        starArr,
        stateTabel: util.stateTabel(data.orderState, userFlag)
      })
      this.getCoupons();
    })
  },
  cancelOrder() {
    const id = this.data.order.id;
    wx.showModal({
      title: '取消订单',
      content: '您确定要取消该订单吗',
      success: function (res) {
        if (res.confirm) {
          util.post("api/order/update", {
            id,
            orderState: 6
          }).then((data) => {
            if (data == 0) {
              wx.showToast({
                title: '取消成功',
                icon: 'none'
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: "../order/order"
                })
              }, 1000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showPriceModal(e) {
    let showPriceModal = this.data.showPriceModal;
    showPriceModal = !showPriceModal;
    this.setData({
      onlyChangePrice: true,
      showPriceModal
    })
  },
  compltOrder() {
    // const { serviceKinds } = this.data.order;
    // if (serviceKinds == 0) {
    //   this.setData({
    //     onlyChangePrice: false,
    //     showPriceModal: true
    //   })
    // } else {
    //   this.changeStateOver()
    // }
    this.changeStateOver()
  },
  showTip(){
    wx.showToast({
      title: '请先设置价格',
      icon:"none"
    })
  },
  changePrice(e) {
    const { id } = this.data.order;
    const { goodprice: goodsPrice } = e.detail.value;
    util.post("api/order/update", { id, goodsPrice }).then((data) => {
      if (data == 0) {
        wx.showToast({
          title: '成功',
          icon: 'none'
        })
        this.setData({
          showPriceModal: false
        })
        this.init(id);
      }
    })
  },
  changeStateOver(e) {
    const { id } = this.data.order;
    let data = {
      id,
      orderState: 3
    }
    if (e) {
      data.goodsPrice = e.detail.value.goodprice;
    }
    util.post("api/order/update", data).then((data) => {
      if (data == 0) {
        wx.showToast({
          title: '成功',
          icon: 'none'
        })
        this.setData({
          showPriceModal: false
        })
        this.init(id);
      }
    })
  },
  priceBlur(e) {
    if (e.detail.value) {
      this.setData({
        goodsPrice: e.detail.value
      })
    }
  },
  goPay() {
    const openId = app.globalData.user.opId,
      orderId = this.data.order.remarkA,
      id = this.data.id,
      that = this;
    const chooseCoupon = this.data.canuseCoupons[this.data.couponIndex] || {};
    const realPrice = this.data.totle - (chooseCoupon.couponMoney || 0);
    console.log(realPrice)
    let newManCoupon = "", lastCoupon = "";
    console.log(chooseCoupon)
    if (chooseCoupon) {
      if (chooseCoupon.sendType == 2) {//新人券
        newManCoupon = chooseCoupon.couponId
      } else {
        lastCoupon = chooseCoupon.couponId
      }
    }
    if (realPrice == 0) {
      sucessCallback();
    } else {//微信支付
      util.post("api/wx/getSign", { openId, orderId, newManCoupon, lastCoupon }).then((data) => {
        const { nonceStr, package: packages, paySign, signType, timeStamp } = data;
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': packages,
          'signType': signType,
          'paySign': paySign,
          'success': function (res) {
            sucessCallback();
          }
        })
      })
    }
    function sucessCallback() {
      util.get("api/order/pay_back", {
        orderId: id
      }).then((data) => {
        console.log("data")
        console.log(data)
        wx.showToast({
          title: '支付成功'
        })
        that.init(id);
      })
    }
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
      comment = `${slider0},${slider1},${slider2}`;
    console.log(comment);
    util.post("api/order/update", {
      id,
      comment
    }).then((data) => {
      console.log(data);
      if (data == 0) {
        wx.showToast({
          title: '评价成功',
          icon: 'none'
        })
        this.hideCommentModal();
        this.init(id)
      }
    })
  },
  bindPickerChange(e) {
    const index = e.detail.value,
      chooseCoupon = this.data.canuseCoupons[index];
    console.log(chooseCoupon)
    this.setData({
      couponIndex: index
    })
  },
  getCoupons() {
    const { id: userId } = app.globalData.user;
    const totle = this.data.order.goodsPrice;
    util.get("api/wx/user/coupon/" + userId).then((data) => {
      let array = [],
        canuseCoupons = [];
      const nowTime = new Date().getTime();
      data.forEach((v, i) => {
        if (nowTime <= v.endTime) {//未过期
          if (v.sendType == 2) {//新人券
            const num = v.couponMoney;
            if (parseFloat(totle) >= parseFloat(num)) {
              array.push(v.couponName);
              canuseCoupons.push(v)
            }
          } else {//满减券
            const num = v.remarkC;
            if (parseFloat(totle) >= parseFloat(num)) {
              //满减判断金额是否符合要求
              array.push(v.couponName);
              canuseCoupons.push(v)
            }
          }
        }
      })
      this.setData({
        array,
        canuseCoupons
      })
    })
  }
})