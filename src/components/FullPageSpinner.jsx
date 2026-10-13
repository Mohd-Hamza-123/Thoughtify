import React from 'react'
import Spinner from "@/components/Spinner/Spinner"

export default function FullPageSpinner() {
    return (
        <div className='h-[100dvh] w-full flex justify-center items-center'>
            <Spinner />
        </div>
    )
}
