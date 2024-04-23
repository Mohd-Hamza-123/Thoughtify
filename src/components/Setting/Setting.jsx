import React from 'react'
import './Setting.css'
import { useAskContext } from '../../context/AskContext'
import { useForm } from 'react-hook-form'
import profile from '../../appwrite/profile'

const Setting = () => {

    const {
        SettingPopUp,
        SetSettingPopUp,
        setisOverlayBoolean,
        myUserProfile,
        setMyUserProfile,
        setnotificationPopMsg,
        setNotificationPopMsgNature
    } = useAskContext();
    // console.log(myUserProfile)
    const { register, handleSubmit } = useForm();
    const submit = async (data) => {

        SetSettingPopUp((prev) => false)
        setisOverlayBoolean((prev) => false)


        if (data.othersCanFilterYourOpinions === 'false') {
            data.othersCanFilterYourOpinions = false
        } else {
            data.othersCanFilterYourOpinions = true
        }

        if (data.othersCanFilterYourPosts === 'false') {
            data.othersCanFilterYourPosts = false
        } else {
            data.othersCanFilterYourPosts = true
        }

        // console.log(data)
        try {
            const updateProfile = await profile.updateEveryProfileAttribute({ ...data, profileID: myUserProfile?.$id })
            // console.log(updateProfile);
            setMyUserProfile((prev) => updateProfile)
            setNotificationPopMsgNature((prev) => true)
            setnotificationPopMsg((prev) => "Setting Changed")
        } catch (error) {
            setNotificationPopMsgNature((prev) => false)
            setnotificationPopMsg((prev) => "Error ! Setting is Not Changed")
        }
    }
    return (

        <form onSubmit={handleSubmit(submit)} className={`Setting ${SettingPopUp ? 'active' : ''}`}>
            <h4 className='text-center'>Settings</h4>

            <div className='Setting_Div'>
                <p>Others Can Filter Your Posts :</p>
                <div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourPosts === true ? true : false}
                            {...register("othersCanFilterYourPosts")}
                            type="radio" name="othersCanFilterYourPosts" id="Setting_FilterPost_Yes"
                            value={true}
                        />
                        <label htmlFor="Setting_FilterPost_Yes">Yes 😁</label>
                    </div>


                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourPosts === false ? true : false}
                            {...register("othersCanFilterYourPosts")}
                            type="radio"
                            name="othersCanFilterYourPosts" id="Setting_FilterPost_No"
                            value={false}
                        />
                        <label htmlFor="Setting_FilterPost_No">No 😡</label>
                    </div>
                </div>

            </div>

            <div className='Setting_Div'>
                <p>Others Can Filter Your Opinions :</p>
                <div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourOpinions === true ? true : false}
                            type="radio"
                            value={true}
                            name="othersCanFilterYourOpinions" id="Setting_FilterOpinion_Yes"
                            {...register("othersCanFilterYourOpinions")}
                        />
                        <label htmlFor="Setting_FilterOpinion_Yes">Yes 😏</label>
                    </div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourOpinions === false ? true : false}
                            type="radio"
                            value={false}
                            name="othersCanFilterYourOpinions" id="Setting_FilterOpinion_No"
                            {...register("othersCanFilterYourOpinions")}
                        />
                        <label htmlFor="Setting_FilterOpinion_No">No 🤪</label>
                    </div>
                </div>

            </div>

            <div className='Setting_Div'>
                <p>Who Can See Your Followers/Following :</p>
                <div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersSeeYourFollowers_Following === 'My Followers' ? true : false}
                            type="radio"
                            value={"My Followers"}
                            name="othersSeeYourFollowers_Following" id="Setting_FilterFollow_MyFollowers"
                            {...register("othersSeeYourFollowers_Following")}
                        />
                        <label htmlFor="Setting_FilterFollow_MyFollowers">My Followers 🤝</label>
                    </div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersSeeYourFollowers_Following === 'EveryOne' ? true : false}
                            type="radio"
                            value={"EveryOne"}
                            name="othersSeeYourFollowers_Following" id="Setting_FilterPost_EveryOne"
                            {...register("othersSeeYourFollowers_Following")}
                        />
                        <label htmlFor="Setting_FilterPost_EveryOne">EveryOne 👨🏾‍🤝‍👨🏼👨🏾‍🤝‍👨🏽</label>
                    </div>

                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersSeeYourFollowers_Following === 'None' ? true : false}
                            type="radio"
                            value={"None"}
                            name="othersSeeYourFollowers_Following" id="Setting_FilterFollow_None"
                            {...register("othersSeeYourFollowers_Following")}
                        />
                        <label htmlFor="Setting_FilterFollow_None">None 💀</label>
                    </div>
                </div>
            </div>

            <div className='Setting_Div'>
                <p>Who Can Message You :</p>
                <div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.whoCanMsgYou === 'My Followers' ? true : false}
                            type="radio"
                            name="whoCanMsgYou" id="Setting_WhoCanMsg_MyFollowers"
                            {...register("whoCanMsgYou")}
                            value={"My Followers"}
                        />
                        <label htmlFor="Setting_WhoCanMsg_MyFollowers">My Followers 🤝</label>
                    </div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.whoCanMsgYou === 'EveryOne' ? true : false}
                            type="radio"
                            name="whoCanMsgYou" id="Setting_WhoCanMsg_EveryOne"
                            {...register("whoCanMsgYou")}
                            value={"EveryOne"}
                        />
                        <label htmlFor="Setting_WhoCanMsg_EveryOne">EveryOne 👨🏾‍🤝‍👨🏼👨🏾‍🤝‍👨🏽</label>
                    </div>

                    <div>
                        <input
                            defaultChecked={myUserProfile?.whoCanMsgYou === 'None' ? true : false}
                            type="radio"
                            value={"None"}
                            name="whoCanMsgYou"
                            id="Setting_WhoCanMsg_None"
                            {...register("whoCanMsgYou")}
                        />
                        <label htmlFor="Setting_WhoCanMsg_None">None 💀</label>
                    </div>
                </div>
            </div>


            <div className='Setting_Btns'>
                <button onClick={() => {
                    SetSettingPopUp((prev) => false)
                    setisOverlayBoolean((prev) => false)
                }} type='button'>Cancel</button>
                <button type='submit'>Update</button>
            </div>
        </form>

    )
}

export default Setting