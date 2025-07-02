import React from 'react'
import { BrowseQuestions } from '../components'
import SectionTrigger from '@/components/Home/Trigger/SectionTrigger'
const SearchPage = () => {
  return (
    <>
    <div className="w-full flex justify-end px-3"><SectionTrigger /></div>
      <BrowseQuestions />
    </>
  )
}

export default SearchPage