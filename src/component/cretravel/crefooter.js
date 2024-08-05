import React from "react";
import Crefooterstyle from "./crefooter.module.css"
import { useNavigate } from "react-router-dom";
function Crefooter(){
    const navigate=useNavigate()
    const handledatepageclick=()=>{
        navigate("/credatepage")
    }
    return(
        <div className={Crefooterstyle.crefootercontainer}>
            <div className={Crefooterstyle.creleftbutton}>
                <div className={Crefooterstyle.crebuttontext1}>이전</div>
                <div className={Crefooterstyle.cresold1}></div>
            </div>
            <div className={Crefooterstyle.crerightbutton}>
                <div className={Crefooterstyle.crebuttontext2} onClick={handledatepageclick}>다음</div>
                <div className={Crefooterstyle.cresold2}></div>
            </div>
        </div>
    );
}
export default Crefooter;