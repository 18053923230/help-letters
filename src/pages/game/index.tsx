import { View } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useState, useRef } from 'react'
import { phoneticData } from '../../config/phoneticData'
import './index.scss'
import PhoneticAudioPlayer from '../../components/PhoneticAudioPlayer'
import { difficultyLevels } from '../../config/gameConfig'

const GAME_WIDTH = 375
const GAME_HEIGHT = 600
const RUNNER_SIZE = 60
const OBSTACLE_SIZE = 54
const LANE_COUNT = 3
const OBSTACLE_INTERVAL = 2000 // ms

const STORAGE_KEY = 'user_stats'

const GamePage: React.FC = () => {
    const audioPlayerRef = useRef<{ play: () => void }>(null)
    const router = useRouter()
    const category = router.params.category
    const key = router.params.key
    const level = Number(router.params.level) || 1
    const gameConfig = difficultyLevels[level - 1]

    const categoryData = phoneticData.find(c => c.id === category)
    const item = categoryData && categoryData.items.find(i => i.key === key)
    const audio = item && item.audio

        const obstacleSpeed = 8 + (level - 1) * 2 // 或直接用 gameConfig.obstacleSpeed

    // 跑道分3条，0左1中2右
    const [runnerLane, setRunnerLane] = useState(1)
    const [obstacles, setObstacles] = useState<any[]>([])
    const [score, setScore] = useState(gameConfig.correctBonus) // 初始分数
    const [coins, setCoins] = useState(0)
    const [health, setHealth] = useState(gameConfig.initialHealth)
    const [timeLeft, setTimeLeft] = useState(gameConfig.timeLimit)
    const [isPlaying, setIsPlaying] = useState(false)
    const gameTimer = useRef<any>(null)
    const obstacleTimer = useRef<any>(null)
    const timeTimer = useRef<any>(null)

    // 读取本地分数和金币
    useEffect(() => {
        const saved = Taro.getStorageSync(STORAGE_KEY)
        if (saved) {
            const { coins = 0, score = 0 } = JSON.parse(saved)
            setCoins(coins)
            setScore(score)
        }
    }, [])

    // 随机色生成函数
    function getRandomColor() {
        const colors = [
            '#ffd966', '#8fd9b6', '#a4c8f0', '#f7a072', '#e6a0c4', '#f9c784', '#b5ead7', '#ffb7b2', '#b2cefe'
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }
    
    // 生成一组障碍物（每次至少2个，且只有1个正确，初始y更高）
    const generateObstacles = () => {
        if (!categoryData || !item) return []
        const allItems = categoryData.items
        const optionCount = Math.max(2, Math.min(gameConfig.optionsCount, LANE_COUNT))
        const wrongs = allItems.filter(i => i.key !== item.key)
        const shuffled = wrongs.sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, optionCount - 1)
        const lanes = Array.from({ length: LANE_COUNT }, (_, i) => i).sort(() => Math.random() - 0.5)
    
        // 生成一组障碍物（1个正确+其余错误）
        const startY = -OBSTACLE_SIZE
        const obs = Array(LANE_COUNT).fill(0).map((_, i) => ({
            key: '',
            type: 'empty',
            lane: i,
            y: startY,
            color: 'transparent'
        }))
        obs[lanes[0]] = {
            key: item.key,
            type: 'right',
            lane: lanes[0],
            y: startY,
            color: getRandomColor()
        }
        selected.forEach((opt, idx) => {
            obs[lanes[idx + 1]] = {
                key: opt.key,
                type: 'wrong',
                lane: lanes[idx + 1],
                y: startY,
                color: getRandomColor()
            }
        })
    
        // 生成3行全空白（y依次递增）
        const emptyRows = 30
        const emptyGroups = []
        for (let i = 1; i <= emptyRows; i++) {
            emptyGroups.push(
                Array(LANE_COUNT).fill(0).map((_, lane) => ({
                    key: '',
                    type: 'empty',
                    lane,
                    y: startY - i * OBSTACLE_SIZE * 1.2,
                    color: 'transparent'
                }))
            )
        }
    
        // 返回：先3行空白，再障碍物组
        return [...emptyGroups.flat(), ...obs]
    }
    // 主循环
    useEffect(() => {
        if (!isPlaying) return
        // 障碍物生成
        obstacleTimer.current = setInterval(() => {
            setObstacles(prev => [...prev, ...generateObstacles()])
        }, OBSTACLE_INTERVAL)
        // 障碍物下落
        gameTimer.current = setInterval(() => {
            setObstacles(prev =>
                prev
                    .map(o => ({ ...o, y: o.y + 8 }))
                    .filter(o => o.y < GAME_HEIGHT + OBSTACLE_SIZE)
            )
        }, 100)
        // 倒计时
        timeTimer.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    handleGameOver()
                    return 0
                }
                return t - 1
            })
        }, 1000)
        return () => {
            clearInterval(gameTimer.current)
            clearInterval(obstacleTimer.current)
            clearInterval(timeTimer.current)
        }
    }, [isPlaying])

    // 碰撞检测
    useEffect(() => {
        if (!isPlaying) return
        obstacles.forEach(o => {
            if (
                o.type !== 'empty' &&
                o.y > GAME_HEIGHT - RUNNER_SIZE * 2 &&
                o.lane === runnerLane
            ){
                // 碰撞
                if (o.type === 'right') {
                    setScore(s => {
                        const newScore = s + gameConfig.correctBonus
                        if (newScore >= 100) {
                            handleGameOver(true)
                        }
                        return newScore
                    })
                    setHealth(h => Math.min(100, h + 10))
                    audioPlayerRef.current?.play() // 正确才发音
                } else {
                    setScore(s => Math.max(0, s - (gameConfig.wrongPenalty || 5)))
                    setHealth(h => {
                        const newHealth = Math.max(0, h - 20)
                        if (newHealth <= 0) handleGameOver(false)
                        return newHealth
                    })
                    // 播放错误音效
                    playWrongAudio()
                }
                setObstacles(prev => prev.filter(x => x !== o))
            }
        })
    }, [obstacles, runnerLane, isPlaying])

    // 开始游戏
    useDidShow(() => {
        setIsPlaying(true)
        setScore(gameConfig.correctBonus)
        setHealth(gameConfig.initialHealth)
        setTimeLeft(gameConfig.timeLimit)
        setObstacles([])
        setRunnerLane(1)
    })

    // 左右移动
    const handleLeft = () => setRunnerLane(l => Math.max(0, l - 1))
    const handleRight = () => setRunnerLane(l => Math.min(LANE_COUNT - 1, l + 1))

    // 游戏结束
    const handleGameOver = (success?: boolean) => {
        setIsPlaying(false)
        let newCoins = coins
        let newScore = score
        if (success) {
            newCoins += level
            newScore += 1
            Taro.showToast({ title: '恭喜过关！', icon: 'success' })
        } else {
            newScore = Math.max(0, newScore - 2)
            Taro.showToast({ title: '游戏结束', icon: 'none' })
        }
        setCoins(newCoins)
        setScore(newScore)
        Taro.setStorageSync(STORAGE_KEY, JSON.stringify({ coins: newCoins, score: newScore }))
        setTimeout(() => Taro.navigateBack(), 1500)
    }

    // 点击血条播放音频3次
    const [healthAudioRepeat, setHealthAudioRepeat] = useState(1)
    const handleHealthClick = () => {
        setHealthAudioRepeat(3)
        setTimeout(() => {
            audioPlayerRef.current?.play()
        }, 0)
    }
    const handleAudioEnd = () => setHealthAudioRepeat(1)

    // 跑道宽度
    const laneWidth = GAME_WIDTH / LANE_COUNT
    const playWrongAudio = () => {
        // 播放oh,no或系统音
        const wrongAudio = require('../../assets/audio/ohno.mp3') // 你需要准备这个音频文件
        const audioCtx = Taro.createInnerAudioContext()
        audioCtx.src = wrongAudio
        audioCtx.play()
        audioCtx.onEnded(() => audioCtx.destroy())
        audioCtx.onError(() => audioCtx.destroy())
    }

    return (
        <View className="game-page" style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto', background: '#e6f7ff', position: 'relative', overflow: 'hidden' }}>
            <PhoneticAudioPlayer
                ref={audioPlayerRef}
                src={audio ? require(`../../assets/audio/${audio}`) : ''}
                repeat={healthAudioRepeat}
                onEnd={handleAudioEnd}
            />
            <View className="health-container" onClick={handleHealthClick}>
                <View className="health-bar">
                    <View className="health-value" style={{ width: `${health}%` }} />
                </View>
                <View className="health-text">{Math.round(health)}%</View>
            </View>
            <View className="timer-big">{timeLeft}s</View>
            <View className="score-bar">得分：{score} 金币：{coins}</View>
            {/* 跑道 */}
            <View className="runway" style={{ position: 'absolute', left: 0, top: 100, width: GAME_WIDTH, height: GAME_HEIGHT - 100 }}>
                {/* 障碍物 */}
                            {obstacles.filter(o => o.type !== 'empty').map((o, idx) => (
                    <View
                        key={idx}
                        className="obstacle"
                        style={{
                            position: 'absolute',
                            left: o.lane * laneWidth + laneWidth / 2 - OBSTACLE_SIZE / 2,
                            top: o.y,
                            width: OBSTACLE_SIZE,
                            height: OBSTACLE_SIZE,
                            borderRadius: OBSTACLE_SIZE / 2,
                            background: o.color,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 32,
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
                        }}
                    >
                        {o.key}
                    </View>
                ))}
                {/* 主角 */}
                              <View
                    className="runner"
                    style={{
                        position: 'absolute',
                        left: runnerLane * laneWidth + laneWidth / 2 - RUNNER_SIZE / 2,
                        // top: GAME_HEIGHT - RUNNER_SIZE * 1.8, // 原来
                        top: GAME_HEIGHT - RUNNER_SIZE * 4.2,    // 上移到按钮上方
                        width: RUNNER_SIZE,
                        height: RUNNER_SIZE,
                        borderRadius: RUNNER_SIZE / 2,
                        background: '#1890ff',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 36,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 16px #91d5ff'
                    }}
                >
                    {item ? item.key : ''}
                </View>
            </View>
            {/* 左右按钮 */}
            <View className="control-bar" style={{ position: 'absolute', bottom: 20, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 40 }}>
                <View className="ctrl-btn" onClick={handleLeft} style={{ width: 60, height: 60, borderRadius: 30, background: '#faad14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#fff', fontWeight: 'bold', boxShadow: '0 2px 8px #faad14' }}>{'←'}</View>
                <View className="ctrl-btn" onClick={handleRight} style={{ width: 60, height: 60, borderRadius: 30, background: '#faad14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#fff', fontWeight: 'bold', boxShadow: '0 2px 8px #faad14' }}>{'→'}</View>
            </View>
        </View>
    )
}

export default GamePage