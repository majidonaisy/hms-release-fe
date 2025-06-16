import React from 'react'

interface TextProps {
    children: React.ReactNode
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption'
    color?: 'primary' | 'secondary' | 'white'
    className?: string
}

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'body',
    color = 'primary',
    className = ''
}) => {
    return (
        <span className={`text text--${variant} text--${color} ${className}`}>
            {children}
        </span>
    )
}