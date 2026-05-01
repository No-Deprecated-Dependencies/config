import { useState } from 'react'

function Component() {
    const { name, setName } = useModel()

    return (
        <div>
            <h1>Hello {name}!</h1>
            <input
                placeholder="Enter your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
    )
}

function useModel() {
    const [name, setName] = useState('')
    return {
        name,
        setName,
    }
}

export default Component
