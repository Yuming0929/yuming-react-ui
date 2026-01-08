import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { SliderProps } from './type'
import styles from './slider.module.scss'

export const Slider = ({
  value: propValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onChange,
  onAfterChange,
  formatTooltip,
  marks,
  dots = false,
  vertical = false,
  className,
  style
}: SliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const trackElementRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? min)

  // 使用 ref 存储最新值，避免闭包陷阱
  const valueRef = useRef<number>(propValue ?? internalValue)
  const propsRef = useRef({ min, max, step, onChange, onAfterChange, formatTooltip })

  // 用于 requestAnimationFrame 的优化
  const rafIdRef = useRef<number | null>(null)
  const pendingValueRef = useRef<number | null>(null)

  // 更新 refs
  useEffect(() => {
    propsRef.current = { min, max, step, onChange, onAfterChange, formatTooltip }
  }, [min, max, step, onChange, onAfterChange, formatTooltip])

  useEffect(() => {
    valueRef.current = propValue !== undefined ? propValue : internalValue
  }, [propValue, internalValue])

  // 处理受控/非受控模式
  const value = propValue !== undefined ? propValue : internalValue

  // 计算百分比位置
  const percentage = useMemo(() => {
    if (max === min) return 0
    const val = ((value - min) / (max - min)) * 100
    return Math.max(0, Math.min(100, val))
  }, [value, min, max])

  // 核心：将像素位置转换为value（使用 useCallback 优化）
  const getValueByPosition = useCallback(
    (clientX: number, clientY?: number) => {
      if (!trackRef.current) return min
      const rect = trackRef.current.getBoundingClientRect()

      // 计算点击位置在轨道长度的比例(0 ~ 1)
      const ratio = vertical
        ? 1 - ((clientY ?? clientX) - rect.top) / rect.height
        : (clientX - rect.left) / rect.width

      const rawValue = ratio * (max - min) + min

      // 处理 step 吸附
      const stepValue = Math.round(rawValue / step) * step

      // 边界限制
      return Math.max(min, Math.min(max, stepValue))
    },
    [min, max, step, vertical]
  )

  // 直接更新视觉位置（不触发状态更新，用于拖动时的流畅性）
  const updateVisualPosition = useCallback(
    (newValue: number) => {
      if (!trackElementRef.current || !handleRef.current) return

      const {
        min: currentMin,
        max: currentMax,
        step: currentStep,
        formatTooltip
      } = propsRef.current

      // 确保值在范围内并符合步长
      const clampedValue = Math.max(currentMin, Math.min(currentMax, newValue))
      const steppedValue = Math.round(clampedValue / currentStep) * currentStep
      const finalValue = Math.max(currentMin, Math.min(currentMax, steppedValue))

      // 计算百分比
      const percentage =
        currentMax === currentMin
          ? 0
          : ((finalValue - currentMin) / (currentMax - currentMin)) * 100

      // 直接更新 DOM，避免 React 重渲染
      if (vertical) {
        trackElementRef.current.style.height = `${percentage}%`
        handleRef.current.style.bottom = `${percentage}%`
      } else {
        trackElementRef.current.style.width = `${percentage}%`
        handleRef.current.style.left = `${percentage}%`
      }

      // 更新 tooltip 内容（如果存在）
      const tooltip = handleRef.current.querySelector(`[class*="tooltip"]`) as HTMLElement
      if (tooltip) {
        tooltip.textContent = formatTooltip ? String(formatTooltip(finalValue)) : String(finalValue)
      }

      pendingValueRef.current = finalValue
    },
    [vertical]
  )

  // 更新值的统一入口（使用 useCallback 优化）
  const updateValue = useCallback(
    (newValue: number, endDrag = false, skipVisualUpdate = false) => {
      const {
        min: currentMin,
        max: currentMax,
        step: currentStep,
        onChange: currentOnChange,
        onAfterChange: currentAfterChange
      } = propsRef.current

      // 确保值在范围内并符合步长
      const clampedValue = Math.max(currentMin, Math.min(currentMax, newValue))
      const steppedValue = Math.round(clampedValue / currentStep) * currentStep
      const finalValue = Math.max(currentMin, Math.min(currentMax, steppedValue))

      if (finalValue === valueRef.current && !endDrag) return

      valueRef.current = finalValue

      // 如果不是跳过视觉更新，则更新视觉位置
      if (!skipVisualUpdate) {
        updateVisualPosition(finalValue)
      }

      if (propValue === undefined) {
        setInternalValue(finalValue)
      }
      currentOnChange?.(finalValue)

      if (endDrag) {
        currentAfterChange?.(finalValue)
      }
    },
    [propValue, updateVisualPosition]
  )

  // 键盘事件处理（支持方向键、PageUp/PageDown、Home/End）
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      const { min: currentMin, max: currentMax, step: currentStep } = propsRef.current
      let newValue = valueRef.current

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault()
          newValue = Math.min(currentMax, valueRef.current + currentStep)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault()
          newValue = Math.max(currentMin, valueRef.current - currentStep)
          break
        case 'PageUp':
          e.preventDefault()
          newValue = Math.min(currentMax, valueRef.current + currentStep * 10)
          break
        case 'PageDown':
          e.preventDefault()
          newValue = Math.max(currentMin, valueRef.current - currentStep * 10)
          break
        case 'Home':
          e.preventDefault()
          newValue = currentMin
          break
        case 'End':
          e.preventDefault()
          newValue = currentMax
          break
        default:
          return
      }

      updateValue(newValue, false)
    },
    [disabled, updateValue]
  )

  // 鼠标/触摸事件处理（使用 requestAnimationFrame 优化性能）
  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return
      e.preventDefault()
      e.stopPropagation()

      setIsDragging(true)

      // 立即跳转到点击位置
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const newValue = getValueByPosition(clientX, clientY)
      updateValue(newValue, false)

      // 使用 ref 存储清理函数，避免闭包问题
      let isActive = true

      // 使用 requestAnimationFrame 优化拖动性能
      const scheduleUpdate = () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current)
        }

        rafIdRef.current = requestAnimationFrame(() => {
          if (!isActive || pendingValueRef.current === null) return

          const pendingValue = pendingValueRef.current
          pendingValueRef.current = null

          // 只在值改变时更新状态和触发回调
          if (pendingValue !== valueRef.current) {
            valueRef.current = pendingValue

            if (propValue === undefined) {
              setInternalValue(pendingValue)
            }
            propsRef.current.onChange?.(pendingValue)
          }

          rafIdRef.current = null
        })
      }

      const onMouseMove = (event: MouseEvent | TouchEvent) => {
        if (!isActive) return
        event.preventDefault()

        const moveX = 'touches' in event ? event.touches[0].clientX : event.clientX
        const moveY = 'touches' in event ? event.touches[0].clientY : event.clientY
        const moveValue = getValueByPosition(moveX, moveY)

        // 只更新视觉位置，不立即更新状态（避免频繁重渲染）
        updateVisualPosition(moveValue)

        // 调度状态更新
        scheduleUpdate()
      }

      const onMouseUp = () => {
        if (!isActive) return
        isActive = false

        // 取消待处理的动画帧
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }

        setIsDragging(false)

        // 确保最终值同步到状态
        const finalValue = pendingValueRef.current ?? valueRef.current
        updateValue(finalValue, true, true) // skipVisualUpdate = true，因为视觉已经更新了

        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('touchmove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('touchend', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove, { passive: false })
      document.addEventListener('touchmove', onMouseMove, { passive: false })
      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('touchend', onMouseUp)
    },
    [disabled, getValueByPosition, updateValue, updateVisualPosition, propValue]
  )

  // 渲染标记点
  const renderMarks = useMemo(() => {
    if (!marks && !dots) return null

    const markItems: React.ReactNode[] = []

    if (marks) {
      Object.entries(marks).forEach(([markValue, markLabel]) => {
        const numValue = Number(markValue)
        if (isNaN(numValue) || numValue < min || numValue > max) return

        const markPercentage = ((numValue - min) / (max - min)) * 100
        markItems.push(
          <div
            key={markValue}
            className={styles.mark}
            style={vertical ? { bottom: `${markPercentage}%` } : { left: `${markPercentage}%` }}
          >
            <span className={styles.markLabel}>{markLabel}</span>
          </div>
        )
      })
    }

    if (dots) {
      const dotCount = Math.floor((max - min) / step) + 1
      for (let i = 0; i < dotCount; i++) {
        const dotValue = min + i * step
        const dotPercentage = ((dotValue - min) / (max - min)) * 100
        markItems.push(
          <div
            key={`dot-${i}`}
            className={styles.dot}
            style={vertical ? { bottom: `${dotPercentage}%` } : { left: `${dotPercentage}%` }}
          />
        )
      }
    }

    return markItems
  }, [marks, dots, min, max, step, vertical])

  return (
    <div
      className={classNames(styles.sliderWrapper, className, {
        [styles['sliderWrapper--disabled']]: disabled,
        [styles['sliderWrapper--vertical']]: vertical
      })}
      style={style}
    >
      <div
        ref={trackRef}
        className={styles.rail}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* 已选中的高亮轨道 */}
        <div
          ref={trackElementRef}
          className={styles.track}
          style={vertical ? { height: `${percentage}%`, bottom: 0 } : { width: `${percentage}%` }}
        />

        {/* 标记点 */}
        {renderMarks}

        {/* 滑块 Handle */}
        <div
          ref={handleRef}
          className={classNames(styles.handle, {
            [styles['handle--dragging']]: isDragging,
            [styles['handle--vertical']]: vertical
          })}
          style={vertical ? { bottom: `${percentage}%`, left: '50%' } : { left: `${percentage}%` }}
          onMouseDown={e => {
            e.stopPropagation()
            handleMouseDown(e)
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Tooltip: 只在拖拽或悬停时显示 */}
          {(isDragging || isHovering) && (
            <div
              className={classNames(styles.tooltip, {
                [styles['tooltip--visible']]: isDragging || isHovering
              })}
            >
              {formatTooltip ? formatTooltip(value) : value}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
