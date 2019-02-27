<template>
  <div class="container">
    <div class="question_tab_box">
      <div @click="tabSwitch" class="question_tab" :class="tab_index==1?'question_tab_selected':''" data-flg="1">热门小决定</div>
      <div @click="tabSwitch" class="question_tab" :class="tab_index==2?'question_tab_selected':''" data-flg="2">个人小决定</div>
   </div>
   <div class="question_list_box">

      <!-- 热门小决定 -->
      <div class="official_question_list_box" v-if="tab_index==1">
         <div class="official_question_list_cell question_list_cell" v-for="(item, index) in xiaojueding" :key="item">
            <div @click="officialQToRun" class="official_question question" :data-id="item.id" :data-index="index">{{item.option}}</div>
            <div @click="officialQToControl" class="official_question_control_box question_control_box" :data-index="index">
               <image class="question_control" mode="scaleToFill" :src="index==item.num?'https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_close_60.png':'https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_open_60.png'"></image>
            </div>

            <div class="official_question_btn_box question_btn_box" :style="{'display': index==item.num?'flex':'none'}">
               <button @click="officialQToRun" class="question_btn_cell btn_boder_right" :data-id="item.id" :data-index="index" hoverClass="none">
                  <image class="question_btn_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_index_60.png"></image>
                  <div class="question_btn_title">转一圈</div>
               </button>
               <button @click="officialQToRevise" class="question_btn_cell btn_boder_right" :data-index="index" hoverClass="none">
                  <image class="question_btn_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_revise_60.png"></image>
                  <div class="question_btn_title">编辑</div>
               </button>
               <button @click="officialQToKeep" class="question_btn_cell btn_boder_right" :data-index="index" hoverClass="none">
                  <image class="question_btn_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_keep_60.png"></image>
                  <div class="question_btn_title">收藏</div>
               </button>
               <button class="question_btn_cell btn_boder_left" hoverClass="none" openType="share">
                  <image class="question_btn_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_share_60.png"></image>
                  <div class="question_btn_title">分享</div>
               </button>
            </div>
         </div>
      </div>
      <!-- 个人小决定页面 -->
      <div class="personal_question_list_box" v-if="tab_index==2">
        <div class="personal_question_list_cell question_list_cell" v-for="(item, index) in myxiaojueding" :key="item">
          <div @click="personalQToRun" class="personal_question question" :data-id="item.id" :data-index="index">{{item.option}}</div>
          <div @click="personalQToControl" class="personal_question_control_box question_control_box" :data-index="index">
              <image class="question_control" mode="scaleToFill" :src="index==item.num1?'https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_close_60.png':'https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_open_60.png'"></image>
          </div>
          
          <div class="personal_question_btn_box question_btn_box" :style="{'display': index==item.num1?'flex':'none'}">
              <button @click="personalQToRun" class="question_btn_cell btn_boder_right" :data-id="item.id" :data-index="index" hoverClass="none">
                <image class="question_btn_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_index_60.png"></image>
                <div class="question_btn_title">转一圈</div>
              </button>
              <button @click="personalQToRevise" class="question_btn_cell btn_boder_right" :data-index="index" hoverClass="none">
                <image class="question_btn_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_revise_60.png"></image>
                <div class="question_btn_title">编辑</div>
              </button>
              <button @click="personalQToDelete" class="question_btn_cell btn_boder_right" :data-index="index" hoverClass="none">
                <image class="question_btn_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_delete_60.png"></image>
                <div class="question_btn_title">删除</div>
              </button>
              <button class="question_btn_cell btn_boder_left" hoverClass="none" openType="share">
                <image class="question_btn_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_share_60.png"></image>
                <div class="question_btn_title">分享</div>
              </button>
          </div>
        </div>
        <div @click="addPersonalQ" class="personal_question_add_cell question_list_cell">
            <div class="question_add_box">
              <image class="question_add_icon" mode="scaleToFill" src="https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/icon_list_add_60.png"></image>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var xiaojueding = require('../../utils/xiaojueding.js');
var util = require('../../utils/util.js')
import Vue from 'vue'
export default {
  data () {
    return {
      tab_index: 2,
      xiaojueding: xiaojueding,
      myxiaojueding:[],
    }
  },
  methods: {
    // 切换热门决定及自定义决定
    tabSwitch(e) {
      var that = this, flg = e.mp.currentTarget.dataset.flg, myJuedin = that.xiaojueding;
      that.tab_index = flg;
      if (this.tab_index == 1) {
        that.myxiaojueding = myJuedin
      } else {
        that.myxiaojueding = wx.getStorageSync('myJuedin')
      }
      // console.log('this.tab_index', this.tab_index)
    },
    // 点击热门小决定前往大转盘页面
    officialQToRun(e) {
      var that = this, id = e.mp.currentTarget.dataset.id;
      this.$globalData.defaultJueding = true;
      id = id == 0 ? '00' : id;
      wx.setStorageSync('switchTab', id);
      wx.switchTab({
        url: '../index/main'
      })
    },
    // 点击显示热门小决定功能模块
    officialQToControl(e) {
      var that = this, index = e.mp.currentTarget.dataset.index, idx, myxiaojueding = that.myxiaojueding;
      for (let x in myxiaojueding) {
        if (x == index) {
          idx = myxiaojueding[x].num == undefined ? index : undefined;
          myxiaojueding[x].num = idx;
          Vue.set(this.xiaojueding, index, this.xiaojueding[index])
        } else {
          myxiaojueding[x].num = undefined;
        }
      }
      that.myxiaojueding = myxiaojueding
    },
    // 编辑热门小决定
    officialQToRevise(e) {
      var that = this, xiaojueding = that.xiaojueding, index = e.mp.currentTarget.dataset.index;
      for (let i in xiaojueding) {
        if (i == index) {
          wx.navigateTo({
            url: '../editPage/main?flg=1&item=' + JSON.stringify(xiaojueding[i])
          })
          return;
        }
      }
    },
    // 收藏热门小决定
    officialQToKeep(e) {
      // console.log('e', e.mp)
      var that = this, index = e.mp.currentTarget.dataset.index, myJuedin = wx.getStorageSync('myJuedin'), xiaojueding = that.xiaojueding, flag = true;
      myJuedin = util.isNull(myJuedin) ? [] : myJuedin;
      for (let x in xiaojueding) {
         if (x == index) {
            if (myJuedin.length == 0) {
               myJuedin.push(xiaojueding[x]);
               wx.setStorageSync('myJuedin', myJuedin);
               wx.showToast({
                  title: '收藏成功',
                  icon: 'success',
                  mask: false
               })
            } else {
               for (let i in myJuedin) {
                  if (myJuedin[i].id == xiaojueding[x].id) {
                     flag = false;
                     break;
                  }
               }
               if (flag) {
                  myJuedin.push(xiaojueding[x]);
                  wx.setStorageSync('myJuedin', myJuedin);
                  wx.showToast({
                     title: '收藏成功',
                     icon: 'success',
                     mask: false
                  })
               }
            }
            break;
         }
      }
    },
    // 点击个人小决定前往大转盘页面
    personalQToRun(e) {
      var that = this, id = e.mp.currentTarget.dataset.id;
      this.$globalData.myJueding = true;
      wx.setStorageSync('switchTab', id);
      wx.switchTab({
        url: '../index/main'
      })
    },
    // 点击显示个人小决定功能模块
    personalQToControl(e) {
      var that = this, index = e.mp.currentTarget.dataset.index, idx, myxiaojueding = that.myxiaojueding;
      for (let x in myxiaojueding) {
        if (x == index) {
          idx = myxiaojueding[x].num1 == undefined ? index : undefined;
          myxiaojueding[x].num1 = idx;
          Vue.set(this.xiaojueding, index, this.xiaojueding[index])
        } else {
          myxiaojueding[x].num1 = undefined;
        }
      }
      that.myxiaojueding = myxiaojueding
    },
    // 编辑个人小决定
    personalQToRevise(e) {
      var that = this, myJuedin = wx.getStorageSync('myJuedin'), index = e.mp.currentTarget.dataset.index;
      for (let i in myJuedin) {
         if (i == index) {
            wx.navigateTo({
               url: '../editPage/main?flg=2&item=' + JSON.stringify(myJuedin[i])
            })
            return;
         }
      }
    },
    // 删除个人小决定
    personalQToDelete(e) {
      var that = this, index = e.currentTarget.dataset.index, myJuedin = wx.getStorageSync('myJuedin');
      for (let i in myJuedin) {
         if (index == i) {
            myJuedin.splice(i, 1);
            wx.showToast({
               title: '删除成功',
               icon: 'success',
               mask: false
            })
            break;
         }
      }
      that.myxiaojueding = myJuedin
      wx.setStorageSync('myJuedin', myJuedin);
    },
       //添加个人小决定
    addPersonalQ(e) {
      wx.navigateTo({
        url: '../editPage/main?flg=2&item=' + JSON.stringify('{}'),
      })
   },
  },
  onShow: function () {
    var that = this, myJuedin = wx.getStorageSync('myJuedin');
    this.$globalData.defaultJueding = false, this.$globalData.myJueding = false;
    //创建的个人小决定
    if (!util.isNull(myJuedin)) {
      that.myxiaojueding = myJuedin
      // console.log('m', that.myxiaojueding)
    }
    wx.removeStorageSync('switchTab')
   },
  mounted(){
    
  },
  created () {

  },

  onLoad(params) {


  }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    background-color: #efefef;
    padding-bottom: 10px;
}

.question_tab_box {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    background-color: #ffffff;
    border-top:4rpx solid #efefef;
}

.question_tab {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 48px;
    font-size: 14px;
    color: #7a7a7a;
    box-sizing: border-box;
    margin: 0 12px;
    letter-spacing:6rpx;
}

.question_tab_selected {
    color: #000000;
    border-top: 3px solid transparent;
    border-bottom: 3px solid #007aff;
}

.question_list_box {
    width: 100%;
}

.question_list_cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    width: calc(100% - 20px);
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #ffffff;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
}

.question {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: calc(100% - 80px);
    height: 60px;
    font-size: 14px;
    color: #007aff;
    padding-left: 20px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: underline;
}

@keyframes question_rotate {
    0% {
        transform: rotateX(0deg);
    }

    100% {
        transform: rotateX(360deg);
    }
}

.question:hover {
    animation: question_rotate 0.3s 0s linear 1 normal;
}

.question_control_box {
    display: flex;
    height: 60px;
    width: 60px;
    align-items: center;
    justify-content: center;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
}

.question_control {
    width: 20px;
    height: 20px;
    margin: 20px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
}

.question_btn_box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 40px;
}

.question_btn_cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 25%;
    height: 100%;
}

@keyframes icon_rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.question_btn_cell:hover .question_btn_icon {
    animation: icon_rotate 0.3s 0s linear 1 normal;
}

button {
    display: flex;
    border: 0px;
    border-radius: 0px;
    padding-left: 0;
    padding-right: 0;
    background-color: transparent;
}

button::after {
    border: none;
}

.btn_boder_right {
    box-sizing: border-box;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid transparent;
    border-left: 1px solid transparent;
    border-right: 1px solid #f5f5f5;
}

.btn_boder_left {
    box-sizing: border-box;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid transparent;
    border-left: 1px solid f5f5f5;
    border-right: 1px solid transparent;
}

.question_btn_icon {
    width: 20px;
    height: 20px;
    margin: 10px 5px 10px 10px;
}

.question_btn_title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: calc(100% - 35px);
    height: 40px;
    color: #007aff;
    font-size: 12px;
}

.personal_question_add_cell {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #007aff;
    box-sizing: border-box;
}

.question_add_box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
}

.question_add_icon {
    width: 20px;
    height: 20px;
}

.personal_question_add_cell:hover .question_add_icon {
    animation: btn_rotate 0.3s 0s linear 1 normal;
}

</style>
