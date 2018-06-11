// pages/audit/audit.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PlaceHolderImages: ['/img/audit-1.png', '/img/audit-2.png', '/img/audit-3.png'],
    workers: ['保洁', '家电清洗', '水工', '电工', '泥工', '木工', '焊工', '裱糊工', '批涂工', '砸墙钻孔', '其他'],
    activeIndex: 0,
    readOnly: false,
    audit: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAudit()
  },
  changeWorkerType(e) {
    if (this.data.readOnly) { return; }
    const { index } = e.currentTarget.dataset;
    this.setData({
      activeIndex: index
    })
  },
  getAudit() {
    const { id } = app.globalData.user;
    util.get('api/user_certi/info/' + id).then((data) => {
      console.log(data)
      if (!data) { return; }
      let workers = this.data.workers,
        len = workers.length,
        activeIndex = 0,
        readOnly = false;
      for (let i = 0; i < len; i++) {
        if (data.remark2 == workers[i]) {
          activeIndex = i;
        }
      }
      // data.handelResult=0;
      //0 通过 1 驳回 2 待审核
      if (data.handelResult == 0 || data.handelResult == 2) { readOnly = true };
      this.setData({
        activeIndex,
        readOnly,
        audit: data
      })
    })
  },
  chooseImage(e) {
    if (this.data.readOnly) { return; }
    let that = this;
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '上传中'
        })
        wx.uploadFile({
          url: 'https://www.toyourfamily.com/api/user_certi/upload ', //开发者服务器 url
          filePath: res.tempFilePaths[0],//要上传文件资源的路径
          name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
          formData: { //HTTP 请求中其他额外的 form data
            'user': 'test'
          },
          header: { "Content-Type": "multipart/form-data" },
          success: function (res) {
            const data = JSON.parse(res.data);
            console.log(data)
            if (data.errno != 0) {
              wx.hideLoading();
              wx.showToast({
                title: '上传失败',
                icon: 'none'
              })
              return;
            }
            const { url } = data.data,
              { index } = e.currentTarget.dataset;
            // let temPlaceHolderImages = that.data.PlaceHolderImages;
            let audit = that.data.audit;
            // temPlaceHolderImages[index]=url;
            if (index == 0) {
              audit.idCardAddress1 = url
            } else if (index == 1) {
              audit.idCardAddress2 = url;
            } else if (index == 2) {
              audit.qualifyCertificate = url;
            }
            that.setData({
              audit
            })
            wx.hideLoading();
          },
          fail: function (e) {
            console.log(e)
          }
        })
      }
    })
  },
  save(e) {
    let imageArr = this.data.PlaceHolderImages,
      { userName, userMobile, cardnum: remark1 } = e.detail.value,
      { id: userId } = app.globalData.user,
      { id, idCardAddress1, idCardAddress2, qualifyCertificate } = this.data.audit;
    if (!userName || !remark1) {
      wx.showToast({
        title: '缺少身份信息，请完善后重试',
        icon: 'none'
      })
      return;
    }
    if (idCardAddress1 == imageArr[0] || idCardAddress2 == imageArr[1]) {
      wx.showToast({
        title: '缺少身份证图片，请完善后重试',
        icon: 'none'
      })
      return;
    }
    if (qualifyCertificate == imageArr[2]) {
      qualifyCertificate = "";
    }
    const remark2 = this.data.workers[this.data.activeIndex];
    util.post('api/user_certi/save', {
      id,
      userId,
      remark1,//身份证
      userName,
      userMobile,
      remark2,//工种
      idCardAddress1,
      idCardAddress2,
      qualifyCertificate
    }).then((data) => {
      app.save("", function () {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
      });//更新用户信息
      setTimeout(() => {
        wx.switchTab({
          url: '../user/user',
        })
      }, 1000)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})