//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    noOrderTip: "您还没有订单",
    showGetTelModal:false,
    userFlag:0
  },
  onLoad: function (options) {
    console.log(options)
    let parentOpId="";
    if (options){
      if (options.openid){
        parentOpId = options.openid
      } else if (options.scene){
        parentOpId = decodeURIComponent(options.scene);
      }
      if (options.service){
        wx.navigateTo({
          url: '../order-detail/order-detail?id=' + options.service,
        })
      } else if (options.book){
        wx.navigateTo({
          url: '../book-detail/book-detail?id=' + options.book,
        })
      } else if (options.good){
        wx.navigateTo({
          url: '../gorder-detail/gorder-detail?orderSn=' + options.good,
        })
      }
    }
    const that=this;
    app.save(parentOpId, that.init);
  }, 
  onShareAppMessage: function (res) {
    const openid = app.globalData.user.opId;
    return app.onShare(openid, res);
  },
  onPullDownRefresh(){
    this.init()
    wx.stopPullDownRefresh()
  },
  init(){
    const { id, userFlag, userMobile}=app.globalData.user;
    //获取手机号
    // if (!userMobile){
    //   this.setData({showGetTelModal:true});
    // }
    util.get("api/wx/index").then((data) => {
      let { banner, goods, contnets, marketGoods}=data;
      contnets.forEach((v,i)=>{
        contnets[i].time = util.formatTime(new Date(v.createTime));
      })
      this.setData({ banner, goods, contnets, marketGoods });
    })
    if (userFlag==1){
      util.post('api/order/all', {
        userFlag,
        id
      }).then((data) => {
        let list = [];
        data.forEach((v, i) => {
          if (new Date().getTime() - v.createTime > 1296000000) {
            return;
          }
          const { name } = util.stateTabel(v.orderState),
            time=util.formatTime(new Date(v.createTime));
          v.stateStr = name;
          v.time = time;
          list.push(v);
        })
        this.setData({ list, userFlag: 1 });
      })
    }
  },
  chooseAdd(){
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  goActivity(e){
    const id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../activity/activity?id='+id,
    })
  },
  getPhoneNumber(e){
    const { iv, encryptedData: decryptData } = e.detail;
    const { id, sessionKey } = app.globalData.user;
    util.post("/api/user_info/update", {
      id,
      sessionKey,
      iv,
      decryptData
    }).then((data) => {
      this.setData({showGetTelModal:false});
      app.save();//更新globalData中存储的个人信息
    })
  }
})
