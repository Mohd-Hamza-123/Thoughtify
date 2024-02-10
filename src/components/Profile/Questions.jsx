import React from 'react'
import './Questions.css'
const Questions = () => {
  return (
    <div className='w-full'>
      <div id='Questions_Filter'>
        <h5>Filter Your Questions</h5>
        <p>Total : 5 Questions</p>
        <div>
          <p>Recent</p>
          <p>Oldest</p>
        </div>
        <div>
          <label htmlFor="">Search</label>
          <input type="text" name="" id="" placeholder='Enter Title' />
        </div>
        <div>
          <label htmlFor="">Category</label>
          <select name="" id="">
            <option value="">All</option>
            <option value="">Coding</option>
            <option value="">Education</option>
            <option value="">Relation</option>
          </select>
        </div>
        <div>
          <p>Favourite</p>
        </div>
        <div>
          Most Liked
        </div>
        <div>
          Most Disliked
        </div>
        <div>
          <p>Filter By Date</p>
          <div>
            <label htmlFor="">Before Date</label>
            <input type="text" name="" id="" placeholder='DD/MM/YYYY' />
          </div>
          <div>
            <label htmlFor="">After Date</label>
            <input type="text" name="" id="" placeholder='DD/MM/YYYY' />
          </div>
          <div>
            <label htmlFor="">Between</label>
            <input type="date" name="" id="" />
            <input type="date" name="" id="" />
          </div>
        </div>
      </div>
      <div id='Questions_Show'></div>
    </div>
  )
}

export default Questions