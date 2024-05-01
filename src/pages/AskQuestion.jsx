import React from 'react'
import { AskQue, Container, UpperNavigationBar, HorizontalLine, LowerNavigationBar } from '../components/index'
import './AskQuestion.css'
const AskQuestion = () => {
    return (
        <div id='AskQuestion'>
            <Container>
                <div>
                    <UpperNavigationBar />
                    <HorizontalLine />
                    <LowerNavigationBar />
                </div>
                <AskQue />
            </Container>
        </div>
    )
}

export default AskQuestion
