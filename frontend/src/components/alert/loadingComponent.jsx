import React from 'react'
import ReactLoading from 'react-loading'

function loadingComponent() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <ReactLoading type='spin' color='green' />
        </div>
    )
}

export default loadingComponent 