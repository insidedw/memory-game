import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import classNames from 'classnames'

// https://getemoji.com/
const emojis = ['😀', '💋', '🙏', '🦴', '🚀', '☂️', '💼', '🏭']

function shuffleArray<T>(array: T[]) {
  return array.sort(() => {
    return Math.random() - 0.5
  })
}

const NO_INDEX = -1

export function App() {
  const [shuffledEmojis, setShuffledEmojis] = useState<string[]>([])
  const [firstSelected, setFirstSelected] = useState<number>(NO_INDEX)
  const [secondSelected, setSecondSelected] = useState<number>(NO_INDEX)
  const [matchedEmojis, setMatchedEmojis] = useState<number[]>([])
  const [timer, setTimer] = useState(0)
  const [isFirstAttempt, setFirstAttempt] = useState(false)
  const [isCompleted, setCompleted] = useState(false)
  const [shakingIndex, setShakingIndex] = useState(NO_INDEX)
  const formattedTimer = (timer / 1000).toFixed(2)
  const timerId = useRef<NodeJS.Timer>()

  function handleItemShaking(index: number) {
    setShakingIndex(index)
    setTimeout(() => {
      setShakingIndex(NO_INDEX)
    }, 500)
  }
  function handleTimer() {
    setTimer(0)
    if (timerId.current) {
      clearInterval(timerId.current)
    }
    const startTime = new Date().getTime()
    timerId.current = setInterval(() => {
      const now = new Date().getTime()
      setTimer(now - startTime)
    }, 100)
  }

  useEffect(() => {
    const copied = [...emojis, ...emojis]
    setShuffledEmojis(shuffleArray(copied))
  }, [])

  function handleItemClick(index: number) {
    if (!isFirstAttempt && !timerId.current) {
      setFirstAttempt(true)
      handleTimer()
    }

    if (matchedEmojis.includes(index)) {
      handleItemShaking(index)
      return
    }

    if (firstSelected === NO_INDEX) {
      setFirstSelected(index)
      return
    }

    if (firstSelected > NO_INDEX && secondSelected === NO_INDEX) {
      if (firstSelected === index) {
        handleItemShaking(index)
        return
      } else {
        setSecondSelected(index)
        return
      }
    }
  }

  useEffect(() => {
    if (firstSelected === NO_INDEX || secondSelected === NO_INDEX || shuffledEmojis.length === 0) return

    if (shuffledEmojis[firstSelected] === shuffledEmojis[secondSelected]) {
      setFirstSelected(NO_INDEX)
      setSecondSelected(NO_INDEX)
      setMatchedEmojis([...matchedEmojis, firstSelected, secondSelected])
    } else {
      setTimeout(() => {
        setFirstSelected(NO_INDEX)
        setSecondSelected(NO_INDEX)
      }, 1000)
    }

    if (matchedEmojis.length === shuffledEmojis.length - 2 && Boolean(timerId.current)) {
      clearInterval(timerId.current)
      setCompleted(true)
    }
  }, [firstSelected, secondSelected, shuffledEmojis])

  return (
    <div className="app">
      <header className="header">Memory Game</header>
      <section>
        <div>Time: {formattedTimer} sec</div>
        {isCompleted && <div>Success! {formattedTimer} taken</div>}
      </section>
      <section>
        <div className={'board'}>
          {shuffledEmojis.map((e, index) => {
            const flipped = firstSelected === index || secondSelected === index
            const matched = matchedEmojis.includes(index)

            return (
              <div
                key={`${e}-${index}`}
                className={classNames('item', {
                  flipped,
                  matched,
                  shaking: index === shakingIndex,
                })}
                onClick={() => handleItemClick(index)}
              >
                <span className={classNames('emoji', { flipped, matched })}>{e}</span>
              </div>
            )
          })}
        </div>
      </section>
      <footer>
        <div>
          created by
          <a className={'author'} href={'https://daewoongkim.com'}>
            Daewoong Kim
          </a>
        </div>
        <div>Oct 2023</div>
      </footer>
    </div>
  )
}
