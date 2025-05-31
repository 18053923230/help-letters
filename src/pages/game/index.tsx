import { View, Text } from '@tarojs/components'
import Taro, { useDidShow, useRouter,useShareAppMessage ,useShareTimeline} from '@tarojs/taro'
import { useEffect, useState, useRef } from 'react'
import { phoneticData } from '../../config/phoneticData'
import './index.scss'
import PhoneticAudioPlayer from '../../components/PhoneticAudioPlayer'
import { difficultyLevels } from '../../config/gameConfig'

const GAME_WIDTH = 375
const GAME_HEIGHT = 700
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
    const timeLeftTimer = useRef<NodeJS.Timer | null>(null)
    const healthDecayTimer = useRef<NodeJS.Timer | null>(null)
    const audioContext = useRef<Taro.InnerAudioContext | null>(null)
    const gameState = useRef({
        currentLevel: level,
        category: category,
        key: key,
        item: item,
        audio: audio
    })

    useShareAppMessage(() => ({
        title: '守护拼音小游戏，快来挑战！',
        path: '/pages/game/index',
        // imageUrl: '' // 可选：自定义分享图片
    }))

    useShareTimeline(() => ({
        title: '守护拼音小游戏，快来挑战！'
    }))



    useEffect(() => {
        audioContext.current = Taro.createInnerAudioContext()
        if (gameState.current.audio) {
            audioContext.current.src = gameState.current.audio
        }
        return () => {
            audioContext.current?.destroy()
        }
    }, [gameState.current.audio])

    const obstacleSpeed = 10 + (level - 1) * 6// 或直接用 gameConfig.obstacleSpeed

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
    const generateObstacles = (currentObstacles: any[]) => {
        if (!categoryData || !item) return []
        const allItems = categoryData.items
        const optionCount = Math.max(2, Math.min(gameConfig.optionsCount, LANE_COUNT))
        const wrongs = allItems.filter(i => i.key !== item.key)
        const shuffled = wrongs.sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, optionCount - 1)
        const lanes = Array.from({ length: LANE_COUNT }, (_, i) => i).sort(() => Math.random() - 0.5)

        // 用最新的障碍物数组计算最小y
        let minY = 0
        if (currentObstacles.length > 0) {
            minY = Math.min(...currentObstacles.map(o => o.y))
        }
        const emptyRows = 6
        const baseY = minY - (emptyRows + 1) * OBSTACLE_SIZE

        // 生成空行
        const emptyGroups = []
        for (let i = emptyRows; i >= 1; i--) {
            emptyGroups.push(
                Array(LANE_COUNT).fill(0).map((_, lane) => ({
                    key: '',
                    type: 'empty',
                    lane,
                    y: baseY + OBSTACLE_SIZE * (i - emptyRows - 1),
                    color: 'transparent'
                }))
            )
        }

        // 生成一组障碍物
        const obs = Array(LANE_COUNT).fill(0).map((_, i) => ({
            key: '',
            type: 'empty',
            lane: i,
            y: baseY,
            color: 'transparent'
        }))
        obs[lanes[0]] = {
            key: item.key,
            type: 'right',
            lane: lanes[0],
            y: baseY,
            color: getRandomColor()
        }
        selected.forEach((opt, idx) => {
            obs[lanes[idx + 1]] = {
                key: opt.key,
                type: 'wrong',
                lane: lanes[idx + 1],
                y: baseY,
                color: getRandomColor()
            }
        })

        return [...emptyGroups.flat(), ...obs]
    }
    // 主循环
    useEffect(() => {
        if (!isPlaying) return
        // 障碍物生成
        obstacleTimer.current = setInterval(() => {
            setObstacles(prev => [...prev, ...generateObstacles(prev)])
        }, OBSTACLE_INTERVAL)
        // 障碍物下落
        gameTimer.current = setInterval(() => {
            setObstacles(prev =>
                prev
                    .map(o => ({ ...o, y: o.y + obstacleSpeed }))
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
                (o.type === 'right' || o.type === 'wrong') &&
                o.lane === runnerLane &&
                o.y + OBSTACLE_SIZE > GAME_HEIGHT - RUNNER_SIZE * 4.2 && // runner的top
                o.y < GAME_HEIGHT - RUNNER_SIZE * 4.2 + RUNNER_SIZE
            ) {
                // 碰撞
                if (o.type === 'right') {
                    setScore(s => {
                        const newScore = s + gameConfig.correctBonus
                        if (newScore >= 100) {
                            handleGameOver(true)
                        }
                        return newScore
                    })
                    setHealth(h => {
                        const newHealth = Math.min(100, h + gameConfig.correctBonus)
                        if (newHealth >= 100) {
                            handleGameOver(true)
                        }
                        return newHealth
                    })
                    audioPlayerRef.current?.play()
                } else {
                    setScore(s => Math.max(0, s - (gameConfig.wrongPenalty || 5)))
                    setHealth(h => {
                        const newHealth = Math.max(0, h - gameConfig.healthDecay)
                        console.log('Health updated:', newHealth)
                        if (newHealth <= 0) handleGameOver(false)
                        return newHealth
                    })
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
    const handleGameOver = (success: boolean) => {
        console.log('[handleGameOver] 游戏结束, success:', success)
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

            // 先读取本地
            const saved = Taro.getStorageSync('user_stats')
            let localCoins = 0
            let localScore = 0
            if (saved) {
                const { coins: c = 0, score: s = 0 } = JSON.parse(saved)
                localCoins = c
                localScore = s
            }
            let newCoins = localCoins + currentLevel
            let newScore = localScore + 1
            console.log('[handleGameOver] 本地金币:', localCoins, '当前难度:', currentLevel, '加后:', newCoins)
            saveStats(newCoins, newScore)

            // 2. 如果当前难度大于2，解锁下一个音节
            if (nextLevel > 2) { // 只在难度大于2时解锁
                const categoryData = phoneticData.find(c => c.id === category)
                if (categoryData) {
                    const idx = categoryData.items.findIndex(i => i.key === key)
                    if (idx !== -1 && idx + 1 < categoryData.items.length) {
                        const nextKey = categoryData.items[idx + 1].key
                        progress[`${category}_${nextKey}`] = true
                        console.log('[handleGameOver] 解锁下一个音节:', nextKey)
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
        } else {
            // let newScore = Math.max(0, score - 2)
            // saveStats(coins, newScore)
            Taro.showToast({ title: '挑战失败', icon: 'error' })
            setTimeout(() => {
                Taro.navigateBack()
            }, 1500)
        }
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

    const saveStats = (newCoins: number, newScore: number) => {
        console.log('[saveStats] 写入本地 user_stats:', { newCoins, newScore })
        setCoins(newCoins)
        setScore(newScore)
        Taro.setStorageSync('user_stats', JSON.stringify({ coins: newCoins, score: newScore }))
    }

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
                        {/* <View className="score-bar" style={{
                margin: '12px auto 0 auto',
                fontSize: 26,
                color: '#faad14',
                fontWeight: 'bold',
                background: 'rgba(255,255,255,0.92)',
                borderRadius: 16,
                padding: '8px 28px',
                boxShadow: '0 2px 8px #ffe58f',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 320,
                letterSpacing: 2,
            }}>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                    得分：<Text style={{ color: '#ff4d4f', fontSize: 28, fontWeight: 700, marginLeft: 4 }}>{score}</Text>
                </View>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                    金币：<Text style={{ color: '#52c41a', fontSize: 28, fontWeight: 700, marginLeft: 4 }}>{coins}</Text>
                </View>
            </View> */}
            <View className="timer-big" style={{
                margin: '10px auto 0 auto',
                fontSize: 38,
                fontWeight: 'bold',
                color: '#ff4d4f',
                textAlign: 'center',
                letterSpacing: 4,
                textShadow: '1px 1px 4px #fff, 0 2px 8px #ffbaba',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 12,
                padding: '2px 24px',
                display: 'inline-block',
                minWidth: 80
            }}>{timeLeft}s</View>



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
            <View className="control-bar" style={{
                position: 'absolute',
                bottom: 10,
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'auto',
                padding: '0 10px',
            }}>
                <View className="ctrl-btn" onClick={handleLeft} style={{
                    width: 60, height: 60, borderRadius: 30, background: '#faad14',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, color: '#fff', fontWeight: 'bold', boxShadow: '0 2px 8px #40e70d', marginRight: 20
                }}>{'←'}</View>
                <View className="ctrl-btn" onClick={handleRight} style={{
                    width: 60, height: 60, borderRadius: 30, background: '#faad14',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, color: '#fff', fontWeight: 'bold', boxShadow: '0 2px 8px #fa3a14', marginLeft: 20
                }}>{'→'}</View>
            </View>


        </View>
    )
}

export default GamePage