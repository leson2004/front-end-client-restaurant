import React from 'react'

export default function SpinnerSink() {
    return (
        <div>
            <div className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    )
}
