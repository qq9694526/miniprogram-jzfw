// pages/user/user.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    vipFlagMap: ["普通用户","VIP用户","零工","工长","金牌师傅","派单员"],
    stateList: ['空闲', '忙碌', '下班'],
    currentState: 0
  },
  onLoad: function (options) {

  },
  onShow() {
    let user = app.globalData.user,
      auditTip = "";
    const { remark2: auditStatus } = user;
    if (auditStatus == 1) {
      auditTip = "审核中";
    } else if (auditStatus == 2) {
      auditTip = "审核通过";
    } else if (auditStatus == 3) {
      auditTip = "审核被拒绝";
    }
    user.tel = user.userMobile.slice(0, 3) + "******" + user.userMobile.slice(7, 11);
    this.setData({
      user,
      auditTip,
      currentState: user.userState||0
    })
    this.getMyCoupon();
    this.getAccount();    
  },
  getAccount() {
    const userId = app.globalData.user.id;
    util.get("api/acount/info", {
      userId
    }).then((data) => {
      console.log(data);
      this.setData({
        account: data
      })
    })
  },
  getMyCoupon(){
    util.get(`api/wx/user/coupon/${this.data.user.id}`).then((data)=>{
      console.log(typeof data);
      this.setData({
        couponCount:data.length
      })
    })
  },
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  goAddress() {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  goAccount() {
    wx.navigateTo({
      url: '../account/account',
    })
  },
  goRecomm() {
    wx.navigateTo({
      url: '../recomm/recomm',
    })
  },
  goAudit() {
    const { remark2: auditStatus } = app.globalData.user;
    console.log(auditStatus)
    if (auditStatus == 1 || auditStatus == 2) { return; }
    wx.navigateTo({
      url: '../audit/audit',
    })
  },
  goDispatch() {
    wx.navigateTo({
      url: '../dispatch/dispatch',
    })
  },
  showActionSheet() {
    const that = this,
      itemList = that.data.stateList;
    wx.showActionSheet({
      itemList,
      success: function (res) {
        const index = res.tapIndex;
        if (index == that.data.currentState) {
          return;
        }
        that.changeState(index);
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  share(){
    wx.showShareMenu();
  },
  changeState(userState) {
    util.post("api/user_info/update", {
      id: this.data.user.id,
      userState
    }).then((data) => {
      this.setData({
        currentState: userState
      })
      app.save();
    })
  }

})