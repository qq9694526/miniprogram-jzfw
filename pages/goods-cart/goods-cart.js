// pages/goods-cart/goods-cart.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  data: {
    noOrderTip:"购物车是空的",
    isCheckedAll: true,
    totle: 0,
    delBtnWidth: 180
  },

  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数

    this.initEleWidth();

    this.tempData();

  },

  onReady: function () {

    // 页面渲染完成

  },

  onShow: function () {

    // 页面显示

  },

  onHide: function () {

    // 页面隐藏

  },

  onUnload: function () {

    // 页面关闭

  },
  goOrderConfirm() {
    const list = this.data.list;
    let indexArr = [];
    list.forEach((v, i) => {
      if (v.checked) {
        indexArr.push(i)
      }
    })
    if (indexArr.length <= 0) {
      wx.showToast({
        title: '未选择任何商品',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: '../goods-confrim/goods-confrim?indexs=' + indexArr.join(',') + '&totle=' + this.data.totle,
    })
  },
  updateTotle() {
    const list = this.data.list;
    let totle = 0;
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].checked) {
        totle += list[i].goodsRealPrice * list[i].goodsNum
      }
    }
    this.setData({
      totle
    })
  },
  updateCheckedAll() {
    let isCheckedAll = true;
    const list = this.data.list;
    for (let i = 0, len = list.length; i < len; i++) {
      if (!list[i].checked) { isCheckedAll = false; break; }
    }
    if (list.length===0){
      isCheckedAll=false;
    }
    this.setData({
      isCheckedAll
    })
  },
  checked(e) {
    const index = e.currentTarget.dataset.itemIndex;
    let list = this.data.list;
    list[index].checked = !list[index].checked;
    this.setData({
      list
    })
    this.updateCheckedAll();
    this.updateTotle();
  },
  checkedAll() {
    console.log(this.data)
    let list = [],
      isCheckedAll = !this.data.isCheckedAll;
    this.data.list.forEach((v) => {
      v.checked = isCheckedAll;
      list.push(v);
    })
    this.setData({
      list
    })
    this.updateCheckedAll();
    this.updateTotle();
  },
  touchS: function (e) {

    if (e.touches.length == 1) {

      this.setData({

        //设置触摸起始点水平方向位置

        startX: e.touches[0].clientX

      });

    }

  },

  touchM: function (e) {

    if (e.touches.length == 1) {

      //手指移动时水平方向位置

      var moveX = e.touches[0].clientX;

      //手指起始点位置与移动期间的差值

      var disX = this.data.startX - moveX;

      var delBtnWidth = this.data.delBtnWidth;

      var txtStyle = "";

      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变

        txtStyle = "left:0px";

      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离

        txtStyle = "left:-" + disX + "px";

        if (disX >= delBtnWidth) {

          //控制手指移动距离最大值为删除按钮的宽度

          txtStyle = "left:-" + delBtnWidth + "px";

        }

      }

      //获取手指触摸的是哪一项

      var index = e.currentTarget.dataset.index;

      var list = this.data.list;

      list[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({

        list: list

      });
      this.updateCheckedAll();
      this.updateTotle();

    }

  },
  touchE: function (e) {

    if (e.changedTouches.length == 1) {

      //手指移动结束后水平位置

      var endX = e.changedTouches[0].clientX;

      //触摸开始与结束，手指移动的距离

      var disX = this.data.startX - endX;

      var delBtnWidth = this.data.delBtnWidth;

      //如果距离小于删除按钮的1/2，不显示删除按钮

      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";

      //获取手指触摸的是哪一项

      var index = e.currentTarget.dataset.index;

      var list = this.data.list;

      list[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({

        list: list

      });
      this.updateCheckedAll();
      this.updateTotle();

    }

  },

  //获取元素自适应后的实际宽度

  getEleWidth: function (w) {

    var real = 0;

    try {

      var res = wx.getSystemInfoSync().windowWidth;

      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应

      // console.log(scale);

      real = Math.floor(res / scale);

      return real;

    } catch (e) {

      return false;

      // Do something when catch error

    }

  },

  initEleWidth: function () {

    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);

    this.setData({

      delBtnWidth: delBtnWidth

    });

  },

  //点击删除按钮事件

  delItem: function (e) {
    //获取列表中要删除项的下标
    var index = e.currentTarget.dataset.index;
    this.del(index)
  },
  del(index) {
    const that=this;
    wx.showModal({
      title: '移除购物车',
      content: '您确定要将该商品移除购物车吗',
      success: function (res) {
        if (res.confirm) {
          let list = that.data.list;          
          const { id: cartIds } = list[index];
          util.get("api/market/cart_del", {
            cartIds
          }).then((data) => {
            console.log(data);
            list.splice(index, 1);
            that.setData({
              list: list
            });
            that.updateCheckedAll();
            that.updateTotle();
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  updateNum(e) {
    const { itemIndex: index, step } = e.target.dataset;
    let list = this.data.list,
      { id, goodsNum } = list[index],
      setNum = parseInt(goodsNum) + parseInt(step);
    console.log(index);
    if (setNum <= 0) {
      this.del(index);
      return;
    };
    util.post("api/market/cart_update", {
      id,
      goodsNum: setNum
    }).then((data) => {
      list[index].goodsNum = setNum;
      if (setNum == 0) { list[index].checked = false };
      this.setData({
        list
      })
      this.updateCheckedAll();
      this.updateTotle();
    })
  },
  //测试临时数据

  tempData: function () {
    const { id: userId } = app.globalData.user;
    util.get("api/market/cart_list", {
      userId
    }).then((data) => {
      console.log(data);
      let list = data;
      list.forEach((v, i) => {
        list[i].checked = true;
      })
      this.setData({
        list
      });
      this.updateCheckedAll();
      this.updateTotle();
    })

  }



})