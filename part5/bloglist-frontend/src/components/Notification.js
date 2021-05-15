import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (!(message.text && message.color)) {
    return null
  }

  const messageStyle = {
    color: message.color,
    borderColor: message.color,

    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'

  }

  return (
    <div className="message" style={messageStyle}>
      {message.text}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.object.isRequired,
}

export default Notification