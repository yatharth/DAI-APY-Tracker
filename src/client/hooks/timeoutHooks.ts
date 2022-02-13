import React, {useEffect, useRef} from 'react'


// Code from https://www.joshwcomeau.com/snippets/react-hooks/use-timeout/
export function useTimeout(callback, delay) {

    const timeoutRef = React.useRef(null)

    const savedCallback = React.useRef(callback)

    React.useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    React.useEffect(() => {
        const tick = () => savedCallback.current()
        if (typeof delay === 'number') {
            timeoutRef.current = window.setTimeout(tick, delay)
            return () => window.clearTimeout(timeoutRef.current)
        }
    }, [delay])

    return timeoutRef
}

type Callback = () => void

// Code from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: Callback, delay: number | null) {

    const savedCallback = useRef<Callback>()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {

        function tick() {
            savedCallback.current()
        }

        if (delay !== null) {
            let intervalId = setInterval(tick, delay)
            return () => clearInterval(intervalId)
        }

    }, [delay])

}
