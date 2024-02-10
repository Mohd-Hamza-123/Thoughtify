import React from 'react'
import { AskQue, Container, UpperNavigationBar, NavBar, HorizontalLine, LowerNavigationBar } from '../components/index'
const AskQuestion = () => {
    return (
        <>
            <Container>
                <UpperNavigationBar />
                <HorizontalLine/>
                <LowerNavigationBar/>
                <AskQue />
            </Container>
        </>
    )
}

export default AskQuestion