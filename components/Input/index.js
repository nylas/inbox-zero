import classnames from 'classnames'
import styles from './Input.module.css'

export default function Input({ className = '', ...props }) {
  return (
    <input className={classnames(styles.Input, className)} {...props} />
  )
}