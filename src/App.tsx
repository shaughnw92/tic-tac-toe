import { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import Square from './components/square'
import {
	SQUARE_ARRAY,
	TOP_HORIZONTAL,
	CENTER_HORIZONTAL,
	BOTTOM_HORIZONTAL,
	LEFT_VERTICAL,
	CENTER_VERTICAL,
	RIGHT_VERTICAL,
	UP_DIAGONAL,
	DOWN_DIAGONAL,
} from './constants/constants'
import './App.scss'

const isEven = (num: number): boolean => num % 2 === 0

const App = (): JSX.Element => {
	const [square, setSquare] = useState(SQUARE_ARRAY)
	const [turn, setTurn] = useState(0)
	const [winner, setWinner] = useState(false)
	const [ixArray, setIxArray] = useState<Array<number | null>>([])
	const lastIxRef = useRef(0)
	const winnerArray = [
		TOP_HORIZONTAL,
		CENTER_HORIZONTAL,
		BOTTOM_HORIZONTAL,
		LEFT_VERTICAL,
		CENTER_VERTICAL,
		RIGHT_VERTICAL,
		UP_DIAGONAL,
		DOWN_DIAGONAL,
	]

	const isWinner = winnerArray.some(
		arr =>
			arr.every(ix => square[ix - 1] === 'X') ||
			arr.every(ix => square[ix - 1] === 'O')
	)

	const handleClick = (ix: number): void => {
		if (!square[ix]) {
			square[ix] = isEven(turn) ? 'X' : 'O'
			!isWinner && setTurn(turn + 1)
		} else {
			square[ix] = null
			!isWinner && setTurn(turn - 1)
		}

		setSquare(square)
		setIxArray([...ixArray, ix])
	}

	console.log({ isWinner, winner, turn })

	const handleUndo = (): void => {
		if (turn === 0 || !lastIxRef) return

		if (isWinner) setWinner(false)

		lastIxRef.current = Number(ixArray[ixArray.length - 1])

		square[lastIxRef.current] = null

		setTurn(turn - 1)
		setSquare(square)
		setIxArray(ixArray.splice(0, ixArray.length - 1))
	}

	const handleReset = (): void => {
		if (isWinner) setWinner(false)

		const newSquare = square.map((square, ix) => (square = null))

		setTurn(0)
		setSquare(newSquare)
		setIxArray([])
	}

	const renderSquare = (ix: number): JSX.Element => (
		<Square
			value={square[ix]}
			className={square[ix] && 'square--empty'}
			onClick={() => handleClick(ix)}
		/>
	)

	const renderTitle = (): string | undefined => {
		switch (isEven(turn)) {
			case true:
				if (turn === 0) return 'Tic Tac Toe. Player 1 go first'
				else if (isWinner) return 'Player 1 wins!'
				else if (!isWinner) return 'Player 1 go'
				break
			case false:
				if (turn === 9) return 'Game over'
				else if (isWinner) return 'Player 2 wins'
				else if (!isWinner) return 'Player 2 go'
				break
			default:
				return ''
		}
	}

	useEffect(() => {
		isWinner && setWinner(true)
	}, [square, isWinner])

	useEffect(() => {
		renderTitle()
	}, [square, turn])

	useEffect(() => {
		if (!lastIxRef) return

		lastIxRef.current = Number(ixArray[ixArray.length - 1])
	}, [ixArray])

	return (
		<div className='wrapper'>
			<h3 className={classnames(winner && 'title__winner')}>{renderTitle()}</h3>
			<div
				className={classnames(
					'container',
					(winner || turn === 9) &&
						'container--disabled container--locked container--overlay'
				)}
			>
				<div className='row'>
					{renderSquare(0)}
					{renderSquare(1)}
					{renderSquare(2)}
				</div>
				<div className='row'>
					{renderSquare(3)}
					{renderSquare(4)}
					{renderSquare(5)}
				</div>
				<div className='row'>
					{renderSquare(6)}
					{renderSquare(7)}
					{renderSquare(8)}
				</div>
			</div>
			<button className='button button__undo' onClick={handleUndo}>
				Undo
			</button>
			<button className='button button__reset' onClick={handleReset}>
				New game
			</button>
		</div>
	)
}

export default App
