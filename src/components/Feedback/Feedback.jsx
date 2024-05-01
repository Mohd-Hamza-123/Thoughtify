import React from 'react'
import './Feedback.css'
import { Button } from '../index'
import { useAskContext } from '../../context/AskContext'
import { useForm } from 'react-hook-form'
import feedbackService from '../../appwrite/feedback'
import { useSelector } from 'react-redux'

const Feedback = () => {
  const { register, handleSubmit, setValue } = useForm()
  const {
    feedbackPopUp,
    setfeedbackPopUp,
    setnotificationPopMsg,
    setNotificationPopMsgNature,

  } = useAskContext()
  const userData = useSelector((state) => state.auth.userData);
  const userAuthStatus = useSelector((state) => state.auth.status)
  const submit = async (data) => {

    if (!userAuthStatus) return
    try {
      const feedBack = await feedbackService.createFeedBack({ feedback: data.Feedback, userID: userData?.$id, username: userData?.name, email: userData?.email });
      setNotificationPopMsgNature((prev) => true)
      setnotificationPopMsg((prev) => "feedback submitted succesfully")
    } catch (error) {
      console.log("Feedback not submitted")
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg((prev) => "feedback not submitted")
    }
    setValue("Feedback", '')
  }
  return (
    <form onSubmit={handleSubmit(submit)} id='Feedback' className={`${feedbackPopUp ? 'active' : ''}`}>
      <section className={`${feedbackPopUp ? 'active' : ''}`}>
        <p>Give Your Feedback</p>
        <article>
          We value your feedback! Let us know what you think about our platform. Your suggestions will help us to improve the Web App and make it a more valuable tool for you. </article>
        <textarea
          maxLength={1000}
          {...register("Feedback", {
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