import './Feedback.css'
import React from 'react'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import feedbackService from '../../appwrite/feedback'
import { useSelector, useDispatch } from 'react-redux'
import { useNotificationContext } from '@/context/NotificationContext'
import { feedbackToggle as feedbackToggleFunc } from '@/store/booleanSlice'

const Feedback = () => {
  const dispatch = useDispatch()
  const { setNotification } = useNotificationContext()
  const { register, handleSubmit, setValue } = useForm()
  const userData = useSelector((state) => state.auth.userData);
  const userAuthStatus = useSelector((state) => state.auth.status)
  const feedbackToggle = useSelector((state) => state.booleanSlice.isFeedbackOpen)

  const submit = async (data) => {

    if (!userAuthStatus) return
    try {
      const feedBack = await feedbackService.createFeedBack({ feedback: data.Feedback, userID: userData?.$id, username: userData?.name, email: userData?.email });
      setNotification({ message: "Feedback", type: "success" })
    } catch (error) {
      setNotification({ message: "Feedback Failed. Try again later", type: "error" })
    }
    setValue("Feedback", '')
    dispatch(feedbackToggleFunc())
  }

  return (
    <form onSubmit={handleSubmit(submit)} id='Feedback' className={`${feedbackToggle ? 'active' : ''}`}>
      <section className={`${feedbackToggle ? 'active' : ''}`}>
        <p>Give Your Feedback</p>
        <article>
          We value your feedback! Let us know what you think about our platform. Your suggestions will help us to improve the Web App and make it a more valuable tool for you. </article>
        <textarea
          maxLength={1000}
          {...register("Feedback", {
            required: true
          })} placeholder='Your Feedback.Max 1000 characters' name="Feedback" id=""></textarea>
        <div className='flex justify-center gap-8 mt-2'>
          <Button type='submit'>Submit</Button>
          <Button type='reset' onClick={() => dispatch(feedbackToggleFunc())} >Cancel</Button>
        </div>
      </section>
    </form>
  )
}

export default Feedback