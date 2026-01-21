import React from 'react'
import Swal from 'sweetalert2'

const ErrorMsg = ({ message }) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    })
    return null
}

export default ErrorMsg