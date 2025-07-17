import { useEffect } from 'react'

export function CreatePopup({ onClose }) {
    useEffect(() => {
        console.log('Create popup opened')
    }, [])

    return (
        <div className="create-popup">
            <button className="close-popup" onClick={onClose}>Close</button>
            <p>Create popup is open.</p>
        </div>
    )
}