## Vue、React 语法差异

### 1、DOM是否真实的渲染
* Vue
  ```js
    <template>
      <p v-if="isShow">我真正被渲染出来了</p>
    </template>
    <script>
      export default {
        data () {
          return {
            isShow: true
          }
        }
      }
    </script>
  ```
* React
  ```js
    const { useState } from 'react'
    const [isShow, setIsShow] = useState(true)
    
    return (
      isShow && <p>我真正被渲染出来了</p>
    )
  ```