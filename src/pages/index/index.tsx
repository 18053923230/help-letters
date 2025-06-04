import { View } from '@tarojs/components'
import Taro,{ useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import HomePage from '../../components/ThreeScene'

export default function Index() {
  // // 用 ref 让子组件暴露加金币方法（可选）
  // const homePageRef = useRef<any>(null)

  // // 分享奖励逻辑
  // const handleShareBonus = (res) => {
  //   if (res.shareTickets && res.shareTickets.length > 0) {
  //     // 只有分享到群才有shareTickets
  //     Taro.getShareInfo({
  //       shareTicket: res.shareTickets[0],
  //       success: (info) => {
  //         const groupId = info.encryptedData // 实际项目应解密
  //         const shareBonus = Taro.getStorageSync('share_bonus') || {}
  //         const now = Date.now()
  //         const lastTime = shareBonus[groupId] || 0
  //         if (now - lastTime > 6 * 60 * 60 * 1000) {
  //           // 6小时未领奖，发奖励
  //           // 直接本地加金币
  //           const saved = Taro.getStorageSync('user_stats')
  //           let coins = 0, score = 0
  //           if (saved) {
  //             const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved
  //             coins = parsed.coins || 0
  //             score = parsed.score || 0
  //           }
  //           coins += 50
  //           Taro.setStorageSync('user_stats', JSON.stringify({ coins, score }))
  //           // 通知子组件刷新金币（可选）
  //           if (homePageRef.current && homePageRef.current.refreshCoins) {
  //             homePageRef.current.refreshCoins()
  //           }
  //           shareBonus[groupId] = now
  //           Taro.setStorageSync('share_bonus', shareBonus)
  //           Taro.showToast({ title: '分享成功，获得50金币！', icon: 'success' })
  //         } else {
  //           Taro.showToast({ title: '该群6小时内已领取过奖励', icon: 'none' })
  //         }
  //       }
  //     })
  //   } else {
  //     Taro.showToast({ title: '请分享到微信群以获得奖励', icon: 'none' })
  //   }
  // }

  // 分享钩子（必须写在页面文件）
  useShareAppMessage(() => ({
    title: '守护拼音小游戏，快来挑战！',
    path: '/pages/index/index',
    // success: (res) => {
    //   handleShareBonus(res)
    // }
  }))
  useShareTimeline(() => ({
    title: '守护拼音小游戏，快来挑战！'
  }))

  return (
    <HomePage />  
  )
}