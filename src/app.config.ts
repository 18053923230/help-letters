export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/game/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '拼音跑酷',
    navigationBarTextStyle: 'black'
  }, 
  "lazyCodeLoading": "requiredComponents",
  // 开启分享
  enableShareAppMessage: true,
  enableShareTimeline: true
   

})
