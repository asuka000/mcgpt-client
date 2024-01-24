// pages/history/history.js
let server = 'https://fxbg.xksztech.com:8445'
// let server = 'https://localhost:8445'
let startDate = ''
let endDate = ''
var msgList = [];

// 在页面的js文件中添加日期选择器的处理函数  
Page({
  data: {
    date: new Date().getDate(),
    scrollHeight: '100vh',
  },

  onLoad: function (options) {
    this.setData({
      humanHeadIcon: "/images/human.png",
      robotHeadIcon: "/images/robot.png",
      startDate: "",
      endDate: ""
    });
  },


  onShow: function () {
    if (wx.getStorageSync('expireTime') == null || wx.getStorageSync('expireTime') < Date.now()) {
      wx.removeStorageSync('expireTime')
      let username = wx.getStorageSync('username')
      wx.removeStorageSync('username')
      wx.request({
        url: server + '/mcgpt/user/logout',
        method: "get",
        data: {
          "username": username,
        },
        success: ({
          data
        }) => {
          wx.showToast({
            icon: 'none',
            title: '身份验证到期，请重新登录',
            duration: 2500
          })
        }
      })
    }
    wx.request({
      url: server + '/mcgpt/user/checkUserKey',
      method: "get",
      data: {
        "username": wx.getStorageSync('username'),
        "key": wx.getStorageSync('key')
      },
      success: ({
        data
      }) => {
        if (data.code === 500) {
          wx.showToast({
            icon: 'none',
            title: data.message,
            duration: 2500
          })
          wx.removeStorageSync('username')
          wx.removeStorageSync('key')
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      }
    })
    if (wx.getStorageSync('username') == null || wx.getStorageSync('username') === '') {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },


  bindChangeStart(options) {
    this.setData({
      startDate: options.detail.value
    })
  },

  bindChangeEnd(options) {
    this.setData({
      endDate: options.detail.value
    })
  },

  searchClick: function () {
    console.log("startDate:"+this.data.startDate)
    if (this.data.startDate == "") {
      wx.showToast({
        icon: 'none',
        title: "请选择开始时间",
        duration: 2000
      })
      return;
    }
    console.log("endDate:"+this.data.endDate)
    if (this.data.endDate == "") {
      wx.showToast({
        icon: 'none',
        title: "请选择结束时间",
        duration: 2000
      })
      return;
    };
    if (wx.getStorageSync('username') == null || wx.getStorageSync('username') === '') {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
    wx.request({
      url: server + '/mcgpt/userlog/history',
      method: "get",
      data: {
        "username": wx.getStorageSync('username'),
        "startDate": this.data.startDate,
        "endDate": this.data.endDate
      },
      success: ({
        data
      }) => {
        console.log(data.code);
        if (data.code === 200) {
          let dt = JSON.parse(data.message)
          //console.log(dt)
          if (dt.length == 0) {
            wx.showToast({
              icon: 'none',
              title: "未查询到历史记录",
              duration: 2500
            })
            return;
          }
          for (let i = 0; i < dt.length; i++) {  
            let item = dt[i];  
            msgList.push({
              speaker: 'customer',
              contentType: 'text',
              content: item.question
            });
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: item.answer
            })
          }
          this.setData({
            msgList
          });
          console.log(msgList)
        } else {
          wx.showToast({
            icon: 'none',
            title: data.message,
            duration: 2500
          })
        }
      },
      catch: (error) => {
        // 处理请求中的错误  
        wx.showToast({
          icon: 'none',
          title: error,
          duration: 2500
        })
      }
    });
  }
})