import { Link } from "react-router-dom"
import { useEffect } from "react"
import "./SelectSchool.css"

export default function SelectSchool (){

   


    return(

    <div>
        <div>
            <h1>Find your school community</h1>
        </div>
        <div>
            <div className="school-searchbar">

            </div>
        </div>
        <div>
            <Link to={'/register'}>
                <button className="proceed-btn">
                    Proceed
                </button>
            </Link>
            
        </div>


    </div>
    )

}

