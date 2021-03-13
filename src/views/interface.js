import React from 'react';


import '../components/elements/canvas.css'
import '../App.css'

import GetWallet from "../components/app_elements/GetWalletForm";
import GUI from "../components/sections/InterfaceSection";
import axios from "axios";
const url='http://127.0.0.1:8001'
class Interface extends React.Component {

    render() {
        return (
            <GUI interface_child={<GetWallet/>}/>
        );
    }

}

export default Interface;
