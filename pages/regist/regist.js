const app = getApp()
let server = 'https://fxbg.xksztech.com:8445'
//  let server = 'https://localhost:8445'

let username = "";
let password = "";
let realname = "";
let secretkey = "";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
    realname: "",
    secretkey: ""
  },

  // onLoad() {   
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       // console.log(res.windowHeight)
  //       this.setData({
  //         clientHeight: res.windowHeight
  //       });
  //     }
  //   })
  // },

  username(e) {
    this.setData ({
      username: e.detail.value
    })
  },
  password(e) {
    this.setData ({
      password: e.detail.value
    })
  },
  realname(e) {
    this.setData ({
      realname: e.detail.value
    })
  },
  secretkey(e) {
    this.setData ({
      secretkey: e.detail.value
    })
  },


  //注册事件
  regist() {
    if (this.data.username == '') {
      wx.showToast({
        icon: 'none',
        title: '账号不能为空',
        duration: 2000,
      })
      return;
    };
    if (this.data.password == '') {
      wx.showToast({
        icon: 'none',
        title: '密码不能为空',
        duration: 2000,
      })
      return;
    };
    if (this.data.password.length < 6) {
      wx.showToast({
        icon: 'none',
        title: '密码不能小于6位',
        duration: 2000,
      })
      return;
    };
    if (this.data.realname == '') {
      wx.showToast({
        icon: 'none',
        title: '姓名不能为空',
        duration: 2000,
      })
      return;
    };
    if (this.data.secretkey !== 'xksz') {
      wx.showToast({
        icon: 'none',
        title: '口令不正确',
        duration: 2000,
      })
      return;
    };
    wx.request({
      url: server + '/mcgpt/user/regist',
      method: "get",
      data: {
        "username": this.data.username,
        "password": this.data.password,
        "realname": this.data.realname
      },
      success: ({
        data
      }) => {
        console.log(data.code);
        if (data.code === 200) {
          wx.showModal({
            title: data.message,
            content: '快去登录开始一次愉快的聊天吧！',
            success(res) {
              if (res.confirm) {
                // 点击确定按钮  
                wx.redirectTo({
                  url: '/pages/login/login'
                });
              } else if (res.cancel) {
                // 点击取消按钮  
              }
            }
          });
          wx.setStorageSync("username", username)
          wx.setStorageSync('expireTime', Date.now() + 60 * 60 * 24 * 1000);
          wx.setStorageSync('key', data.message)
          console.log("到期时间" + wx.getStorageSync('expireTime'))
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
    })
  },
})