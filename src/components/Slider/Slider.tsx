import { FC, InputHTMLAttributes } from 'react';
import styles from './Slider.module.css';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
}

export const Slider: FC<SliderProps> = ({
  label,
  showValue = false,
  value,
  className = '',
  ...props
}) => {
  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.labelContainer}>
          <label className={styles.label}>{label}</label>
          {showValue && <span className={styles.value}>{value}</span>}
        </div>
      )}
      <input type="range" className={`${styles.slider} ${className}`} value={value} {...props} />
    </div>
  );
};
