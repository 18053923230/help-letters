import { Canvas, View } from '@tarojs/components'
import Taro, { createSelectorQuery, getStorageSync, setStorageSync, useDidShow } from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import { phoneticData } from '../../config/phoneticData'
import { difficultyLevels } from '../../config/gameConfig'
import './index.scss'

const STORAGE_KEY = 'phonetic_progress'

const HomePage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('initials')
    const canvasRef = useRef<any>(null)
    const [progress, setProgress] = useState<{ [key: string]: boolean }>({})
    const [selectedItem, setSelectedItem] = useState<PhoneticItem | null>(null)


    useEffect(() => {
        initCanvas()
        initProgress()
        return () => cleanup()
    }, [])

    useDidShow(() => {
        // 返回时刷新进度
        initProgress()
    })

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
        const items = phoneticData.find(c => c.id === category)?.items || []

        // 找到最后一个解锁的项目的索引
        const lastUnlockedIndex = items.reduce((maxIndex, item, index) => {
            const isUnlocked = progress[`${category}_${item.key}`]
            return isUnlocked ? index : maxIndex
        }, -1)

        // 返回所有解锁的项目，以及下一个待解锁的项目
        return items.filter((_, index) => index <= lastUnlockedIndex + 1)
    }



    const handleStartGame = () => {
        console.log('Start game clicked, selected item:', selectedItem)
        if (!selectedItem) {
            console.log('No item selected, returning')
            return
        }
        Taro.navigateTo({
            url: `/pages/game/index?category=${activeCategory}&key=${selectedItem.key}`
        })
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
    }

    return (
        <View className="home-page">
            <View className="background">
                <Canvas
                    type="2d"
                    id="gameCanvas"
                    className="game-canvas"
                />
            </View>

            <View className="content">
                <View className="title">拼音学习</View>

                <View className="categories">
                    {phoneticData.map(category => renderCategoryButton(category))}
                </View>

                <View className="current-section">
                    {/* <View className="section-title">
                        {phoneticData.find(c => c.id === activeCategory)?.name}
                    </View> */}
                    <View className="items-grid">

                        {getVisibleItems(activeCategory).map(item => {
                            const level = getItemLevel(activeCategory, item.key)
                            return (
                                <View
                                    key={item.key}
                                    className={`item ${!progress[`${activeCategory}_${item.key}`] ? 'locked' : ''} ${selectedItem?.key === item.key ? 'selected' : ''}`}
                                    onClick={() => handleItemClick(item)}
                                >
                                    <View className="item-content">
                                        {item.key}

                                    </View>
                                    {!progress[`${activeCategory}_${item.key}`] &&
                                        <View className="lock-icon">🔒</View> || <View className="difficulty-level">{level}</View>
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
                    开始游戏
                </View>
            </View>
        </View>
    )
}

export default HomePage