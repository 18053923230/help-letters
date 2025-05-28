import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import ThreeScene from '../../components/ThreeScene'
import './index.scss'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <ThreeScene />
    </View>
  )
}