import React, { PureComponent } from "react"
import { View, Text, StyleSheet, PanResponder } from "react-native"

//通过方法创建实例触摸事件
const panResponderCreate = function(
    onPanResponderGrant,
    onPanResponderMove,
    onPanResponderRelease
) {
    return PanResponder.create({
        // 要求成为响应者：
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) =>
            onPanResponderGrant(evt, gestureState),

        onPanResponderMove: (evt, gestureState) =>
            onPanResponderMove(evt, gestureState),

        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) =>
            onPanResponderRelease(evt, gestureState),

        onPanResponderTerminate: (evt, gestureState) => {},
        onShouldBlockNativeResponder: (evt, gestureState) => {
            return true
        }
    })
}

//定义默认可以划开最大距离
let distance = 80
export default class extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            moveX: 0
        }
        distance = props.distance || 80
        this.lastMoveX = 0
        this.limt = 0
        this.init()
        this.transform = []
        this.isSetMoveX = true
    }
    init() {
        this.panResponder = panResponderCreate(
            (evt, gestureState) => this.onPanResponderGrant(evt, gestureState),
            (evt, gestureState) => this.onPanResponderMove(evt, gestureState),
            (evt, gestureState) => this.onPanResponderRelease(evt, gestureState)
        )
    }
    onPanResponderGrant(evt, gestureState) {
        if (this.props.onOpen) {
            this.props.onOpen()
        }
        let { x0 } = gestureState
        this.lastMoveX = x0
        this.isSetMoveX = true
    }
    onPanResponderMove(evt, gestureState) {
        let { moveX, x0, moveY, y0 } = gestureState
        let mx = Math.ceil(moveX - this.lastMoveX)
        let limt = this.limt + mx
        if (mx != 0) {
            let setMovex = mx
            if (limt < -distance) {
                setMovex = -distance - this.limt
            }

            if (limt > 0) {
                setMovex = -this.limt
                if (this.props.onClose) {
                    this.props.onClose()
                }
            }
            if (this.isSetMoveX) {
                this.isSetMoveX = false
                this.timeoutMovex = setTimeout(() => {
                    this.isSetMoveX = true
                    this.setState({ moveX: setMovex })
                    this.lastMoveX = moveX
                }, 50)
            }
        }
    }
    onPanResponderRelease(evt, gestureState) {
        let { moveX, x0, moveY, y0 } = gestureState
        let mx = Math.ceil(moveX - x0)
        if (this.timeoutMovex) {
            clearTimeout(this.timeoutMovex)
        }
        if (this.limt > -distance && this.limt < 0) {
            let halfDistance = Math.floor(distance / 2)
            if (mx > -halfDistance) {
                this.setState({ moveX: -this.limt })
                if (this.props.onClose) {
                    this.props.onClose()
                }
            }
            if (mx <= -halfDistance) {
                this.setState({ moveX: -distance - this.limt })
            }
        }

        //如果上下移动不超过5就执行点击事件
        if (
            moveX > x0 - 5 &&
            moveX < x0 + 5 &&
            moveY > y0 - 5 &&
            moveY < y0 + 5
        ) {
            //判断是否存在点击事件
            if (this.props.onPress) {
                this.props.onPress()
            }
        }
    }
    render() {
        let { children, onPress, actionBtn, style, ...props } = this.props
        let { moveX } = this.state
        this.transform = [{ translateX: this.limt }, { translateX: moveX }]
        this.limt = this.limt + moveX
        return (
            <View {...this.panResponder.panHandlers} {...props}>
                <View
                    style={{
                        ...style,
                        ...styles.item,
                        transform: [...this.transform]
                    }}
                >
                    {children}
                </View>
                <View style={styles.action}>{actionBtn}</View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        zIndex: 2,
        backgroundColor: "#fff"
    },

    action: {
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1
    }
})
