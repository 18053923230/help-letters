import { View } from '@tarojs/components'
import { useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { difficultyLevels } from '../../config/gameConfig'
import { phoneticData } from '../../config/phoneticData'
import './index.scss'

const GamePage: React.FC = () => {
  const router = useRouter()
  const [health, setHealth] = useState(60)
  const [options, setOptions] = useState<string[]>([])
  const [currentItem, setCurrentItem] = useState<any>(null)
  const [gameConfig, setGameConfig] = useState(difficultyLevels[0])

  useDidShow(() => {
    const { category, key } = router.params
    initGame(category, key)
  })

  const initGame = (category: string, key: string) => {
    const categoryData = phoneticData.find(c => c.id === category)
    const item = categoryData?.items.find(i => i.key === key)
    if (!item) return

    setCurrentItem(item)
    // 初始化游戏配置
    // ...
  }

  // ... 添加游戏逻辑

  return (
    <View className="game-page">
      <View className="health-bar">
        <View className="health-value" style={{ width: `${health}%` }} />
      </View>

      <View className="current-letter">
        {currentItem?.key}
      </View>

      <View className="options-container">
        {options.map((option, index) => (
          <View key={index} className="option-item" draggable>
            {option}
          </View>
        ))}
      </View>
    </View>
  )
}

export default GamePage