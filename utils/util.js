const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const get = (url, query) => {
  const contentType = query ? "application/x-www-form-urlencoded" : "application/json",
    data = query || {};
  return new Promise((resolve, reject) => {
    wx.request({
      url: "https://www.toyourfamily.com/" + url,
      data,
      header: {
        'content-type': contentType
      },
      success: (res) => {
        const data = res.data;
        if (data.errno == 0) {
          resolve(data.data)
        } else {
          reject({
            errno: data.errno,
            errmsg: data.errmsg
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '网络错误',
        })
        reject(res)
      }
    })
  })
}
const post = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: "https://www.toyourfamily.com/" + url,
      method: "POST",
      data,
      success: (res) => {
        const data = res.data;
        if (data.errno == 0) {
          resolve(data.data)
        } else {
          reject({
            errno: data.errno,
            errmsg: data.errmsg
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '网络错误',
        })
        reject(res)
      }
    })
  })
}
const booksStateTabel = (state) => {
  var result = [];
  switch (state) {
    case "0":
      result = {
        name: "已预约",
        icon: "/img/order/orderdetail-1.png",
        title: "已预约",
        desc: "",
        btn: ""
      }
      break;
    case "1":
      result = {
        name: "已完成",
        icon: "/img/order/orderdetail-1.png",
        title: "已完成",
        desc: "",
        btn: ""
      }
      break;
    case "2":
      result = {
        name: "施工中",
        icon: "/img/order/orderdetail-1.png",
        title: "施工中",
        desc: "",
        btn: "施工结束"
      }
      break;
    default:
      result = {
        name: "已预约",
        icon: "/img/order/orderdetail-1.png",
        title: "已预约",
        desc: "",
        btn: ""
      }
  }
  return result;
}
const goodsStateTabel = (state) => {
  var result = [];
  switch (state) {
    case "1":
      result = {
        name: "待付款",
        icon: "/img/order/orderdetail-1.png",
        title: "待付款",
        desc: "待付款",
        btn: "去支付"
      }
      break;
    case "2":
      result = {
        name: "待发货",
        icon: "/img/order/orderdetail-1.png",
        title: "已付款待发货",
        desc: "已付款待发货",
        btn: ""
      }
      break;
    case "3":
      result = {
        name: "已发货",
        icon: "/img/order/orderdetail-1.png",
        title: "已发货",
        desc: "已发货，等待确认收货",
        btn: "确认收货"
      }
      break;
    case "4":
      result = {
        name: "已收货",
        icon: "/img/order/orderdetail-1.png",
        title: "订单完成",
        desc: "您可对本次服务进行评价",
        btn: "评价"
      }
      break;
    case "7":
      result = {
        name: "已取消",
        icon: "/img/order/orderdetail-2.png",
        title: "订单关闭",
        desc: "",
        btn: ""
      }
      break; 
    default:
      result = {
        name: "已完成",
        icon: "/img/order/orderdetail-2.png",
        title: "订单已完成",
        desc: "",
        btn: "评价"
      }
  }
  return result;
}
const stateTabel = (state, userFlag) => {
  var result = [];
  if (userFlag == 0) {//客户
    switch (state) {
      case "1":
        result = {
          name: "已预约",
          icon: "/img/order/orderdetail-1.png",
          title: "预约成功",
          desc: "正在为您分配服务人员",
          btn: "取消订单"
        }
        break;
      case "2":
        result = {
          name: "已分配",
          icon: "/img/order/orderdetail-1.png",
          title: "分配成功",
          desc: "请等待服务人员与您联系",
          btn: ""
        }
        break;
      case "3":
        result = {
          name: "待付款",
          icon: "/img/order/orderdetail-1.png",
          title: "服务结束",
          desc: "本次服务已完成，请支付",
          btn: "去支付"
        }
        break;
      case "4":
        result = {
          name: "已付款",
          icon: "/img/order/orderdetail-1.png",
          title: "订单完成",
          desc: "您可对本次服务进行评价",
          btn: "评价"
        }
        break;
      case "5":
        result = {
          name: "已完成",
          icon: "/img/order/orderdetail-1.png",
          title: "订单完成",
          desc: "您可对本次服务进行评价",
          btn: "评价"
        }
        break;
      case "6":
        result = {
          name: "已取消",
          icon: "/img/order/orderdetail-2.png",
          title: "订单关闭",
          desc: "",
          btn: ""
        }
        break;
      default:
        result = {
          name: "已预约",
          icon: "/img/order/orderdetail-1.png",
          title: "预约成功",
          desc: "正在为您分配服务人员",
          btn: "取消订单"
        }
    }
  } else {
    switch (state) {
      case "1":
        result = {
          name: "待分配",
          icon: "/img/order/orderdetail-1.png",
          title: "等待分配",
          desc: "正在分配服务人员",
          btn: ""
        }
        break;
      case "2":
        result = {
          name: "待完成",
          icon: "/img/order/orderdetail-1.png",
          title: "正在施工",
          desc: "请尽快与客户联系并完成本次服务",
          btn: "施工结束"
        }
        break;
      case "3":
        result = {
          name: "施工结束",
          icon: "/img/order/orderdetail-1.png",
          title: "施工完成，客户未付款",
          desc: "本次服务已完成，等待客户付款",
          btn: ""
        }
        break;
      case "4":
        result = {
          name: "订单完成",
          icon: "/img/order/orderdetail-1.png",
          title: "施工完成，客户已付款",
          desc: "本次服务已完成",
          btn: ""
        }
        break;
      case "5":
        result = {
          name: "订单完成",
          icon: "/img/order/orderdetail-1.png",
          title: "施工完成，客户已付款",
          desc: "本次服务已完成",
          btn: ""
        }
        break;
      case "6":
        result = {
          name: "已取消",
          icon: "/img/order/orderdetail-2.png",
          title: "订单关闭",
          desc: "",
          btn: ""
        }
        break;
      default:
        result = {
          name: "待分配",
          icon: "/img/order/orderdetail-1.png",
          title: "等待分配",
          desc: "正在分配服务人员",
          btn: ""
        }
    }
  }
  return result;
}
module.exports = {
  formatTime,
  get,
  post,
  goodsStateTabel,
  booksStateTabel,
  stateTabel
}
