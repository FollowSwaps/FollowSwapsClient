import React from 'react';
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Image from "./Image";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import '../../App.css'


export default function CustomizedTimeline() {


    return (<div >
            <Typography component="h3" variant="h3" align="center" gutterBottom style={{fontFamily:'quando-regular'}}>
                Road map
            </Typography>
            <VerticalTimeline >

                <VerticalTimelineElement
                    style={{borderWidth: "0px"}}
                    // className="features-tiles-item-content"
                    contentStyle={{
                        background: 'rgb(21,23,25)',
                        boxShadow: '0 3px 0 rgb(153,89,51)',
                        borderRadius: '10px',
                    }}
                    contentArrowStyle={{borderRight: '7px solid  rgb(153,89,51)'}}
                    date="01/14/2021"
                    iconStyle={{background: 'rgb(21,23,25)', color: 'rgb(153,89,51)', boxShadow: "0 0 0 2px #995933"}}

                    icon={<Image
                        src={require('./../../assets/images/feature-tile-icon-01.svg')}
                        alt="Features tile icon 02"
                        width={64}
                        height={64}/>}
                >


                    <h4 style={{fontFamily:'quando-regular'}} className="mt-0 mb-8" >Pre sale</h4>
                    <p>Ended</p>


                </VerticalTimelineElement>

                <VerticalTimelineElement
                    style={{borderWidth: "0px"}}
                    // className="features-tiles-item-content"
                    contentStyle={{
                        background: 'rgb(21,23,25)',
                        boxShadow: '0 3px 0 rgb(153,89,51)',
                        borderRadius: '10px',

                    }}
                    contentArrowStyle={{borderRight: '7px solid  rgb(153,89,51)'}}
                    date="Q1/2021"
                              iconStyle={{background: 'rgb(21,23,25)', color: 'rgb(153,89,51)', boxShadow: "0 0 0 2px #995933"}}

                    icon={<Image
                        src={require('./../../assets/images/feature-tile-icon-02.svg')}
                        alt="Features tile icon 02"
                        width={64}
                        height={64}/>}
                >


                    <h4 style={{fontFamily:'quando-regular'}} className="mt-0 mb-8">Marketing</h4>
                  <p className="m-0 text-sm" style={{textAlign: 'left'}}>
                    rewards for active members
                    </p> <p className="m-0 text-sm" style={{textAlign: 'left'}}>
                    application to coingecko and CMC
                    </p>

                </VerticalTimelineElement>
                 <VerticalTimelineElement
                    style={{borderWidth: "0px"}}
                    // className="features-tiles-item-content"
                    contentStyle={{
                        background: 'rgb(21,23,25)',
                        boxShadow: '0 3px 0 rgb(153,89,51)',
                        borderRadius: '10px',

                    }}
                    contentArrowStyle={{borderRight: '7px solid  rgb(153,89,51)'}}
                    date="Q1/2021"
                              iconStyle={{background: 'rgb(21,23,25)', color: 'rgb(153,89,51)', boxShadow: "0 0 0 2px #995933"}}

                    icon={<Image
                        src={require('./../../assets/images/feature-tile-icon-02.svg')}
                        alt="Features tile icon 02"
                        width={64}
                        height={64}/>}
                >


                    <h4 style={{fontFamily:'quando-regular'}} className="mt-0 mb-8">Uniswap listing</h4>
                    <p className="m-0 text-sm" style={{textAlign: 'left'}}>
66% liquidity locked as well as the team's tokens
                    </p>

                </VerticalTimelineElement>
                <VerticalTimelineElement
                    style={{borderWidth: "0px"}}
                    // className="features-tiles-item-content"
                    contentStyle={{
                        background: 'rgb(21,23,25)',
                        boxShadow: '0 3px 0 rgb(153,89,51)',
                        borderRadius: '10px',

                    }}
                    contentArrowStyle={{borderRight: '7px solid  rgb(153,89,51)'}}
                    date="Q1/2021"
                                        iconStyle={{background: 'rgb(21,23,25)', color: 'rgb(153,89,51)', boxShadow: "0 0 0 2px #995933"}}

                    icon={<Image
                        src={require('./../../assets/images/feature-tile-icon-03.svg')}
                        alt="Features tile icon 02"
                        width={64}
                        height={64}/>}
                >


                    <h4 style={{fontFamily:'quando-regular'}} className="mt-0 mb-8">Make it available for everyone</h4>
                    <p className="m-0 text-sm" style={{textAlign: 'left'}}>
                        Bot beta was rolled out on 14/01/21
                    </p><p className="m-0 text-sm" style={{textAlign: 'left'}}>
                        You need to hold WAPS token
                    </p>

                </VerticalTimelineElement>
                <VerticalTimelineElement
                    style={{borderWidth: "0px"}}
                    // className="features-tiles-item-content"
                    contentStyle={{
                        background: 'rgb(21,23,25)',
                        boxShadow: '0 3px 0 rgb(153,89,51)',
                        borderRadius: '10px',

                    }}
                    contentArrowStyle={{borderRight: '7px solid  rgb(153,89,51)'}}
                    date="Q1/2021"
                                        iconStyle={{background: 'rgb(21,23,25)', color: 'rgb(153,89,51)', boxShadow: "0 0 0 2px #995933"}}

                    icon={<Image
                        src={require('./../../assets/images/feature-tile-icon-06.svg')}
                        alt="Features tile icon 02"
                        width={64}
                        height={64}/>}
                >


                    <h4 style={{fontFamily:'quando-regular'}} className="mt-0 mb-8">Improving</h4>
                    <p className="m-0 text-sm" style={{textAlign: 'left'}}>
                        telegram integration</p>
                        <p className="m-0 text-sm" style={{textAlign: 'left'}}>range of filters </p>
                        <p className="m-0 text-sm" style={{textAlign: 'left'}}>other options depending on your suggestions
                    </p>

                </VerticalTimelineElement>
                <VerticalTimelineElement
                    style={{borderWidth: "0px"}}
                    // className="features-tiles-item-content"
                    contentStyle={{
                        background: 'rgb(21,23,25)',
                        boxShadow: '0 3px 0 rgb(153,89,51)',
                        borderRadius: '10px',

                    }}
                    contentArrowStyle={{borderRight: '7px solid  rgb(153,89,51)'}}
                    date="Q1/2021"
                                        iconStyle={{background: 'rgb(21,23,25)', color: 'rgb(153,89,51)', boxShadow: "0 0 0 2px #995933"}}

                    icon={<Image
                        src={require('./../../assets/images/feature-tile-icon-06.svg')}
                        alt="Features tile icon 02"
                        width={64}
                        height={64}/>}
                >


                    <h4 style={{fontFamily:'quando-regular'}} className="mt-0 mb-8">Launching local version</h4>
                    <p className="m-0 text-sm" style={{textAlign: 'left'}}>
                        Add limit order feature
                    </p><p className="m-0 text-sm" style={{textAlign: 'left'}}>
                        Add stop losses
                    </p>
<p className="m-0 text-sm" style={{textAlign: 'left'}}>
                        Free for WAPS holders
                    </p>

                </VerticalTimelineElement>

                <VerticalTimelineElement
                    style={{borderWidth: "0px"}}
                    // className="features-tiles-item-content"
                    contentStyle={{
                        background: 'rgb(21,23,25)',
                        boxShadow: '0 3px 0 rgb(153,89,51)',
                        borderRadius: '10px',

                    }}
                    contentArrowStyle={{borderRight: '7px solid  rgb(153,89,51)'}}
                    date="Q1/2021"
                                        iconStyle={{background: 'rgb(21,23,25)', color: 'rgb(153,89,51)', boxShadow: "0 0 0 2px #995933"}}

                    icon={<Image
                        src={require('./../../assets/images/feature-tile-icon-02.svg')}
                        alt="Features tile icon 02"
                        width={64}
                        height={64}/>}
                >


                    <h4 style={{fontFamily:'quando-regular'}} className="mt-0 mb-8">Listing WAPS</h4>
                    <p className="m-0 text-sm" style={{textAlign: 'left'}}>
                        list on major exchanges
                    </p>

                </VerticalTimelineElement>


            </VerticalTimeline>
        </div>
    );
}