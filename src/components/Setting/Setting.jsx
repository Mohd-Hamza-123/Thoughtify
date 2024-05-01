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
  
    const { register, handleSubmit } = useForm();
    const submit = async (data) => {
 n
        SetSettingPopUp((prev) => false)
        setisOverlayBoolean((prev) => false)
       
        try {
            const updateProfile = await profile.updateEveryProfileAttribute({ ...data, profileID: myUserProfile?.$id })
        
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
                <p>Who Can Filter Your Posts :</p>
                <div>

                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourPosts === 'My Following' ? true : false}
                            {...register("othersCanFilterYourPosts")}
                            type="radio" name="othersCanFilterYourPosts" id="Setting_FilterPost_MyFollowing"
                            value={"My Following"}
                        />
                        <label htmlFor="Setting_FilterPost_MyFollowing">My Following 😁</label>
                    </div>

                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourPosts === "Everyone" ? true : false}
                            {...register("othersCanFilterYourPosts")}
                            type="radio" name="othersCanFilterYourPosts" id="Setting_FilterPost_Yes"
                            value={'Everyone'}
                        />
                        <label htmlFor="Setting_FilterPost_Yes">EveryOne 😁</label>
                    </div>

                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourPosts === "None" ? true : false}
                            {...register("othersCanFilterYourPosts")}
                            type="radio"
                            name="othersCanFilterYourPosts" id="Setting_FilterPost_No"
                            value={"None"}
                        />
                        <label htmlFor="Setting_FilterPost_No">None 😡</label>
                    </div>

                </div>

            </div>

            <div className='Setting_Div'>
                <p>Others Can Filter Your Opinions :</p>
                <div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourOpinions === "My Following" ? true : false}
                            type="radio"
                            value={"My Following"}
                            name="othersCanFilterYourOpinions" id="Setting_FilterOpinion_Yes"
                            {...register("othersCanFilterYourOpinions")}
                        />
                        <label htmlFor="Setting_FilterOpinion_Yes">My Following 😏</label>
                    </div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourOpinions === "Everyone" ? true : false}
                            type="radio"
                            value={"Everyone"}
                            name="othersCanFilterYourOpinions" id="Setting_FilterOpinion_No"
                            {...register("othersCanFilterYourOpinions")}
                        />
                        <label htmlFor="Setting_FilterOpinion_No">Everyone 🤪</label>
                    </div>

                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersCanFilterYourOpinions === "None" ? true : false}
                            type="radio"
                            value={"None"}
                            name="othersCanFilterYourOpinions" id="Setting_FilterOpinion_None"
                            {...register("othersCanFilterYourOpinions")}
                        />
                        <label htmlFor="Setting_FilterOpinion_None">None 😝</label>
                    </div>
                </div>

            </div>

            <div className='Setting_Div'>
                <p>Who Can See Your Followers/Following :</p>
                <div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersSeeYourFollowers_Following === 'My Following' ? true : false}
                            type="radio"
                            value={"My Following"}
                            name="othersSeeYourFollowers_Following" id="Setting_FilterFollow_MyFollowers"
                            {...register("othersSeeYourFollowers_Following")}
                        />
                        <label htmlFor="Setting_FilterFollow_MyFollowers">My Following 😄</label>
                    </div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersSeeYourFollowers_Following === 'Everyone' ? true : false}
                            type="radio"
                            value={"Everyone"}
                            name="othersSeeYourFollowers_Following" id="Setting_FilterPost_EveryOne"
                            {...register("othersSeeYourFollowers_Following")}
                        />
                        <label htmlFor="Setting_FilterPost_EveryOne">Everyone 😊</label>
                    </div>

                    <div>
                        <input
                            defaultChecked={myUserProfile?.othersSeeYourFollowers_Following === 'None' ? true : false}
                            type="radio"
                            value={"None"}
                            name="othersSeeYourFollowers_Following" id="Setting_FilterFollow_None"
                            {...register("othersSeeYourFollowers_Following")}
                        />
                        <label htmlFor="Setting_FilterFollow_None">None 😤</label>
                    </div>
                </div>
            </div>

            <div className='Setting_Div'>
                <p>Who Can Message You :</p>
                <div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.whoCanMsgYou === 'My Following' ? true : false}
                            type="radio"
                            name="whoCanMsgYou" id="Setting_WhoCanMsg_MyFollowers"
                            {...register("whoCanMsgYou")}
                            value={"My Following"}
                        />
                        <label htmlFor="Setting_WhoCanMsg_MyFollowers">My Following 😊</label>
                    </div>
                    <div>
                        <input
                            defaultChecked={myUserProfile?.whoCanMsgYou === 'Everyone' ? true : false}
                            type="radio"
                            name="whoCanMsgYou" id="Setting_WhoCanMsg_EveryOne"
                            {...register("whoCanMsgYou")}
                            value={"Everyone"}
                        />
                        <label htmlFor="Setting_WhoCanMsg_EveryOne">Everyone 😁</label>
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
                        <label htmlFor="Setting_WhoCanMsg_None">None 😑</label>
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