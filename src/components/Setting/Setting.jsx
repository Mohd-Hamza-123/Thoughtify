import React from 'react'
import './Setting.css'
import { useAskContext } from '../../context/AskContext'
const Setting = () => {
    const { SettingPopUp, SetSettingPopUp, isOverlayBoolean, setisOverlayBoolean } = useAskContext()
    // console.log(SettingPopUp)
    return (

        <form className={`Setting ${SettingPopUp ? 'active' : ''}`}>
            <h4 className='text-center'>Settings</h4>
            <div className='Setting_Div'>
                <p>Others Can Filter Your Posts :</p>
                <div>
                    <div>
                        <input
                            defaultChecked type="radio" name="FilterPost" id="Setting_FilterPost_Yes"
                        />
                        <label htmlFor="Setting_FilterPost_Yes">Yes 😁</label>
                    </div>
                    <div>
                        <input type="radio" name="FilterPost" id="Setting_FilterPost_No" />
                        <label htmlFor="Setting_FilterPost_No">No 😡</label>
                    </div>
                </div>

            </div>

            <div className='Setting_Div'>
                <p>Others Can Filter Your Opinions :</p>
                <div>
                    <div>
                        <input
                            defaultChecked type="radio" name="FilterOpinions" id="Setting_FilterOpinion_Yes"
                        />
                        <label htmlFor="Setting_FilterPost_Yes">Yes 😏</label>
                    </div>
                    <div>
                        <input type="radio" name="FilterOpinions" id="Setting_FilterPost_No" />
                        <label htmlFor="Setting_FilterOpinion_No">No 🤪</label>
                    </div>
                </div>

            </div>

            <div className='Setting_Div'>
                <p>Who Can See Your Followers/Following :</p>
                <div>
                    <div>
                        <input
                            defaultChecked type="radio" name="FilterFollow" id="Setting_FilterFollow_Yes"
                        />
                        <label htmlFor="Setting_FilterPost_Yes">My Followers 🤝</label>
                    </div>
                    <div>
                        <input type="radio" name="FilterFollow" id="Setting_FilterPost_No" />
                        <label htmlFor="Setting_FilterFollow_No">EveryOne 👨🏾‍🤝‍👨🏼👨🏾‍🤝‍👨🏽</label>
                    </div>

                    <div>
                        <input type="radio" name="FilterFollow" id="Setting_FilterPost_No" />
                        <label htmlFor="Setting_FilterFollow_No">None 💀</label>
                    </div>
                </div>
            </div>

            <div className='Setting_Div'>
                <p>Who Can Message You :</p>
                <div>
                    <div>
                        <input
                            defaultChecked type="radio" name="FilterFollow" id="Setting_FilterFollow_Yes"
                        />
                        <label htmlFor="Setting_FilterPost_Yes">My Followers 🤝</label>
                    </div>
                    <div>
                        <input type="radio" name="FilterFollow" id="Setting_FilterPost_No" />
                        <label htmlFor="Setting_FilterFollow_No">EveryOne 👨🏾‍🤝‍👨🏼👨🏾‍🤝‍👨🏽</label>
                    </div>

                    <div>
                        <input type="radio" name="FilterFollow" id="Setting_FilterPost_No" />
                        <label htmlFor="Setting_FilterFollow_No">None 💀</label>
                    </div>
                </div>
            </div>

            <div className='Setting_Div'>
                <p>Your Post will be Deleted After 30 days Automatically :</p>
                <div>
                    <div>
                        <input
                            defaultChecked type="radio" name="FilterPost" id="Setting_FilterPost_Yes"
                        />
                        <label htmlFor="Setting_FilterPost_Yes">Yes 😇</label>
                    </div>
                    <div>
                        <input type="radio" name="FilterPost" id="Setting_FilterPost_No" />
                        <label htmlFor="Setting_FilterPost_No">No 😳</label>
                    </div>
                </div>

            </div>

            <div className='Setting_Btns'>
                <button type='button'>Cancel</button>
                <button type='submit'>Update</button>
            </div>
        </form>

    )
}

export default Setting