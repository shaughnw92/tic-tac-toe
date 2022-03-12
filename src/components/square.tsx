import classnames from 'classnames'
import '../App.scss'

interface Props {
  value: number
  onClick: () => void
  className?: string
}

const Square = (props: Props): JSX.Element => {
  const { value, onClick, className } = props

  return <button className={classnames('square', className)} onClick={onClick}>{value}</button>
}

export default Square