# rn-swipeout-nyc

```javascript
npm install rn-swipeout-nyc

import Swipeout from 'rn-swipeout-nyc'
```

```html
<Swipeout
  distance={100}
  onOpen={() => console.log('open')}
  onClose={() => console.log('close')}
  actionBtn={
    <Button onPress={() => this.addTodo()} title="删除" color="#999" />
  }
  isSwipeout={true}
  style={styles.testTouch}>
  <Text>你好！</Text>
</Swipeout>

```

| 属性       | 默认值    | 是否必填 | 描述               |
| ---------- | --------- | -------- | ------------------ |
| distance   | 80        | 否       | 向左滑开最大距离   |
| actionBtn  | undefined | 否       | 滑动开后看到的内容 |
| isSwipeout | true      | 否       | 是否可以打开       |

| 事件    | 默认值    | 是否必填 | 描述             |
| ------- | --------- | -------- | ---------------- |
| onOpen  | undefined | 否       | 滑动开始回掉事件 |
| onClose | undefined | 否       | 滑动关闭回掉事件 |
