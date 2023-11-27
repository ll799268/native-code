# Vue、React 语法差异

## 1、DOM是否真实的渲染

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
    import { useState } from 'react'
    const [isShow, setIsShow] = useState(true)

    return (
      isShow && <p>我真正被渲染出来了</p>
    )
  ```

## 2、DOM通过样式控制显示隐藏

* Vue

  ```js
    <template>
      <p v-show="isShow">我显示出来了</p>
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
    import { useState } from 'react'
    const [isShow, setIsShow] = useState(true)

    return (
      <p style={ isShow ? {} : { display: 'none' } }>我显示出来了</p>
    )
  ```

## 3、循环列表

* Vue

```js
  <template>
    <ul>
      <li v-for="item of list" 
        :key="item.id">
        {{ item.txt }}
      </li>
    </ul>
  </template>
  <script>
    export default {
      data () {
        return {
          list: [
            {
              id: 0,
              txt: '列表一'
            }
          ]
        }
      }
    }
  </script>
```

* React

```js
  import { useState } from 'react'
  const [list, setList] = useState([
    {
      id: 0,
      txt: '列表一'
    }
  ])

  return (
    <ul>
      !!list.length && list.map(item => {
        return (
          <li key={ item.id }>
            { item.txt }
          </li>
        )
      })
    </ul>
  )
```

## 4、计算属性(带缓存)

* Vue

  ```js
    <template>
      <p>{{ name }}</p>
    </template>
    <script>
      export default {
        data () {
          nativeName: '张'
        },
        computed: {
          name () {
            return this.nativeName + '三'
          }
        }
      }
    </script>
  ```

* React

  ```js
    import { useState, useMemo } from 'react'
    const [nativeName, setNativeName] = useState('张')

    const name = useMemo(() => {
      return nativeName + '三'
    }, [nativeName])

    return (
      <p>{ name }</p>
    )

  ```

## 5、监听数据变化

* Vue

  ```js
    <template>
      <p>{{ nativeName }}</p>
    </template>
    <script>
      export default {
        data () {
          nativeName: '张'
        },
        watch: {
          name (newVal) {
            this.nativeName = this.nativeName + '三'
          }
        }
      }
    </script>
  ```

* React

  ```js
    import { useState, useEffect } from 'react'

    const [name, setName] = useState('张')
    const [switch, setSwitch] = useState(false)


    useEffect(() => {
      setName(prev => prev + '三')      
    }, [switch])

    return (
      <>
        <button @click={ () => setSwitch(true) }>改变名字</button>
        <p>{ name }</p>
      </>
    )
  ```

## 6、行内样式

* Vue

  ```js
    <template>
      <p :style="[style1, style2]">{{ nativeName }}</p>
    </template>
    <script>
      export default {
        data () {
          return {
            style1: {
              color: 'red'
            },
            style2: {
              borderRadius: '10px'
            }
          }
        }
      }
    </script>
  ```

* React

  ```js
    const style1 = {
      color: 'red'
    },
      style2 = {
        borderRadius: '10px'
      }
    
    return (
      <p style={ { ...style1, ...style2 } }></p>
    )
  ```

## 6、添加class

* Vue

  ```js
    <template>
      <p :class="['title', isActive ? 'active' : '']"></p>
    </template>
    <script>
      export default {
        data () {
          return {
            isActive: true
          }
        }
      }
    </script>
  ```

* React

  ```js
    import { useState } from 'react'
    const [isActive, setIsActive] = useState(false)
    return (
      <p class={ 'title ' + isActive ? 'active' : '' }></p>
    )
  ```

## 7、slot

* Vue

  ```js
    // Parent.vue
    <template>
      <div>
        <slot></slot>
      </div>
    </template>

    // Child.vue
    <template>
      <Parent>
        <p>来了~</p>
      </Parent>
    </template>

    <script>
      import Parent from 'Parent.vue'
      export default {
        components: { Parent }
      }
    </script>
  ```

* React

  ```js
    // Parent.jsx
    const Parent = props => {
      const { child } = props
      return (
        <div>
          { child }
        </div>
      )
    }

    // Child.jsx
    import Parent from 'Parent.jsx'
    const Child = () => {
      return (
        <Parent>
          <p>插槽内容</p>
        </Parent>
      )
    }
  ```
