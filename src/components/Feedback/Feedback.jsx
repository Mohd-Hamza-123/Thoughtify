import React from 'react'
import './Feedback.css'
import { Button } from '../index'
import { useAskContext } from '../../context/AskContext'
import { useForm } from 'react-hook-form'
import feedbackService from '../../appwrite/feedback'

const Feedback = () => {
  const { register, handleSubmit, setValue } = useForm()
  const { feedbackPopUp, setfeedbackPopUp } = useAskContext()


  const submit = async (data) => {
    if (!userAuthStatus) return
    console.log(data)
    const feedBack = await feedbackService.createFeedBack(data.Feedback)
    console.log(feedBack)
    setValue("Feedback", '')
  }
  return (
    <form onSubmit={handleSubmit(submit)} id='Feedback' className={`${feedbackPopUp ? 'active' : ''}`}>
      <section className={`${feedbackPopUp ? 'active' : ''}`}>
        <p>Give Your Opinion</p>
        <article>
          Note: If you notice any inappropriate behavior, please report it by providing the individual's name and user ID. Your feedback helps us maintain a positive community. Thank you for your cooperation. </article>
        <textarea {...register("Feedback", {
          required: true
        })} placeholder='Your Feedback' name="Feedback" id=""></textarea>
        <div className='flex justify-center gap-8 mt-2'>
          <Button type='submit' onClick={() => setfeedbackPopUp((prev) => false)}>Submit</Button>
          <Button type='reset' onClick={() => setfeedbackPopUp((prev) => false)} >Cancel</Button>
        </div>
      </section>
    </form>
  )
}

export default Feedback