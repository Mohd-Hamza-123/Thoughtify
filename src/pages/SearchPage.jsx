import React, { useState } from 'react'
import { BrowseQuestions, Trigger } from '../components'
const SearchPage = () => {
  
  const [switchTrigger, setSwitchTrigger] = useState(true);

  return (
    <>
      <Trigger setSwitchTrigger={setSwitchTrigger} />
      <BrowseQuestions
        switchTrigger={switchTrigger}
        setSwitchTrigger={setSwitchTrigger} />
    </>
  )
}

export default SearchPage