// pages/good-confrim/good-confrim.js
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponIndex: "0",
    address: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { indexs, totle } = options;
    this.getGoods(indexs, totle);
    this.getCoupons();
  },
  getCoupons() {
    const { id: userId } = app.globalData.user;
    util.get("api/wx/user/coupon/" + userId).then((data) => {
      let array = [],
        canuseCoupons = [];
      const nowTime=new Date().getTime();   
      data.forEach((v, i) => {
        const totle = this.data.totle;
        if (nowTime<=v.endTime){//未过期
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
  },
  bindPickerChange(e) {
    const index = e.detail.value,
      chooseCoupon = this.data.canuseCoupons[index];
    console.log(chooseCoupon)
    this.setData({
      couponIndex: index
    })
  },
  getGoods(indexs, totle) {
    const { id: userId } = app.globalData.user;
    util.get("api/market/cart_list", {
      userId
    }).then((data) => {
      let list = [];
      indexs.split(',').forEach((v) => {
        list.push(data[v])
      })
      console.log(list);
      this.setData({
        totle,
        list
      });
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
  submitOrder(e) {
    if (!this.data.address) {
      wx.showToast({ title: '请选择服务地址', icon: 'none' })
      return
    }
    const { id: userId, opId: openId } = app.globalData.user;
    const {
      address: { name: userName, tel: userMobile, detail: saveGoodsAdd },
      list: goodsList
    } = this.data;
    const { formId: remark5 } = e.detail;
    const chooseCoupon = this.data.canuseCoupons[this.data.couponIndex],
      newManCoupon = chooseCoupon ? chooseCoupon.couponId : '';
    util.post('api/wx/goods_order', {
      userName,
      userId,
      saveGoodsAdd,
      userMobile,
      newManCoupon,
      remark5,
      goodsList
    }).then((data) => {
      const { orderSn, orderActulPrice } = data;
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
              wx.showToast({
                title: '取消支付'
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '../gorder-list/gorder-list',
                })
              }, 1000)
            }
          })
        })
      }
      function sucessCallBack() {
        util.get("api/wx/goods_payback/" + orderSn).then((data) => {
          console.log("data")
          console.log(data)
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
    })
  }
})