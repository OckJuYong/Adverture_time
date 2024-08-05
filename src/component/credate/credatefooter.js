import React from "react";
import Credatefooterstyles from "./credatefooter.module.css"
import { useNavigate } from "react-router-dom";
function Credatefooter(){
    const navigate=useNavigate();
    const handlebackclick=()=>{
        navigate("/createpage1")
    }
    const handlereturnclick=()=>{
        navigate("/creproducepage")
    }
    return(
        <div className={Credatefooterstyles.datefooterbox}>
            <div className={Credatefooterstyles.datecreleftbutton}>
                <div className={Credatefooterstyles.datecrebuttontext1} onClick={handlebackclick}>이전</div>
                <div className={Credatefooterstyles.datecresold1}></div>
            </div>
            <div className={Credatefooterstyles.datecrerightbutton}>
                <div className={Credatefooterstyles.datecrebuttontext2} onClick={handlereturnclick}>다음</div>
                <div className={Credatefooterstyles.datecresold2}></div>
            </div>
        </div>
    );

}
export default Credatefooter;