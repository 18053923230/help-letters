import { Canvas, View } from '@tarojs/components'
import Taro, { createSelectorQuery, getStorageSync, setStorageSync, useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import { phoneticData } from '../../config/phoneticData'
import { difficultyLevels } from '../../config/gameConfig'
import './index.scss'

import PhoneticAudioPlayer from '../../components/PhoneticAudioPlayer'
// import { useRef } from 'react'

const STORAGE_KEY = 'phonetic_progress'

const HomePage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('initials')
    const canvasRef = useRef<any>(null)
    const [progress, setProgress] = useState<{ [key: string]: boolean }>({})
    const [selectedItem, setSelectedItem] = useState<PhoneticItem | null>(null)

    const [showHelp, setShowHelp] = useState(false)

    useShareAppMessage(() => ({
        title: '守护拼音小游戏，快来挑战！',
        path: '/pages/index/index',
        // imageUrl: '' // 可选：自定义分享图片
    }))

    useShareTimeline(() => ({
        title: '守护拼音小游戏，快来挑战！'
    }))

    // const audioPlayerRef = useRef<{ play: () => void }>(null)

    // 在 HomePage 组件顶部
    const [lastBonusTime, setLastBonusTime] = useState<number>(0)

    useEffect(() => {
        Taro.showToast({ title: '帮助在右上', icon: 'success' })

        // 首次登录奖励
        const saved = Taro.getStorageSync('user_stats')
        if (!saved) {
            setCoins(100)
            setScore(0)
            Taro.setStorageSync('user_stats', JSON.stringify({ coins: 100, score: 0 }))
            Taro.showToast({ title: '首次登录奖励100金币！', icon: 'success' })
        } else {
            const { coins = 0, score = 0 } = JSON.parse(saved)
            setCoins(coins)
            setScore(score)
        }

        // 检查是否可以领取登录奖励
        const now = Date.now()
        const last = Number(Taro.getStorageSync('last_bonus_time') || 0)
        if (now - last > 2 * 60 * 60 * 1000) { // 2小时
            // 这里要用最新的 coins
            const baseCoins = saved ? JSON.parse(saved).coins : 100
            const baseScore = saved ? JSON.parse(saved).score : 0
            const newCoins = baseCoins + 10
            setCoins(newCoins)
            Taro.setStorageSync('user_stats', JSON.stringify({ coins: newCoins, score: baseScore }))
            Taro.setStorageSync('last_bonus_time', now)
            setLastBonusTime(now)
            Taro.showToast({ title: '获得登录奖励10金币！', icon: 'success' })
        }
    }, [])
    // 进入关卡时扣除金币
    const handleStartGame = () => {
        if (!selectedItem) {
            console.log('No item selected, returning')
            return
        }
        if (coins < 5) {
            Taro.showToast({ title: '金币不足，无法进入关卡，请节约用钱，2小时后再试', icon: 'none' })
            return
        }
        const newCoins = coins - 5
        setCoins(newCoins)
        Taro.setStorageSync('user_stats', JSON.stringify({ coins: newCoins, score }))
        console.log('[handleStartGame] 进入关卡扣除金币，剩余:', newCoins)
        Taro.navigateTo({
            url: `/pages/game/index?category=${activeCategory}&key=${selectedItem.key}`
        })
    }



    const [coins, setCoins] = useState(0)
    const [score, setScore] = useState(0)

    useEffect(() => {
        const saved = Taro.getStorageSync('user_stats')
        if (saved) {
            const { coins = 0, score = 0 } = JSON.parse(saved)
            setCoins(coins)
            setScore(score)
        }
    }, [])



    useEffect(() => {
        initCanvas()
        initProgress()
        return () => cleanup()
    }, [])



    // const initProgress = () => {
    //     try {
    //         const savedProgress = getStorageSync(STORAGE_KEY)
    //         if (savedProgress) {
    //             console.log('Loading saved progress:', savedProgress)
    //             setProgress(JSON.parse(savedProgress))
    //         } else {
    //             const initialProgress = {
    //                 'initials_b': true
    //             }
    //             console.log('Creating initial progress:', initialProgress)
    //             setStorageSync(STORAGE_KEY, JSON.stringify(initialProgress))
    //             setProgress(initialProgress)
    //         }
    //     } catch (error) {
    //         console.error('Failed to load progress:', error)
    //     }
    // }这是是解决第一个的方案。全部按顺序
    const initProgress = () => {
        try {
            const savedProgress = getStorageSync(STORAGE_KEY)
            if (savedProgress) {

                setProgress(JSON.parse(savedProgress))
            } else {
                const initialProgress = {
                    'initials_b': true,
                    'finals_a': true,
                    'syllables_zhi': true
                }
                setStorageSync(STORAGE_KEY, JSON.stringify(initialProgress))
                setProgress(initialProgress)
            }
        } catch (error) {
            console.error('Failed to load progress:', error)
        }
    }



    const cleanup = () => {
        // 清理资源
    }

    const initCanvas = async () => {
        try {
            // ... 保持原有的 canvas 初始化代码
        } catch (error) {
            console.error('Canvas initialization failed:', error)
        }
    }

    // const renderCategoryButton = (category) => {
    //     return (
    //         <View
    //             className={`category-button ${category.isLocked ? 'locked' : ''} ${activeCategory === category.id ? 'active' : ''}`}
    //             onClick={() => !category.isLocked && setActiveCategory(category.id)}
    //         >
    //             <View className="category-name">{category.name}</View>
    //             {category.isLocked && <View className="lock-icon">🔒</View>}
    //         </View>
    //     )
    // }这是原来的顶部，要求按顺序解锁。
    const renderCategoryButton = (category) => {
        return (
            <View
                className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
            >
                <View className="category-name">{category.name}</View>
            </View>
        )
    }
    const getVisibleItems = (category) => {
        // const items = phoneticData.find(c => c.id === category)?.items || []
        const found = phoneticData.find(c => c.id === category);
        const items = found ? found.items : [];

        // 找到最后一个解锁的项目的索引
        const lastUnlockedIndex = items.reduce((maxIndex, item, index) => {
            const isUnlocked = progress[`${category}_${item.key}`]
            return isUnlocked ? index : maxIndex
        }, -1)

        // 返回所有解锁的项目，以及下一个待解锁的项目
        return items.filter((_, index) => index <= lastUnlockedIndex + 1)
    }





    const getItemLevel = (category: string, key: string) => {
        const progress = Taro.getStorageSync(STORAGE_KEY)
        if (progress) {
            const parsed = typeof progress === 'string' ? JSON.parse(progress) : progress
            return parsed[`${category}_${key}_level`] || 1
        }
        return 1
    }

    const [lastClick, setLastClick] = useState<{ key: string, time: number } | null>(null)

    const handleItemClick = (item: PhoneticItem) => {
        const now = Date.now()
        if (
            lastClick &&
            lastClick.key === item.key &&
            now - lastClick.time < 400 // 400ms内双击
        ) {
            setSelectedItem(item)
            handleStartGame()
            setLastClick(null)
            return
        }
        setLastClick({ key: item.key, time: now })
        if (!progress[`${activeCategory}_${item.key}`]) return
        setSelectedItem(item)
        // audioPlayerRef.current?.play()
    }


    const helpLines = [
        '首次登录奖励100学习章。',
        '每两小时可获赠10学习章，每次学习要消耗5学习章。',
        '每次过关可获得关卡难度一致的学习章。',
        '每关卡共10级难度。',
        '可双击要学习的关卡进入，也可选中后点击开始。',
        '积分是指成功通关的关卡次数。',
        '进入关卡后，可看到当前难度的被保护的字母的血条，及任务时间，你需要在规定时间内将血条恢复到100分。',
        '点击正确的音节时，将+10分，错误的将根据难度扣分。',
        '目前数据没有同步到服务器，数据仅保存在本地。',
    ]

    const audioPlayerRef = useRef<{ play: () => void }>(null)
    // 在 HomePage 组件内
    useEffect(() => {
        if (selectedItem) {
            // 只有选中且已解锁才播放
            if (progress[`${activeCategory}_${selectedItem.key}`]) {
                // audioPlayerRef.current?.play()
                if (audioPlayerRef.current) {
                    audioPlayerRef.current.play()
                } else {
                    console.warn('Audio player ref is not set')
                }
            }
        }
    }, [selectedItem])


    useDidShow(() => {
        // 返回时刷新金币和积分
        const saved = Taro.getStorageSync('user_stats')
        console.log('[HomePage useDidShow] 读取 user_stats:', saved)
        if (saved) {
            const { coins = 0, score = 0 } = JSON.parse(saved)
            setCoins(coins)
            setScore(score)
        }
        // 刷新关卡解锁进度
        const savedProgress = Taro.getStorageSync(STORAGE_KEY)
        console.log('[HomePage useDidShow] 读取关卡进度:', savedProgress)
        if (savedProgress) {
            setProgress(typeof savedProgress === 'string' ? JSON.parse(savedProgress) : savedProgress)
        }
    })

    useEffect(() => {
        const saved = Taro.getStorageSync('user_stats')
        console.log('[HomePage useEffect] 读取 user_stats:', saved)
        if (saved) {
            const { coins = 0, score = 0 } = JSON.parse(saved)
            setCoins(coins)
            setScore(score)
        }
        // 刷新关卡解锁进度
        const savedProgress = Taro.getStorageSync(STORAGE_KEY)
        console.log('[HomePage useEffect] 读取关卡进度:', savedProgress)
        if (savedProgress) {
            setProgress(typeof savedProgress === 'string' ? JSON.parse(savedProgress) : savedProgress)
        }
    }, [])


    return (
        <View className="home-page">


            <PhoneticAudioPlayer
                ref={audioPlayerRef}
                src={selectedItem ? require(`../../assets/audio/${selectedItem.audio}`) : ''} // 注意require
                repeat={3}
            />
            <View className="background">
                <Canvas
                    type="2d"
                    id="gameCanvas"
                    className="game-canvas"
                />
            </View>

            <View className="content">

                {/* const [showHelp, setShowHelp] = useState(false) */}

                <View className="help-btn" onClick={() => setShowHelp(true)}>?</View>
                {showHelp && (
                    <View className="help-modal">
                        <View className="help-content">
                            <View className="help-title">帮助说明</View>
                            <View className="help-text">
                                {helpLines.map(line => <View key={line}>{line}</View>)}
                            </View>

                            <View className="help-close" onClick={() => setShowHelp(false)}>知道啦</View>
                        </View>
                    </View>
                )}






                <View className={`title colorful-text-${Math.floor(Math.random() * 10)}`}>守护拼音</View>
                <View className="stats-bar">
                    <View className="coin">学习章：{coins}</View>
                    <View className="score">通关次数：{score}</View>
                </View>

                <View className="categories">
                    {phoneticData.map((category, idx) => {
                        const colorIdx = Math.floor(Math.random() * 10)
                        return (
                            <View
                                key={category.id}
                                className={`category-button colorful-bg-${colorIdx} ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category.id)}
                            >
                                <View className="category-name">{category.name}</View>
                            </View>
                        )
                    })}
                </View>

                <View className="current-section">
                    {/* <View className="section-title">
                        {phoneticData.find(c => c.id === activeCategory)?.name}
                    </View> */}
                    <View className="items-grid">

                        {getVisibleItems(activeCategory).map((item, idx) => {
                            // 让每次刷新都随机
                            const colorIdx = Math.floor(Math.random() * 10)
                            const level = getItemLevel(activeCategory, item.key) // 这里补上
                            return (
                                <View
                                    key={item.key}
                                    className={`item colorful-bg-${colorIdx} ${!progress[`${activeCategory}_${item.key}`] ? 'locked' : ''} ${(selectedItem && selectedItem.key === item.key) ? 'selected' : ''}`}
                                    // className={`item colorful-bg-${colorIdx} ${!progress[`${activeCategory}_${item.key}`] ? 'locked' : ''} ${selectedItem?.key === item.key ? 'selected' : ''}`}
                                    onClick={() => handleItemClick(item)}
                                >
                                    <View className={`item-content colorful-${colorIdx}`}>
                                        {item.key}
                                    </View>
                                    {!progress[`${activeCategory}_${item.key}`]
                                        ? <View className="lock-icon">🔒</View>
                                        : <View className="difficulty-level">{level}</View>
                                    }
                                </View>
                            )
                        })}
                    </View>
                </View>

                <View
                    className={`start-button ${!selectedItem ? 'disabled' : ''}`}
                    onClick={handleStartGame}
                >
                    开始学习
                </View>

                <View className="share-btn" openType="share" style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: '#faad14',
                    color: '#fff',
                    borderRadius: 20,
                    padding: '8px 18px',
                    fontWeight: 'bold',
                    fontSize: 18
                }}>
                    分享
                </View>
            </View>
        </View>
    )


}


export default HomePage