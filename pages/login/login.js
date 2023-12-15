//index.js
//获取应用实例
const app = getApp()
let username = ''
let password = ''
let server = 'https://fxbg.xksztech.com:8445'
// let server = 'https://localhost:8445'
var log = require('../../utils/log.js');

Page({
  data: {
    username: '',
    password: '',
    clientHeight: '',
    open: false,//默认不显示密码
    focus:false,//是否获取焦点
  },
  onLoad() {
    wx.hideTabBar();
    // if (wx.getStorageSync('username') != null && wx.getStorageSync('username') != '') {
    //   wx.switchTab({
    //     url: '/pages/mode/mode',
    //   })
    // }
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.windowHeight)
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    })
  },

  //获取输入款内容
  username(e) {
    username = e.detail.value
  },
  password(e) {
    password = e.detail.value
  },
  //登录事件
  login() {  
    let flag = false //表示账户是否存在,false为初始值
    if (username == '') {
      wx.showToast({
        icon: 'none',
        title: '账号不能为空',
      })
    };
    if (password == '') {
      wx.showToast({
        icon: 'none',
        title: '密码不能为空',
      })
    };
    wx.request({
      url: server + '/mcgpt/user/login',
      method: "get",
      data: {
        "username": username,
        "password": password
      },
      success: ({
        data
      }) => {
          // 处理请求中的错误  
          wx.showToast({
            icon: 'none',
            title: '123',
            duration: 2500
          }) 
        console.log(data);
        if (data.code === 200) {
          // wx.showToast({
          //   icon: 'none',
          //   title: '登陆成功',
          //   duration: 2500
          // })
          wx.setStorageSync("username", username)
          wx.setStorageSync('expireTime', Date.now() + 60 * 60 * 24 * 1000);
          wx.setStorageSync('key', data.message)
          console.log("到期时间" + wx.getStorageSync('expireTime'))
          wx.redirectTo({
            url: '/pages/model/model',
          })
        } else {
          log.error( data.message);
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


  switch() {
    this.setData({
      open: !this.data.open
    })
  },
  focus(){
    this.setData({
      focus:true
    })
  },
  blur(){
    this.setData({
      focus:false
    })
  }
})