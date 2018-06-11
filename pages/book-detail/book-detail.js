// pages/book-detail/book-detail.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onLoad: function (options) {
    const { id } = options;
    this.init(id);
  },
  onPullDownRefresh: function () {
  
  },
  compltOrder(){
    const {id}=this.data.order;
    util.post('api/wx/reserved/'+id).then((data)=>{
        wx.showToast({
          title: '成功',
          icon: 'none'
        })
        this.init(id);
    })
  },
  init(id) {
    const userFlag = this.data.userFlag;
    util.post("api/wx/reserved/info/"+id).then((data) => {
      let order = data,
        time = util.formatTime(new Date(data.createTime));
      order.time = time;
      this.setData({
        totle: order.goodsPrice,
        order,
        stateTabel: util.booksStateTabel(data.reState)
      })
    })
  },
})