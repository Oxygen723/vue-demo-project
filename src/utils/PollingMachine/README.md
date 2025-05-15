# 定时轮询函数

### 一、创建

```javascript
// 1.导入定时器（一般在App.vue导入）
import timer from "@/utils/PollingMachine";
// 创建定时器
timer.setTimer();
```

### 二、使用

#### 1.添加轮询函数

```javascript
timer.addFun(); // 传入需要轮询的函数 (重复添加会覆盖)
```

#### 2.移除轮询函数

```javascript
timer.delFun(); // 传入需要移除的轮询函数 (函数需与添加的函数一致)
```

#### 3.停止轮询

```javascript
timer.clearTimer();
```
