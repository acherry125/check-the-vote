import React from "react"

export const NavigationLink = (props) => {
 return (
 <a href="#{props.link}" className="nav-link">{props.name}</a>
    )
}


export default NavigationLink

