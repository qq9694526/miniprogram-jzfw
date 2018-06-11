//app.js
const util = require('utils/util.js');
App({
  onLaunch: function (query) {
    
  },
  globalData: {
    userInfo: null
  },
  getOpneid() {
    return new Promise((resolve) => {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res.code)
          util.get("api/wx/getkey/" + res.code).then((data) => {
            resolve(data);
          })
        }
      })
    })

  },
  getUserInfo(){
    return new Promise((resolve)=>{
      // 获取用户信息
      wx.getSetting({
        success: res => {
          // if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              resolve(res.userInfo)
            }
          })
          // }
        }
      })
    })
    
  },
  save(parentOpenid, callback){
    wx.showLoading({
      title: '加载中'
    })
    const parentOpId = parentOpenid||"";
    Promise.all([this.getOpneid(), this.getUserInfo()]).then(v=>{
      const [{ openid: opId, session_key }, { nickName: userName, gender: userSex, avatarUrl:userPhoto}]=v;
      util.post("api/user_info/save/",{
        opId,
        userName,
        userSex,
        parentOpId,
        userPhoto
      }).then((data) => {
        wx.hideLoading();
        wx.setStorageSync('firstEnter', "no");
        data.sessionKey = session_key;
        this.globalData.user = data;
        if (callback) { callback()}
      })
    })
  },
  onShare(openid,res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title:'家政服务小程序',
      imageUrl: 'https://www.toyourfamily.com/statics/img/share/share_in.jpg?' + Math.random(),
      path: '/pages/index/index?openid=' + openid,
      success: function (res) {
        console.log(openid)
      },
      fail: function (res) {
      }
    }
  }
})