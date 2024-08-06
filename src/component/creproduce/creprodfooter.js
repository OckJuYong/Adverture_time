import React from "react";
import axios from "axios";
import Creprodfooterstyle from "./creprodfooter.module.css";
import { useNavigate } from "react-router-dom";

function Creprodfooter() {
    const navigate = useNavigate();

    const handlebackclick = () => {
        navigate("/credatepage");
    };

    const handlereturnclick = async () => {
        try {
            const response = await axios.post(
                'https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/travel/addition',
                {
                    travelStartDate: "2024-08-05T09:00:00",
                    travelEndDate: "2024-08-07T18:00:00",
                    location: "seoul",
                    latitude: 13.2222,
                    longitude: 2.3522,
                    travelRoute: [
                        {
                            vertex: "sex Tower",
                            latitude: 48.8584,
                            longitude: 2.2945
                        },
                        {
                            vertex: "pussy Museum",
                            latitude: 48.8606,
                            longitude: 2.3376
                        }
                    ]
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // 응답 데이터를 콘솔에 출력
            console.log('post 응답 메세지:', response.data);

            if (response.status === 200) {
                console.log('Match successful');
                navigate("/mateporp1");
            } else {
                console.error('Match failed');
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className={Creprodfooterstyle.prodfooterbox}>

        </div>
    );
}

export default Creprodfooter;