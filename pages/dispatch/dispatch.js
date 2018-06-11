// pages/dispatch/dispatch.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPriceModal:false,
    noOrderTip:"没有待分配的订单",
    activeItem:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.init(function(){
    wx.stopPullDownRefresh();
    })  
  },
  init(callback){
    this.getOrder();
    this.getWorker();
    this.getBooks(); 
    if (callback) { callback()}
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  showPriceModal(e){
    const currentOrderId=e.currentTarget.dataset.id;
    let showPriceModal = this.data.showPriceModal;
    showPriceModal = !showPriceModal;
    this.setData({
      currentOrderId,
      showPriceModal
    })
  },
  submitPrice(e){
    const { currentOrderId: id}=this.data;
    const {goodprice:goodsPrice}=e.detail.value;
    util.post("api/order/update", { id, goodsPrice}).then((data) => {
      if (data == 0) {
        wx.showToast({
          title: '改价成功',
          icon: 'none'
        })
        this.setData({
          showPriceModal: false
        })
        this.init();
      }
    })
  },
  changeListBar(e){
    let index = e.target.dataset.item;
    this.setData({
      activeItem: index
    })
  },
  bindPickerChange(e){
    const index=e.detail.value,
      workerId = this.data.workers[index].id;
    const { id: orderId,index:listIndex } = e.currentTarget.dataset;
    const activeItem = this.data.activeItem;
    if (activeItem==0){
      util.get(`api/wx/dispatch/${orderId}/${workerId}`).then((data) => {
        console.log(data)
        wx.showToast({
          title: '派单成功'
        })
        let list = this.data.list;
        list[listIndex].text = '已派单';
        this.setData({
          list
        })
      })
    }else{
      util.get(`api/wx/reserved/dispatch/${orderId}/${workerId}`).then((data) => {
        console.log(data)
        wx.showToast({
          title: '派单成功'
        })
        let books = this.data.books;
        books[listIndex].text = '已派单';
        this.setData({
          books
        })
      })
    }
    
  },
  getBooks(){
    util.get("api/wx/reserve/getAll").then((data) => {
      data.forEach((v, i) => {
        const { name } = util.stateTabel(v.orderState, 1),
          time = util.formatTime(new Date(v.createTime));
        data[i].stateStr = name;
        data[i].time = time;
        data[i].text = "派单";
      })
      this.setData({
        books: data
      })
    })
  },
  getWorker(){
    util.get("api/wx/dispatch/worker").then((data) => {
      console.log(data)
      let array=[];
      data.forEach((v)=>{
        let status="",
          vip="";
        switch (v.userState){
          case "0": status = "空闲"; break;
          case "1": status = "忙碌"; break;
          case "2": status = "下班"; break;
          default: status="下班";
        }
        switch (v.vipFlag) {
          case "0": vip = "普通用户"; break;
          case "1": vip = "VIP用户"; break;
          case "2": vip = "零工"; break;
          case "3": vip = "工长"; break;
          case "4": vip = "金牌师傅"; break;
          case "5": vip = "派单员"; break;
          default: vip = "普通用户";
        }
        const str = [vip,v.userName, status].join(",");
        array.push(str)
      })
      this.setData({
        array,
        workers:data
      })
    })
  },
  getOrder(){
    const {id}=app.globalData.user;
    // const id=5;
    util.get(`api/wx/dispatch/order/${id}`).then((data)=>{
      console.log(data)
      if (typeof data==="string"){
        this.setData({
          list:[],
          noOrderTip: "没有派单权限"
        })
      }else{
        data.forEach((v, i) => {
          const { name } = util.stateTabel(v.orderState, 1),
            time = util.formatTime(new Date(v.createTime));
          data[i].stateStr = name;
          data[i].time = time;
          data[i].text="派单";
        })
        this.setData({
          list: data
        })
      }
    })
  }
})