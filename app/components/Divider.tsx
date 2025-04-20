import React from 'react'

interface DividerProps {
  color?: string;
  height?: number;
  style?: string;
}

function Divider({ color = 'primary', height = 1, style = 'double' }: DividerProps) {
  return (
    <div className="relative w-1/4 mx-auto">
    <div aria-hidden="true" className="absolute inset-0 flex items-center">
      <div className={`w-full border-t${height > 1 ? `-${height}` : ''} border-${style} border-${color} `} />
    </div>
  </div>
  )
}

export default Divider