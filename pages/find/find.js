// pages/find/find.js

var imp = require("../../utils/util.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {

    inputContext:"",//input输入框的内容,
    addressList:[],//请求后的对象数组
    comList: [],
    selectContext: { com: "点我选择快递公司！",no:""}//请求后的快递公司
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var temp = this;

    wx.request({
      url: imp.comUrl,
      data: {
        key:imp.appId
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        temp.setData({
          comList:res.data.result
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  scanning:function(){
    //调起手机端扫描
    var temp = this;

    wx.scanCode({
      onlyFromCamera: true,
      success: function(res) {
        //成功扫描
        temp.setData({
          inputContext:res.result
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  selectChange:function(res){
    let temp = this;
    let index = res.detail.value;
    this.setData({
      selectContext: temp.data.comList[index]
    })

  },
  inputComplete:function(res){
    //输入完成触发

    this.setData({

      inputContext: res.detail.value

    })
  },

  find:function(res){
    //快递单号发送请求数据
    var temp = this;

    if (temp.data.addressList == "" || temp.data.selectContext.no == "") {
      //地址为空 提示错误信息
      wx.showToast({
        title: '请填写完整!',
        image:"../../img/expore.png"
      })

      return;
    }

    wx.showLoading({
      title: '正在加载'
    })

   

    //请求数据
    wx.request({
      url: imp.getUrl,
      data: {
        com: temp.data.selectContext.no,
        no: temp.data.inputContext,
        key: imp.appId
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);

        if (res.data.resultcode != "200") {
          //请求失败，单号有误或者其他
          temp.setData({
            addressList: [{ datetime: "暂无查询数据", remark:"请检查输入单号及快递公司是否正确！"}]
          })

          return;
        }
        
        let array = res.data.result.list.reverse();
        temp.setData({
          addressList: array
        })

      },
      fail: function(res) {

      },
      complete: function(res) {

        wx.hideLoading();

      },
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})