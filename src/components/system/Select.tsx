'use client';
import React, { useState, useRef, useEffect } from 'react';
import MaterialIcon from './MaterialIcon';
import style from '@/styles/system/Input.module.scss';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

interface TooltipProps {
  text: string;
  more?: React.ReactNode;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  error?: boolean;
  helperText?: string;
  tooltip?: TooltipProps;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  clearable?: boolean;
  className?: string;
}

const Select = ({
  label,
  placeholder = 'Auswählen...',
  options,
  value = '',
  onChange,
  onBlur,
  name,
  error = false,
  helperText,
  tooltip,
  required = false,
  disabled = false,
  fullWidth = false,
  clearable = false,
  className,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label || placeholder;
  const hasValue = !!value;

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    onBlur?.();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleToggle();
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        break;
    }
  };

  const containerClasses = [
    style.inputContainer,
    fullWidth && style.fullWidth,
    error && style.error,
    isOpen && style.focused,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const selectClasses = [
    style.input,
    style.hasIcons,
    error && style.error,
    hasValue && style.hasValue,
    disabled && style.readOnly,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} ref={selectRef}>
      {label && (
        <div className={style.labelContainer}>
          <label className={style.label}>
            {label}
            {required && <span className={style.required}>*</span>}
          </label>
          {tooltip && (
            <div className={style.tooltipContainer}>
              <MaterialIcon
                icon="help_outline"
                iconSize="small"
                className={style.tooltipIcon}
              />
              <div className={style.tooltip}>
                <div className={style.tooltipContent}>
                  {tooltip.text}
                  {tooltip.more && (
                    <div className={style.tooltipMore}>{tooltip.more}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={style.inputWrapper}>
        <div
          className={selectClasses}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          data-placeholder={!hasValue}
          data-name={name}
        >
          {selectedOption?.icon && (
            <MaterialIcon icon={selectedOption.icon} iconSize="small" />
          )}
          <span className={style.selectValue}>{displayValue}</span>
        </div>

        <div className={style.endIcons}>
          {clearable && hasValue && !disabled && (
            <MaterialIcon
              icon="clear"
              iconSize="small"
              clickable
              onClick={handleClear}
            />
          )}
          <MaterialIcon
            icon={isOpen ? 'expand_less' : 'expand_more'}
            iconSize="small"
          />
        </div>

        {isOpen && (
          <div className={style.dropdown}>
            {options.map((option) => (
              <div
                key={option.value}
                className={`${style.option} ${option.value === value ? style.selected : ''} ${option.disabled ? style.disabled : ''}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.icon && (
                  <MaterialIcon icon={option.icon} iconSize="small" />
                )}
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {helperText && (
        <div className={`${style.helperText} ${error ? style.errorText : ''}`}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Select;
