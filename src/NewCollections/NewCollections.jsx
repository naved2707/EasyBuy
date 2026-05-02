import React from 'react'
import "./NewCollections.css"
import new_collections from "../assets/newcollection.js"
import Item from '../Components/Item/Item'
const NewCollection = () => {
  return (
    <div className='newcollections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />

      <div className="collections">
      {new_collections.map((item,i)=>{
        return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.price} old_price={item.old_price}/>
      })}
      </div>
      </div>
      
  )
}

export default NewCollection 