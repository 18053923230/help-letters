import { View } from '@tarojs/components'
import Taro,{ useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useState,useRef } from 'react'
import { difficultyLevels } from '../../config/gameConfig'
import { phoneticData } from '../../config/phoneticData'
import './index.scss'

interface GameState {
    isPlaying: boolean;
    timeLeft: number;
    currentLevel: number;
  }

const GamePage: React.FC = () => {
    const router = useRouter()
    const [health, setHealth] = useState(60)
    const [options, setOptions] = useState<string[]>([])
    const [currentItem, setCurrentItem] = useState<PhoneticItem | null>(null)
    const [gameConfig, setGameConfig] = useState<DifficultyLevel>(difficultyLevels[0])
    const [gameState, setGameState] = useState<GameState>({
      isPlaying: false,
      timeLeft: 10,
      currentLevel: 1
    })
    
    const healthDecayTimer = useRef<NodeJS.Timer | null>(null)
    const timeLeftTimer = useRef<NodeJS.Timer | null>(null)
    const audioContext = useRef<Taro.AudioContext | null>(null)


    // 清理定时器
  const cleanup = () => {
    if (healthDecayTimer.current) {
      clearInterval(healthDecayTimer.current)
      healthDecayTimer.current = null
    }
    if (timeLeftTimer.current) {
      clearInterval(timeLeftTimer.current)
      timeLeftTimer.current = null
    }
    if (audioContext.current) {
      audioContext.current.destroy()
      audioContext.current = null
    }
  }

  useDidShow(() => {
    const { category, key } = router.params
    initGame(category, key)
  })

const initGame = (category: string, key: string) => {
  cleanup()
  const categoryData = phoneticData.find(c => c.id === category)
  const item = categoryData?.items.find(i => i.key === key)
  if (!item) return

  // 读取本地难度
  const progress = Taro.getStorageSync('phonetic_progress')
  let level = 1
  if (progress) {
    const parsed = typeof progress === 'string' ? JSON.parse(progress) : progress
    level = parsed[`${category}_${key}_level`] || 1
  }
  const config = difficultyLevels[level - 1]

  setCurrentItem(item)
  setGameConfig(config)
  setHealth(config.initialHealth)
  setGameState(prev => ({
    ...prev,
    currentLevel: level,
    timeLeft: config.timeLimit
  }))
  generateOptions(item, categoryData?.items || [], config.optionsCount)
  audioContext.current = Taro.createInnerAudioContext()
  audioContext.current.src = `/assets/audio/${category}/${item.audio}`
  startGame(level, config.timeLimit) // 传递level和timeLimit
}

  const generateOptions = (currentItem: PhoneticItem, allItems: PhoneticItem[], count: number) => {
    console.log('Generating options:', { currentItem, count })
    const availableItems = allItems.filter(item => item.key !== currentItem.key)
    const shuffled = availableItems.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, count - 1)
    const options = [...selected, currentItem].sort(() => Math.random() - 0.5)
    console.log('Generated options:', options)
    setOptions(options.map(item => item.key))
  }

// 开始游戏
const startGame = (level: number, timeLimit: number) => {
    console.log('Starting game with config:', gameConfig)
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      timeLeft: timeLimit,
      currentLevel: level
    }))

    // 开始血条下降
    healthDecayTimer.current = setInterval(() => {
      setHealth(prev => {
        const newHealth = Math.max(0, prev - gameConfig.healthDecay)
        console.log('Health updated:', newHealth)
        if (newHealth <= 0) {
          handleGameOver(false)
        }
        return newHealth
      })
    }, 1000)

    // 开始倒计时
    timeLeftTimer.current = setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeLeft - 1
        console.log('Time left:', newTime)
        if (newTime <= 0) {
          handleGameOver(false)
        }
        return { ...prev, timeLeft: newTime }
      })
    }, 1000)
  }

  const startHealthDecay = () => {
    if (healthDecayTimer.current) {
      clearInterval(healthDecayTimer.current)
    }
  
    console.log('Starting health decay...')
    healthDecayTimer.current = setInterval(() => {
      setHealth(prev => {
        const newHealth = Math.max(0, prev - gameConfig.healthDecay)
        console.log('Health updated:', newHealth)
        if (newHealth >= 100) {
          handleGameOver(true) // 满分成功
        } else if (newHealth <= 0) {
          handleGameOver(false) // 血量耗尽失败
        }
        return newHealth
      })
    }, 1000)
  }

  const startCountdown = () => {
    if (timeLeftTimer.current) {
      clearInterval(timeLeftTimer.current)
    }
  
    console.log('Starting countdown...')
    setGameState(prev => ({ ...prev, timeLeft: gameConfig.timeLimit }))
  
    timeLeftTimer.current = setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeLeft - 1
        console.log('Time left:', newTime)
        if (newTime <= 0) {
          handleGameOver(false)
        }
        return { ...prev, timeLeft: newTime }
      })
    }, 1000)
  }

const handleGameOver = (success: boolean) => {
  console.log('Game over:', { success })
  cleanup()
  if (success) {
  const STORAGE_KEY = 'phonetic_progress'
  const progress = Taro.getStorageSync(STORAGE_KEY) ? JSON.parse(Taro.getStorageSync(STORAGE_KEY)) : {}
  const category = router.params.category
  const key = router.params.key
  const progressKey = `${category}_${key}`

  // 读取当前难度
  let currentLevel = progress[`${progressKey}_level`] || 1
  let nextLevel = currentLevel + 1
  let updated = false

  // 1. 难度+1
  progress[`${progressKey}_level`] = nextLevel
  updated = true

  // 2. 如果当前难度大于2，解锁下一个音节
  if (nextLevel > 2) {
    const categoryData = phoneticData.find(c => c.id === category)
    if (categoryData) {
      const idx = categoryData.items.findIndex(i => i.key === key)
      if (idx !== -1 && idx + 1 < categoryData.items.length) {
        const nextKey = categoryData.items[idx + 1].key
        progress[`${category}_${nextKey}`] = true
      }
    }
  }

  if (updated) {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(progress))
    console.log('Progress updated:', progress)
  }

  Taro.showToast({ title: '恭喜过关！', icon: 'success' })
  setTimeout(() => {
    Taro.navigateBack()
  }, 1500)
}else {
    Taro.showToast({ title: '挑战失败', icon: 'error' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }
}

    const handleDragStart = (option: string) => {
    console.log('Drag started:', option)
  }

  // 答案处理
  const handleDrop = (option: string) => {
    console.log('Item dropped:', option)
    if (option === currentItem?.key) {
      // 正确答案
      if (audioContext.current) {
        audioContext.current.play()
      }
      setHealth(prev => {
        const newHealth = Math.min(100, prev + gameConfig.correctBonus)
        if (newHealth >= 100) {
          handleGameOver(true)
        }
        return newHealth
      })
      generateOptions(currentItem!, phoneticData.find(c => c.id === router.params.category)?.items || [], gameConfig.optionsCount)
    } else {
      // 错误答案
      setHealth(prev => {
        const newHealth = Math.max(0, prev - gameConfig.healthDecay * 2)
        if (newHealth <= 0) {
          handleGameOver(false)
        }
        return newHealth
      })
    }
  }


  useEffect(() => {
    return cleanup
  }, [])

  const handleOptionClick = (option: string) => {
    console.log('Option clicked:', option)
    handleDrop(option) // 复用原来的处理逻辑
  }
  



    return (
        <View className="game-page">
          <View className="health-container">
            <View className={`health-bar ${
              health > 80 ? 'high' : health < 30 ? 'low' : 'medium'
            }`}>
              <View 
                className="health-value" 
                style={{ width: `${health}%` }} 
              />
            </View>
            <View className="health-text">{Math.round(health)}%</View>
          </View>
    
          <View className="main-content">
            <View className="current-letter">
              <View className="letter">{currentItem?.key}</View>
              <View className="level-indicator">{gameState.currentLevel}</View>
            </View>
    
            <View className="game-info">
              <View className="timer">剩余时间: {gameState.timeLeft}s</View>
            </View>
    
            <View className="options-container">
              {options.map((option, index) => (
                <View 
                  key={index} 
                  className="option-item"
                  draggable
                  onDragStart={() => handleDragStart(option)}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </View>
              ))}
            </View>
          </View>
        </View>
      )
}

export default GamePage