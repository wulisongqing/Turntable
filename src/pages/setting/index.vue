<template>
  <div class="container">
    <div class="modules_box">
      <div class="modules_icon_box">
         <image class="modules_icon" mode="scaleToFill" src="../../static/images/icon_set_sound_60.png"></image>
      </div>
      <div class="modules_title_box">声音</div>
      <div class="modules_switch_box">
         <switch @change="switchChangeSound" :checked="custom_sound_default" class="modules_switch" type="switch"></switch>
      </div>
   </div>


   <div class="modules_box">
      <div class="modules_icon_box">
         <image class="modules_icon" mode="scaleToFill" src="../../static/images/icon_set_fast_select_60.png"></image>
      </div>
      <div class="modules_title_box">快速决定</div>
      <div class="modules_switch_box">
         <switch @change="switchChangeFastSelect" :checked="custom_fast_select_default" class="modules_switch" type="switch"></switch>
      </div>
   </div>


   <div class="modules_box">
      <div class="modules_icon_box">
         <image class="modules_icon" mode="scaleToFill" src="../../static/images/icon_set_no_repetition_select_60.png"></image>
      </div>
      <div class="modules_title_box">不重复抽取</div>
      <div class="modules_switch_box">
         <switch @change="switchChangeNoRepetitionSelect" :checked="custom_no_repetition_select_default" class="modules_switch" type="switch"></switch>
      </div>
   </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      custom_sound_default: true,
      custom_fast_select_default: false,
      custom_no_repetition_select_default: false,
    }
  },
  methods: {
      switchChangeSound(e) {
        this.custom_sound_default = e.mp.detail.value
        this.$globalData.musicflg = e.mp.detail.value
      },
      switchChangeFastSelect(e) {
        this.custom_fast_select_default = e.mp.detail.value
        this.$globalData.fastJuedin = e.mp.detail.value
      },
      switchChangeNoRepetitionSelect(e) {
        this.custom_no_repetition_select_default = e.mp.detail.value
        this.$globalData.repeat = e.mp.detail.value
      }
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
page{
    background-color: #efefef;
}
.container {
    width: 100%;
    background-color: #efefef;
    padding: 0.1px 0 10px 0;
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
    background-color: #ffffff;
    border-radius: 6px;
    border: 1px solid transparent;
    box-sizing: border-box;
}

.modules_icon_box {
    height: 60px;
    width: 60px;
}

.modules_icon {
    width: 20px;
    height: 20px;
    margin: 20px;
}

.modules_title_box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    line-height: 60px;
    width: calc(100% - 120px);
    font-size: 14px;
    color: #7a7a7a;
}

.modules_switch_box {
    display: flex;
    height: 60px;
    width: 40px;
    align-items: center;
    justify-content: center;
}

.navigator-hover {
    border: 1px solid #007aff;
    box-sizing: border-box;
}

.modules_button {
    width: 40px!important;
    height: 20px!important;
}

.wx-switch-input {
    width: 40px!important;
    height: 20px!important;
}

.wx-switch-input::before {
    width: 38px!important;
    height: 18px!important;
}

.wx-switch-input::after {
    width: 18px!important;
    height: 18px!important;
}
</style>
