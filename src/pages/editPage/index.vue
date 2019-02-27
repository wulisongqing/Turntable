<template>
  <div class="container">
    <div class="modules_box modules_question_box">
      <div class="modules_icon_box">
        <image class="modules_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_edit_question_60.png"></image>
      </div>
      <div class="modules_input_box">
        <input @input="checkQuestion" class="modules_input" maxlength="21" placeholder="小决定名称 | 限21位中英文数字？" placeholderStyle="color:#cfcfcf;" type="text" :value="option"></input>
      </div>
   </div>

   <div class="modules_box modules_answer_box" v-for="(item, index) in input_answer_list" :key="item">
      <div @click="subAnswer" class="modules_icon_box" :data-index="index">
        <image class="modules_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_edit_sub_60.png"></image>
      </div>
      <div class="modules_input_box">
        <input @input="checkAnswer" class="modules_input" :data-index="index" maxlength="13" placeholder="小决定选项 | 限13位中英文数字" placeholderStyle="color:#cfcfcf" type="text" :value="item.name"></input>
      </div>
   </div>

   <div @click="addAnswer" class="modules_box modules_add_box">
      <div class="modules_icon_box">
        <image class="modules_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_edit_add_60.png"></image>
      </div>
      <div class="modules_word_box">
        <div class="modules_word">增加选项</div>
      </div>
   </div>

   <div @click="saveQA" class="modules_box modules_save_box">
      <div class="modules_icon_box">保存</div>
   </div>
  </div>
</template>

<script>

import Vue from 'vue'
var util = require('../../utils/util.js')
export default {
  data () {
    return {
        params: {}, // 初始化参数
        option: '', // 转盘名称
        input_answer_list: [], // 转盘选项数据
        default_input_answer_list: {},
        flg: 0, // 1--热门小决定；2--个人小决定
        colorArr: [//增加选项的默认颜色排序
            '#EE534F',
            '#FF7F50',
            '#FFC928',
            '#66BB6A',
            '#42A5F6',
            '#FF7F50',
            '#AA47BC',
            '#EC407A',
            '#DA70D6',
            '#FFA827',
            '#AA47BC',
            '#EE534F',
            '#42A5F6',
            '#66BB6A',
            '#FFC928',
            '#42A5F6',
            '#5C6BC0',
        ]
    }
  },

  methods: {
    // 删除转盘选项
    subAnswer(e) {
      var that = this, index = e.mp.currentTarget.dataset.index, colorArr = that.colorArr;
      for (let i = 0; i < that.input_answer_list.length; i++) {
        // const i = input_answer_list[i]; 
        if (index == i) {
          that.input_answer_list.splice(i, 1)
        }
      }
      for (let m in that.input_answer_list){
         that.input_answer_list[m].color = colorArr[m];
      }
      that.default_input_answer_list.awards = that.input_answer_list;
    },
    // 增加转盘选项
    addAnswer() {
      var that = this, len = that.input_answer_list.length, colorLen = that.colorArr.length;
      if (len > 17) {
        wx.showToast({
          title: '决定名称长度最大为13',
          icon:'none',
          mask:false
        })
        return;
      }
      that.input_answer_list.push({
        color: that.colorArr[len % colorLen],
        name: '',
      })
      that.default_input_answer_list.awards = that.input_answer_list;
    },
    // 编辑转盘选项
    checkAnswer(e) {
      // console.log('eee', e)
      var that = this, index = e.mp.currentTarget.dataset.index, value = e.mp.detail.value, len = e.mp.detail.cursor;
      if (len > 13) {
        wx.showToast({
          title: '选项长度最多17项',
          icon:'none',
          mask:false
        })
        return;
      }
      that.input_answer_list[index].name = value;
      that.default_input_answer_list.awards = that.input_answer_list;
    },
    // 编辑转盘标题
    checkQuestion(e) {
      var that = this, value = e.target.value, len = e.target.cursor;
      if (len > 21) {
        wx.showToast({
          title: '标题长度最大为21',
          icon:'none',
          mask:false
        })
        return;
      }
      that.default_input_answer_list.option = value;
    },
    // 保存转盘选项
    saveQA() {
      var that = this, obj = that.default_input_answer_list, title = obj.option, awardsLen = obj.awards.length, all = wx.getStorageSync('all'), myJuedin = wx.getStorageSync('myJuedin'), arr = [];
      if (awardsLen < 4) {
        wx.showToast({
          title: '选项长度不能小于4',
          icon:'none',
          mask:false
        })
        return;
      };
      if (title == '') {
        wx.showToast({
          title: '名称不能为空',
          icon:'none',
          mask:false
        })
        return;
      };
      for (let i = 0; i < obj.awards.length; i++) {
        const item = obj.awards[i];
        if (item.name == '') {
          wx.showToast({
            title: '选项名称不能为空',
            icon:'none',
            mask:false
          })
          return;
        };
      }
      if (util.isNull(myJuedin)) {
        this.$globalData.myJueding = true;
        arr.push(obj);
        wx.setStorageSync('myJuedin', arr); 
        wx.setStorageSync('switchTab', obj.id);
        all.push(obj);
        wx.setStorageSync('all', all);
        wx.setStorageSync('num', wx.getStorageSync('num') + 1);
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          mask: false,
          success: function () {
            setTimeout(function () {
                wx.switchTab({
                  url: '../index/main'
                })
            }, 1500)
          }
        })
        return;
      }
      for (let i in myJuedin) {
        if (obj.num == myJuedin[i].num) {
            myJuedin[i] = obj;
            wx.setStorageSync('myJuedin', myJuedin);
            for (let x in all) {  
              if (all[x].id == obj.id) {
                  all[x] = obj;
                  wx.setStorageSync('all', all);
                  break;
              }
            }
            this.$globalData.myJueding = true;
            wx.setStorageSync('switchTab', obj.id);
            if (that.flg == 1) {
              that.flg = 0
            }
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              mask: false,
              success: function () {
                  setTimeout(function () {
                    wx.switchTab({
                        url: '../index/main'
                    })
                  }, 1500)
              }
            })
            return;
        }
        //新添加的个人决定
        this.$globalData.myJueding = true;
        wx.setStorageSync('switchTab', obj.id);
        myJuedin.push(obj);
        wx.setStorageSync('myJuedin', myJuedin);
        all.push(obj);
        wx.setStorageSync('all', all);
        wx.setStorageSync('num', wx.getStorageSync('num') + 1);
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          mask: false,
          success: function () {
              setTimeout(function () {
                wx.switchTab({
                    url: '../index/main'
                })
              }, 1500)
          }
        })
      }
    },
  },

  mounted() {
    var that = this, obj = {}, myJuedin = wx.getStorageSync('myJuedin'), arr = [], all = wx.getStorageSync('all'), num = wx.getStorageSync('num');
    that.params = JSON.parse(that.$root.$mp.query.item);
    that.flg = that.$root.$mp.query.flg;
    // 个人\热门编辑，非新增
    if (that.params != '{}') {
      that.option = that.params.option;
      that.input_answer_list = that.params.awards;
      that.default_input_answer_list = this.params;
      //个人小决定
      if (that.flg == 2) {
        that.default_input_answer_list.id = num;
        that.default_input_answer_list.num = num;
        return;
      }
      // 热门决定
      if (that.flg == 1) {
        if (util.isNull(myJuedin)) {
            arr.push(that.params);
            wx.setStorageSync('myJuedin', arr);
        } else {
            myJuedin.push(that.params);
            wx.setStorageSync('myJuedin', myJuedin);
        }
        that.flg = 1
      }
    }
  },
  created () {

  },

  onLoad(params) {


  },
     onUnload: function () {
      //  console.log('inininininini onunload')
      var that = this, flg = that.flg, myJuedin = wx.getStorageSync('myJuedin'), all = wx.getStorageSync('all');

      if (flg == 1) {
         myJuedin.splice(myJuedin.length - 1, 1);
         wx.setStorageSync('myJuedin', myJuedin);
      }

      function rep(arr) {
         var result = [];
         var obj = {};
         for (var i = 0; i < arr.length; i++) {
            if (!obj[arr[i].id]) {
               result.push(arr[i]);
               obj[arr[i].id] = true;
            }
         }
         return result;
      }
      var a = rep(myJuedin), b = rep(all);
      wx.setStorageSync('myJuedin', a);
      wx.setStorageSync('all', b);
   },
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    background-color: #efefef;
    padding-bottom: 10px;
    padding-top:0.5px;
}

.modules_box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: calc(100% - 20px);
    height: 60px;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #fff;
    border-radius: 6px;
}

.modules_icon_box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 60px;
}

.modules_icon {
    width: 20px;
    height: 20px;
}

.modules_input_box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: calc(100% - 60px);
    height: 60px;
}

.modules_input {
    width: 100%;
    font-size: 14px;
    color: #000000;
    padding-left: 10px;
}

@keyframes btn_rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.modules_answer_box:hover .modules_icon_box {
    animation: btn_rotate 0.3s 0s linear 1 normal;
}

.modules_word_box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: calc(100% - 60px);
    height: 100%;
}

.modules_word {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #007aff;
    padding-left: 10px;
}

.modules_save_box {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #007aff;
    border: 1px solid #007aff;
    box-sizing: border-box;
    background-color: #ffffff;
}

@keyframes word_rotate {
    0% {
        transform: rotateX(0deg);
    }

    100% {
        transform: rotateX(360deg);
    }
}

.modules_save_box:hover .modules_icon_box {
    animation: word_rotate 0.3s 0s linear 1 normal;
}
</style>
