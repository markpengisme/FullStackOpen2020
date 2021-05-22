import React, { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsernameChange = (event) => setUsername(event.target.value)
    const handlePasswordChange = (event) => setPassword(event.target.value)

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (handleLogin({ username, password })) {
            setUsername('')
            setPassword('')
        }
    }
    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    username
                    <input
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    password
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button id="login-button" type="submit">
                    login
                </button>
            </form>
        </div>
    )
}

export default LoginForm
