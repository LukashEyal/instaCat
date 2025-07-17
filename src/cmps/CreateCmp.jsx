import { useEffect } from 'react'

export function CreateCmp({ onClose }) {
    useEffect(() => {
        console.log('CreateCmp opened')
    }, [])

    return (
        <div className="create-cmp">
            <button className="close-create-cmp" onClick={onClose}>Close</button>
            <p>Create cmp is open.</p>
        </div>
    )
} 