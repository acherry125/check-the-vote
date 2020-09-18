import React from "react"

export const NavigationLink = (props) => {
 return (
 <li className="nav-list-item"><a href="#{props.link}" className="nav-link">{props.name}</a></li>
    )
}


export default NavigationLink

