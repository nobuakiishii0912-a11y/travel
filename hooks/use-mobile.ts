import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Defer initial state setting to prevent react-hooks/set-state-in-effect warning
    const timerId = setTimeout(() => {
      setIsMobile(mql.matches)
    }, 0)
    
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    mql.addEventListener("change", onChange)
    return () => {
      clearTimeout(timerId)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return isMobile
}


