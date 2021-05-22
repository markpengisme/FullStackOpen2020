import React, { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable.js'
import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
    const [notes, setNotes] = useState([])
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [user, setUser] = useState(null)
    const noteFormRef = useRef()

    const loginForm = () => (
        <Togglable buttonLabel="login">
            <LoginForm handleLogin={handleLogin} />
        </Togglable>
    )

    const noteForm = () => (
        <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
        </Togglable>
    )

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes)
        })
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            noteService.setToken(user.token)
        }
    }, [])

    const toggleImportanceOf = (id) => {
        const note = notes.find((n) => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService
            .update(id, changedNote)
            .then((returnedNote) => {
                setNotes(
                    notes.map((note) => (note.id !== id ? note : returnedNote))
                )
            })
            .catch(() => {
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                )
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
                setNotes(notes.filter((n) => n.id !== id))
            })
    }

    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility()
        noteService.create(noteObject).then((returnedNote) => {
            setNotes(notes.concat(returnedNote))
        })
    }

    const handleLogin = async ({ username, password }) => {
        try {
            const user = await loginService.login({
                username,
                password,
            })
            window.localStorage.setItem(
                'loggedNoteappUser',
                JSON.stringify(user)
            )
            noteService.setToken(user.token)
            setUser(user)
            return true
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const notesToShow = showAll
        ? notes
        : notes.filter((note) => note.important === true)

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            {user === null ? (
                loginForm()
            ) : (
                <div>
                    <p>{user.name} logged-in</p>
                    {noteForm()}
                </div>
            )}
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map((note, i) => (
                    <Note
                        key={i}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                ))}
            </ul>
            <Footer />
        </div>
    )
}

export default App
