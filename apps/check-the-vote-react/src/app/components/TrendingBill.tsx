import React, {useState} from "react";
import TrendingBill from './BillItem';

export const BillItem = () => {


  return (
    <section className="bill-item">
      <img src="" alt="" className="bill-image"/>
      <div className="bill-item-info">
        <h3 className="bill-item-title">Bill Number</h3>
        <p className="bill-item-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni accusamus cum, vel ut dolores iure quod ea eaque ad ipsum quidem exercitationem unde eius similique provident, quos iste at excepturi.</p>
        
      </div>
    </section>
  )
}

export default TrendingBill