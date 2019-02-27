<template>
  <div class="container" style="height: 100%">
    <!-- 初始化大转盘 -->
    <div style='width:100%;margin:0 auto;text-align:center;font-size:34rpx;margin-bottom:10rpx;'>{{awardsConfig.option}}</div>
    <div style='width:100%;margin:0 auto;text-align:center;margin-bottom:44rpx;color:#1078e7;font-size:30rpx'>{{s_awards}}</div>
    <zhuanpan id='zhuanpan'
      @myAwards="getAwards"
      @startZhuan="startZhuan"
      :size="size"
      :musicflg="musicflg"
      :fastJuedin="fastJuedin"
      :repeat="repeat"
      :awardsConfig='awardsConfig'>
    </zhuanpan>
     <div style='margin-top:60rpx'></div>
     <div class='juedinoption' v-for='(item, index) in xiaojuedingArr' :key='item' v-show='index < 3 && share' @click='xiaojueding' :data-idx="index">{{item.option}}</div>
     <!-- 分享到朋友圈或微信好友 -->
     <div class='share' v-if='!share'>
        <!-- 低版本的手机可能不兼容openType="share", 以后有时间再解决 -->
        <button class="index__share" openType="share">
           转发给朋友
        </button>
        <button class="index__share" @click="generate">
           分享到朋友圈
        </button>
     </div>

   <block v-if="saveFrameFlag">
      <div class="middle-flex-column-center" style="position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.2);z-index:10000;">
         <div class="middle-flex-column-center" style="width:600rpx;height:920rpx;background:#ffffff;border-radius:16rpx;">
            <div style="width:400rpx;height:650rpx;">
               <image style="width:100%;height:100%;" :src="shengchengUrl"></image>
            </div>
            <div style="width:600rpx;height:80rpx;line-height:80rpx;text-align:center;font-size:28rpx;color:#1078e7;">保存后分享到朋友圈</div>
            <div style="width:600rpx;height:70rpx;" class="middle-flex-row-center">
               <button style="margin:0;padding:0;width:200rpx;height:70rpx;color: #1078e7;border-radius: 8rpx;border: 1px solid #1078e7;background: none;font-size: 28rpx;text-align:center;line-height:70rpx;" @click='closeSaveFrame'>关闭</button>
               <button style="margin:0;padding:0;width:200rpx;height:70rpx;color: #1078e7;border-radius: 8rpx;border: 1px solid #1078e7;background: none;font-size: 28rpx;text-align:center;line-height:70rpx;margin-left:30rpx;" @click='saveImage'>保存图片</button>
            </div>
         </div>
      </div>
   </block>

   <block v-if="showCanvasFlag">
      <canvas canvas-id="shareCanvas" style="width:400px;height:650px;border:1px dashed black;"></canvas>
   </block>
  </div>
</template>

<script>
import xiaojuedingArr from '../../utils/xiaojueding.js'
var util = require('../../utils/util.js')
wx.setStorageSync('all', xiaojuedingArr);
// wx.setStorageSync('default', xiaojuedingArr.sort(randomsort));
wx.setStorageSync('num', 100);
function randomsort(a, b) {
   return Math.random() > .5 ? -1 : 1;
}

export default {
   data () {
      return {
         s_awards: '？', // 抽中的选项
         zhuanpan:{}, // 转盘组件
         size: { //转盘大小可配置
            w:599,
            h:600
         },
         xiaojuedingArr: wx.getStorageSync('all'), // 打乱顺序的所有转盘选项
         share: true, // 分享
         musicflg: true,
         fastJuedin: false, // 快速决定
         repeat: false, // 不重复抽取
         zhuanflg: false,  // 转动状态
         awardsConfig:{}, // 当前转盘选项
         getData: {}, // 初始化当前转盘选项
         // 微信朋友圈分享画布
         saveFrameFlag: false,
         shengchengUrl: '',
         showCanvasFlag: false,
         colorArr: [
            '#EE534F',
            '#FF7F50',
            '#FFC928',
            '#66BB6A',
            '#42A5F6',
            '#5C6BC0',
            '#AA47BC',
            '#EC407A',
            '#FFB6C1',
            '#FFA827'
         ],
         fontArr: ['italic', 'oblique', 'normal'],
         sizeArr: [12, 14, 16, 18, 20, 22, 24, 26, 28],
         eweimaUrl: '../../static/images/wodeerweima.png', // 微信二维码
         canvasWidth: 400,
         canvasHeight: 650,
      }
   },
   methods: {
      // 首页点击切换转盘选项
      xiaojueding(e) {
         var that = this, idx = e.mp.target.dataset.idx, xiaojuedingArr = that.xiaojuedingArr;
         if (!that.zhuanflg) {
            for (let x in xiaojuedingArr) {
               if (idx == x) {
                  that.zhuanpan.switchZhuanpan(xiaojuedingArr[x]);//切换当前转盘数据选项
                  that.awardsConfig = xiaojuedingArr[x];
                  return;
               }
            }
         }
      },
      // 获取转盘结束之后的得出的选项
      getAwards(e) {
         this.s_awards = e.mp.detail.end ? "？" : e.mp.detail.s_awards
         this.share = e.mp.detail.end ? true : false
      },
      // 开始转动
      startZhuan(e) {
         this.zhuanflg = e.mp.detail ? true : false
      },
      //分享到朋友圈
      generate() {
         wx.showLoading({
            title: '正在生成中',
         })
         var that = this;
         that.showCanvasFlag = true;
         var textArr = [];
         for (var i = 0; i < that.awardsConfig.awards.length; i++) {
            textArr.push(that.awardsConfig.awards[i].name);
         }
         that.makeImageCanvas('shareCanvas', that.awardsConfig.option, textArr, that.colorArr, that.fontArr, that.sizeArr, 600, 20, 20, 40, that.canvasWidth, that.canvasHeight, 120, 400, that.eweimaUrl);
         setTimeout(function () {
            wx.canvasToTempFilePath({
               x: 0,
               y: 0,
               width: that.canvasWidth,
               height: that.canvasHeight,
               canvasId: 'shareCanvas',
               success: function (res) {
                  that.showCanvasFlag = false   
                  that.saveFrameFlag = true
                  that.shengchengUrl = res.tempFilePath
                  wx.hideLoading();
               },
               fail: function(err) {
                  console.log('err', err)
               }
            })
         }, 2000)
      },
      //画图--画布:canvasName画布ID名，title标题，textArr内容数组，colorArr字体颜色数组，fontArr字体样式数组，sizeArr字体大小数组，num总数量，rowNum一行数量--最大为5，distance同行中词的距离，spacing第二行与第一行隔多少距离，canvasWidth画布宽度，canvasHeight画布高度，midWidth中间宽度，midHeight中间高度，imgUrl二维码图片路径
      makeImageCanvas: function (canvasName, title, textArr, colorArr, fontArr, sizeArr, num, rowNum, distance, spacing, canvasWidth, canvasHeight, midWidth, midHeight, imgUrl) {
         var that = this;
         var contentArr = [];
         for (var a = 0; a < num; a++) {
            // 随机生成文字内容
            var neirong = that.arrayRandomTakeOne(textArr);//内容
            contentArr.push(neirong);
         }
         const ctx = wx.createCanvasContext(canvasName)

         ctx.clearRect(0, 0, canvasWidth, canvasHeight)//清除画布区域内容
         ctx.setFillStyle('white')//填充背景色--白色
         ctx.fillRect(0, 0, canvasWidth, canvasHeight)
         var daxiaoArr = [];
         for (var i = 0; i < contentArr.length; i++) {
            var hang = parseInt(i / rowNum) + 1;//第几行
            var hangDj = i % rowNum;//每行第几
            var yanse = that.arrayRandomTakeOne(colorArr);//颜色
            var ziti = that.arrayRandomTakeOne(fontArr);//字体
            var daxiao = that.arrayRandomTakeOne(sizeArr);//大小
            daxiaoArr.push(daxiao);

            var rowStart = 0;//水平起点
            var columnStart = hang * spacing;//竖直起点

            if (hangDj == 0) {
               rowStart = 0;
            }
            else if (hangDj > 0) {
               for (var e = 1; e < hangDj + 1; e++) {
                  rowStart = rowStart + contentArr[i - e].length * daxiaoArr[i - e];
               }
               rowStart = rowStart + distance * hangDj;
            }

            ctx.fillStyle = yanse;//字体颜色
            ctx.font = ziti + ' small-caps normal ' + daxiao + 'px Arial';
            ctx.fillText(contentArr[i], rowStart, columnStart)
         }

         ctx.setFillStyle('white')//填充背景色--白色
         ctx.fillRect((canvasWidth - midWidth) / 2, (canvasHeight - midHeight) / 2, midWidth, midHeight)

         var titleArr = [];
         for (var n = 0; n < title.length; n++) {
            titleArr.push(title[n]);
         }

         var titleHeight = midHeight - 10 - midWidth;
         var titleDaxiao = parseInt(titleHeight / title.length);

         titleDaxiao = titleDaxiao > 50 ? 50 : titleDaxiao;

         for (var m = 0; m < titleArr.length; m++) {
            ctx.fillStyle = '#000000';//字体颜色
            ctx.font = 'normal small-caps normal ' + titleDaxiao + 'px Arial';
            ctx.setTextAlign('center')
            ctx.fillText(titleArr[m], canvasWidth / 2, (canvasHeight - midHeight) / 2 + 5 + titleDaxiao * (m + 1))
         }

         ctx.drawImage(imgUrl, (canvasWidth - midWidth) / 2 + 5, canvasHeight - (midWidth + (canvasHeight - midHeight) / 2), midWidth - 10, midWidth - 10)//二维码
         wx.drawCanvas({
            canvasId: canvasName,
            actions: ctx.getActions()
         })

      },
      //关闭分享图片页面
      closeSaveFrame: function () {
         var that = this;
         that.zhuanpan.reset();
         that.saveFrameFlag = false;
      },
      // 保存生成的图片
      saveImage() {
         var that = this;
         var filePath = that.shengchengUrl;
         wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success: function (res) {
               wx.showToast({
                  title: '保存图片成功！',
                  icon: 'none',
                  duration: 1000,
                  mask: true,
               })
            }
         })
      },
      //数组随机取出一个数
      arrayRandomTakeOne: function (array) {
         var index = Math.floor((Math.random() * array.length + 1) - 1);
         return array[index];
      },
  },
   onShow(e) {
      // 判断跳转过来是热门选项还是自定义
      var that = this, switchTab = wx.getStorageSync('switchTab'), all = wx.getStorageSync('all'), xiaojuedingArr = that.xiaojuedingArr;
      this.zhuanpan = this.$mp.page.selectComponent('#zhuanpan')
      all = this.$globalData.defaultJueding ? xiaojuedingArr : this.$globalData.myJueding ? all : xiaojuedingArr;
      that.musicflg = this.$globalData.musicflg
      that.fastJuedin = this.$globalData.fastJuedin
      that.repeat = this.$globalData.repeat
      //跳转过来的
      // console.log('switchTab', !util.isNull(switchTab))
      if (!util.isNull(switchTab)) {
         // console.log('跳转过来的。。。')
         wx.showLoading({
            title: '加载中',
         })
         switchTab = switchTab == '00' ? '0' : switchTab;
         setTimeout(function () {
            for (let i in all) {
               if (all[i].id == switchTab) {
                  that.zhuanpan.switchZhuanpan(all[i], true);//切换当前转盘数据选项
                  that.awardsConfig = all[i]
                  that.zhuanflg = false;
                  break;
               }
            }
            wx.hideLoading();
         }, 500)
      }
      wx.setStorageSync('switchTab','false')
      this.awardsConfig = wx.getStorageSync('myData')
   }
}
</script>

<style lang="scss" scoped>

.container{
  width: 100%;
  height: 100%;
}

.canvas-container {
   margin: 0 auto;
   position: relative;
}

.gb-wheel-content {
   position: relative;
   margin: 0 auto;
   z-index: 2;
   width: 660rpx;
   height: 660rpx;
   box-sizing: border-box;
   border-radius: 50%;
   /* border: 20rpx solid #4e413b; *//* border: 20rpx solid #f0f0f0; *//* background-clip: padding-box;
   background: radial-gradient(rgba(100, 100, 100, 0.1) 15%, transparent 16%) 0 0,
                radial-gradient(rgba(100, 100, 100, 0.1) 15%, transparent 16%) 8px 8px,
                radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px,
                radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 8px 9px; *//* background-color: #e2ded3; *//* background-color: transparent;#BDB76B */
   background-size: 12px 14px;
   box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.2) inset;
   overflow: hidden;
}

.gb-wheel-run {
   box-shadow: 0 0 5rpx 0rpx rgba(0, 0, 0, 0.98);
   width: 700rpx;
   height: 700rpx;
   border-radius: 50%;
   border: 30rpx solid #f1ecec;
   box-sizing: border-box;
   position: absolute;
   left: 27rpx;
   top: -19rpx;
   opacity: 0.7;
}

.gb-wheel-line {
   margin: 0 auto;
   position: relative;
   width: 100%;
   height: 100%;
   z-index: 9;
}

.gb-wheel-litem {
   position: absolute;
   left: 340rpx;
   top: 0;
   width: 1.2px;
   height: 340rpx;
   /* background-color: #4e413b; */
   background-color: #fff;
   overflow: hidden;
   transform-origin: 50% 340rpx;
}

.gb-wheel-list {
   position: absolute;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   z-index: 9;
}

.gb-wheel-item {
   position: absolute;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   color: #fff;
   text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6);
}

.gb-wheel-icontent {
   position: relative;
   display: block;
   padding-top: 50rpx;
   margin: 0 auto;
   text-align: center;
   transform-origin: 50% 328rpx;
}

/* ***************************** */

.canvas-list {
   position: absolute;
   left: 0;
   top: 0;
   width: inherit;
   height: inherit;
   z-index: 8;
}

.canvas-item2 {
   position: absolute;
   left: 0px;
   top: 0;
   width: 660rpx;
   height: 330rpx;
   color: #e4370e;
   font-weight: bold;
   transform-origin: 330rpx 330rpx;
   overflow: hidden;
}

.canvas-item2-after {
   position: absolute;
   top: 0;
   left: 0;
   width: 330rpx;
   height: 330rpx;
   transform-origin: 330rpx 330rpx;
   opacity: 1;
}

.back {
   position: absolute;
   width: 100%;
   height: 90%;
   background: rgba(255, 255, 255, 0.5);
   left: 0;
   top: -40rpx;
   z-index: 8888;
}

.juedinoption {
   font-size: 30rpx;
   color: #1078e7;
   width: 100%;
   text-align: center;
   margin-top: 30rpx;
   text-decoration: underline;
}

.share {
   width: 100%;
   height: 180rpx;
   display: flex;
   align-items: center;
   justify-content: space-around;
}

.index__share {
   width: 36%;
   color: #1078e7;
   border-radius: 8rpx;
   border: 1px solid #1078e7;
   background: none;
   font-size: 28rpx;
   padding: 10rpx 0;
}
/*居中--弹性--竖向--中间*/
.middle-flex-column-center{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/*居中--弹性--横向--中间*/
.middle-flex-row-center{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>
