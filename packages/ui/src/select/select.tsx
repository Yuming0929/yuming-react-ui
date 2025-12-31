import React, { useState, useRef, useEffect, useCallback, useMemo, ReactNode } from 'react'
import classNames from 'classnames'
import { SelectProps, SelectOption } from './type'
import styles from './select.module.scss'
import { ChevronDown, X, Search, Loader2 } from 'lucide-react'
import { Input } from '../input'

export const Select = ({
  value,
  values,
  defaultValue,
  defaultValues,
  options = [],
  multiple = false,
  placeholder = '请选择',
  size = 'medium',
  status = 'default',
  disabled = false,
  allowClear = false,
  searchable = false,
  filterOption,
  onChange,
  onOpen,
  onClose,
  onSearch,
  className,
  style,
  dropdownWidth,
  loading = false,
  notFoundContent = '暂无数据'
}: SelectProps) => {
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [focused, setFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  // 受控和非受控模式
  const isControlled = value !== undefined || values !== undefined
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue)
  const [internalValues, setInternalValues] = useState<(string | number)[]>(defaultValues || [])

  const currentValue = isControlled
    ? multiple
      ? values
      : value
    : multiple
      ? internalValues
      : internalValue

  const selectRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  // 获取选项标签
  const getOptionLabel = useCallback(
    (optionValue: string | number | (string | number)[]): ReactNode => {
      if (Array.isArray(optionValue)) {
        return optionValue.map(val => getOptionLabel(val))
      }
      const option = options.find(opt => opt.value === optionValue)
      return option ? option.label : String(optionValue)
    },
    [options]
  )

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchText) return options

    const defaultFilter = (input: string, option: SelectOption) => {
      const label = String(option.label).toLowerCase()
      return label.includes(input.toLowerCase())
    }

    const filter = filterOption || defaultFilter
    return options.filter(option => filter(searchText, option))
  }, [options, searchText, searchable, filterOption])

  // 可选的选项（排除禁用的）
  const enabledOptions = useMemo(() => {
    return filteredOptions.filter(opt => !opt.disabled)
  }, [filteredOptions])

  // 判断选项是否被选中
  const isSelected = useCallback(
    (optionValue: string | number) => {
      if (multiple) {
        return Array.isArray(currentValue) && currentValue.includes(optionValue)
      }
      return currentValue === optionValue
    },
    [multiple, currentValue]
  )

  // 处理选择
  const handleSelect = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return

      if (multiple) {
        const currentValues = Array.isArray(currentValue) ? currentValue : []
        let newValues: (string | number)[]

        if (currentValues.includes(option.value)) {
          newValues = currentValues.filter(v => v !== option.value)
        } else {
          newValues = [...currentValues, option.value]
        }

        if (!isControlled) {
          setInternalValues(newValues)
        }
        onChange?.(newValues)
      } else {
        if (!isControlled) {
          setInternalValue(option.value)
        }
        onChange?.(option.value)
        setOpen(false)
        setSearchText('')
        setHighlightedIndex(-1)
      }
    },
    [multiple, currentValue, isControlled, onChange]
  )

  // 处理清除
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (multiple) {
        if (!isControlled) {
          setInternalValues([])
        }
        onChange?.([])
      } else {
        if (!isControlled) {
          setInternalValue(undefined)
        }
        onChange?.(undefined as unknown as string | number | (string | number)[])
      }
      setSearchText('')
    },
    [multiple, isControlled, onChange]
  )

  // 处理清除单个值
  const handleClearSingle = useCallback(
    (value: string | number) => {
      if (multiple) {
        setInternalValues(internalValues.filter(v => v !== value))
      } else {
        setInternalValue(undefined)
      }
      onChange?.(
        multiple
          ? internalValues
          : (internalValue as unknown as string | number | (string | number)[])
      )
      setSearchText('')
    },
    [multiple, internalValues, internalValue, onChange]
  )

  // 切换下拉框
  const toggleOpen = useCallback(() => {
    if (disabled) return
    const newOpen = !open
    setOpen(newOpen)
    if (newOpen) {
      onOpen?.()
      if (searchable) {
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 0)
      }
    } else {
      onClose?.()
      setSearchText('')
      setHighlightedIndex(-1)
    }
  }, [disabled, open, searchable, onOpen, onClose])

  // 键盘导航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      switch (e.key) {
        case 'Enter':
        case ' ':
          if (!open) {
            e.preventDefault()
            toggleOpen()
          } else if (highlightedIndex >= 0 && enabledOptions[highlightedIndex]) {
            e.preventDefault()
            handleSelect(enabledOptions[highlightedIndex])
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (!open) {
            toggleOpen()
          } else {
            setHighlightedIndex(prev => (prev < enabledOptions.length - 1 ? prev + 1 : 0))
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (open) {
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : enabledOptions.length - 1))
          }
          break
        case 'Escape':
          if (open) {
            e.preventDefault()
            setOpen(false)
            onClose?.()
          }
          break
      }
    },
    [disabled, open, highlightedIndex, enabledOptions, handleSelect, toggleOpen, onClose]
  )

  // 点击外部关闭
  useEffect(() => {
    if (open) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node
        if (
          selectRef.current &&
          !selectRef.current.contains(target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(target)
        ) {
          setOpen(false)
          onClose?.()
          setSearchText('')
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [open, onClose])

  // 滚动到高亮项
  useEffect(() => {
    if (open && highlightedIndex >= 0 && optionsRef.current) {
      const optionElement = optionsRef.current.children[highlightedIndex] as HTMLElement
      if (optionElement) {
        optionElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [open, highlightedIndex])

  // 处理搜索
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value
      setSearchText(text)
      onSearch?.(text)
      setHighlightedIndex(-1)
    },
    [onSearch]
  )

  // 渲染选中值
  const renderValue = () => {
    if (multiple) {
      const selectedValues = Array.isArray(currentValue) ? currentValue : []
      if (selectedValues.length === 0) {
        return <span className={styles.placeholder}>{placeholder}</span>
      }

      return (
        <>
          {selectedValues.map(val => (
            <span key={val} className={styles.tag} onClick={e => e.stopPropagation()}>
              {getOptionLabel(val)}
              <X size={14} onClick={() => handleClearSingle(val)} />
            </span>
          ))}
        </>
      )
    } else {
      if (currentValue === undefined || currentValue === null || currentValue === '') {
        return <span className={styles.placeholder}>{placeholder}</span>
      }
      return <span className={styles.value}>{getOptionLabel(currentValue)}</span>
    }
  }

  const showClear =
    allowClear &&
    !disabled &&
    (multiple
      ? Array.isArray(currentValue) && currentValue.length > 0
      : currentValue !== undefined && currentValue !== null && currentValue !== '')

  const selectClasses = classNames(
    styles.select,
    styles[`select--${size}`],
    styles[`select--${status}`],
    {
      [styles['select--disabled']]: disabled,
      [styles['select--focused']]: focused || open,
      [styles['select--open']]: open,
      [styles['select--multiple']]: multiple
    },
    className
  )

  // 分组选项
  const groupedOptions = useMemo(() => {
    const groups = new Map<string, SelectOption[]>()
    const ungrouped: SelectOption[] = []

    filteredOptions.forEach(option => {
      if (option.group) {
        if (!groups.has(option.group)) {
          groups.set(option.group, [])
        }
        groups.get(option.group)!.push(option)
      } else {
        ungrouped.push(option)
      }
    })

    return { groups, ungrouped }
  }, [filteredOptions])

  return (
    <div ref={selectRef} className={selectClasses} style={style} onKeyDown={handleKeyDown}>
      <div
        className={styles.selectTrigger}
        onClick={toggleOpen}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className={styles.selectValue}>{renderValue()}</div>
        <div className={styles.selectSuffix}>
          {showClear && (
            <span
              className={styles.selectClear}
              onClick={handleClear}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleClear(e as unknown as React.MouseEvent)
                }
              }}
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            className={classNames(styles.selectArrow, {
              [styles['select-arrow--open']]: open
            })}
            size={16}
          />
        </div>
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className={styles.selectDropdown}
          style={{ width: dropdownWidth }}
          role="listbox"
        >
          {searchable && (
            <Input
              size="small"
              prefix={<Search size={16} className={styles.searchIcon} />}
              onChange={handleSearch}
              // onPressEnter={handleSearch}
            />
          )}

          <div ref={optionsRef} className={styles.selectOptions}>
            {loading ? (
              <div className={styles.selectLoading}>
                <Loader2 size={16} className={styles.loadingIcon} />
                <span>加载中...</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className={styles.selectEmpty}>{notFoundContent}</div>
            ) : (
              <>
                {Array.from(groupedOptions.groups.entries()).map(([groupName, groupOptions]) => (
                  <div key={groupName} className={styles.optionGroup}>
                    <div className={styles.optionGroupLabel}>{groupName}</div>
                    {groupOptions.map((option, _) => {
                      const globalIndex = enabledOptions.findIndex(
                        opt => opt.value === option.value
                      )
                      return (
                        <div
                          key={option.value}
                          className={classNames(styles.option, {
                            [styles['option--selected']]: isSelected(option.value),
                            [styles['option--disabled']]: option.disabled,
                            [styles['option--highlighted']]: globalIndex === highlightedIndex
                          })}
                          onClick={() => handleSelect(option)}
                          role="option"
                          aria-selected={isSelected(option.value)}
                        >
                          {multiple && (
                            <span className={styles.optionCheckbox}>
                              {isSelected(option.value) ? '✓' : ''}
                            </span>
                          )}
                          <span className={styles.optionLabel}>{option.label}</span>
                        </div>
                      )
                    })}
                  </div>
                ))}
                {groupedOptions.ungrouped.map(option => {
                  const globalIndex = enabledOptions.findIndex(opt => opt.value === option.value)
                  return (
                    <div
                      key={option.value}
                      className={classNames(styles.option, {
                        [styles['option--selected']]: isSelected(option.value),
                        [styles['option--disabled']]: option.disabled,
                        [styles['option--highlighted']]: globalIndex === highlightedIndex
                      })}
                      onClick={() => handleSelect(option)}
                      role="option"
                      aria-selected={isSelected(option.value)}
                    >
                      {multiple && (
                        <span className={styles.optionCheckbox}>
                          {isSelected(option.value) ? '✓' : ''}
                        </span>
                      )}
                      <span className={styles.optionLabel}>{option.label}</span>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
