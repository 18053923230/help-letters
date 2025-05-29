import { useRef, useImperativeHandle, forwardRef } from 'react'
import Taro from '@tarojs/taro'

interface Props {
  src: string
  repeat?: number
  onEnd?: () => void
}

const PhoneticAudioPlayer = forwardRef(({ src, repeat = 1, onEnd }: Props, ref) => {
  const playCount = useRef(0)
  const audioRef = useRef<Taro.InnerAudioContext | null>(null)

  const play = () => {
    if (audioRef.current) {
      audioRef.current.destroy()
      audioRef.current = null
    }
    playCount.current = 0
    playOnce()
  }

  const playOnce = () => {
    playCount.current += 1
    const audio = Taro.createInnerAudioContext()
    audioRef.current = audio
    audio.src = src
    audio.play()
    audio.onEnded(() => {
      if (playCount.current < repeat) {
        playOnce()
      } else {
        audio.destroy()
        audioRef.current = null
        onEnd && onEnd()
      }
    })
    audio.onError(() => {
      audio.destroy()
      audioRef.current = null
      onEnd && onEnd()
    })
  }

  useImperativeHandle(ref, () => ({
    play
  }))

  return null
})

export default PhoneticAudioPlayer