// pages/book/book.js
const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {
    workers: [{ name: '室内外保洁', active: true }, { name: '家电窗帘清洗', active: false }, { name: '管道疏通', active: false }, { name: '水电安装维修', active: false }, { name: '砸墙', active: false }, { name: '钻孔', active: false }, { name: '批涂墙', active: false }, { name: '地砖墙砖', active: false }, { name: '吊顶隔断', active: false }, { name: '防水施工', active: false }, { name: '钟点工', active: false }, { name: '其他', active: false }]
  },
  onLoad: function (options) {

  },
  changeWorkerType(e) {
    const { index } = e.currentTarget.dataset;
    let workers = this.data.workers;
    workers[index].active = !workers[index].active
    this.setData({
      workers
    })
  },
  saveBook(e) {
    if (!this.data.address) {
      wx.showToast({ title: '请选择服务地址', icon: 'none' })
      return
    }
    wx.showLoading();
    const { id: userId } = app.globalData.user;
    const { textarea: reDesc } = e.detail.value;
    const { name: reName, tel: remarkA, detail: reAddress } = this.data.address;
    let service = [];//预约的服务
    this.data.workers.forEach((v, i) => {
      if (v.active) {
        service.push(v.name)
      }
    })
    const remarkB = service.join(",");
    const formId = e.detail.formId;
    util.post("api/wx/reserve/save", {
      userId,
      reDesc,
      reName,
      reAddress,
      remarkA,
      formId,
      remarkB
    }).then((data) => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../index/index'
        })
      }, 1000)
    })
  },
  onShareAppMessage: function () {

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
})