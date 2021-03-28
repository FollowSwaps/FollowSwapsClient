import React from 'react';
import classNames from 'classnames';
import {SectionSplitProps} from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';
import CustomizedTimeline from '../elements/timeLine'
import {Link} from "react-router-dom";
import AnchorLink from "react-anchor-link-smooth-scroll";
import Typography from "@material-ui/core/Typography";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Copy from '../elements/copy'
import Copys from '../elements/copy2'
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const propTypes = {
    ...SectionSplitProps.types
}

const defaultProps = {
    ...SectionSplitProps.defaults
}

const FeaturesSplit = ({
                           className,
                           topOuterDivider,
                           bottomOuterDivider,
                           topDivider,
                           bottomDivider,
                           hasBgColor,
                           invertColor,
                           invertMobile,
                           invertDesktop,
                           alignTop,
                           imageFill,
                           ...props
                       }) => {

    const outerClasses = classNames(
        'features-split section',
        topOuterDivider && 'has-top-divider',
        bottomOuterDivider && 'has-bottom-divider',
        hasBgColor && 'has-bg-color',
        invertColor && 'invert-color',
        className
    );
    const tilesClasses = classNames(
        'tiles-wrap center-content',
        'push-left'
    );
    const innerClasses = classNames(
        'features-split-inner section-inner',
        topDivider && 'has-top-divider',
        bottomDivider && 'has-bottom-divider'
    );

    const splitClasses = classNames(
        'split-wrap',
        invertMobile && 'invert-mobile',
        invertDesktop && 'invert-desktop',
        alignTop && 'align-top'
    );

    const sectionHeader = {
        title: 'Why do you need this Bot?',
        paragraph: "Have you ever witnessed Whales or Twitter influencers on Etherscan, holding large positions of coins  and then the next minute you check, see that they've dumped half of their portfolio? Maybe you've even tried to copy them, though selling after them puts you in an unprofitable position." +
            "\nThe truth is, it's near impossible to follow successful wallets and be profitable as human speed is merely not fast enough. Most of the time, price changes too fast, and you can't copy every move successfully. With the Follow Swaps bot, you unlock the opportunity to follow any ETH address and even front-run them. "
    };

    return (
        <section
            {...props}
            className={outerClasses}
        >
            <div className="container">

                <div className={innerClasses}>
                    <h2 className={'mt-0 mb-16'} style={{textAlign: 'center', fontFamily: 'quando-regular'}}>Why do you
                        need this Bot?</h2>
                    <p className={'m-2 mb-16 pb-2'} style={{textAlign: 'between'}}> Have you ever witnessed Whale or
                        Twitter influencers on Etherscan, holding large positions of coins and then the next minute
                        you check, see that they've dumped half of their portfolio? Maybe you've even tried to copy
                        them?</p>
                    <p className={'m-2 mb-16 pb-2'} style={{textAlign: 'between'}}>The truth is, it's near impossible to
                        follow successful wallets and be profitable as human speed
                        is merely not fast enough. Most of the time, price changes too quick, and you can't copy every
                        trade successfully.</p>
                    <p className={'m-2 mb-16 pb-2'} style={{textAlign: 'between'}}> With the Follow Swaps bot, you
                        unlock the opportunity to follow any ETH address and even
                        front-run them.</p>
                    <div className={splitClasses}>
                        <div className="split-item">
                            <div className="split-item-content center-content-mobile reveal-from-left"
                                 data-reveal-container=".split-item">
                                <AnchorLink href='#feedback'><Link to="#feedback">
                                    <div className="text-xxs text-color-primary fw-600 tt-u mb-8 pt-12 mt-32"
                                         style={{color: 'rgb(153,89,51)'}}>
                                        You can also ask us for more information
                                    </div>
                                </Link></AnchorLink>
                                <h3 className="mt-0 mb-12" style={{fontFamily: 'quando-regular'}}>
                                    How it works
                                </h3>
                                <p className="m-0">
                                    <ul>
                                        <li>
                                            Stage 1: donor account creates transaction, the bot doesn't follow/front run
                                            it
                                        </li>
                                        <li>Stage 2: transaction is pending and waiting in mempool to be picked up by
                                            miners.
                                        </li>
                                        <li>
                                            Stage 3: bot applies some filters and higher gas price to push our
                                            transaction first
                                        </li>
                                        <li>Done! We have front-run the donor's transaction and bought/sold first.

                                        </li>
                                        <Typography component="p" variant="p" align="left" gutterBottom
                                                    style={{fontFamily: 'quando-regular', fontSize: '14px'}}>
                                            *a donor is a wallet that you want to follow, normally profitable
                                            traders or telegram/twitter influencers.
                                        </Typography>

                                    </ul>
                                </p>
                            </div>
                            <div className={
                                classNames(
                                    'split-item-image center-content-mobile reveal-from-bottom',
                                    imageFill && 'split-item-image-fill'
                                )}
                                 data-reveal-container=".split-item">
                                <Image
                                    src={require('./../../assets/images/v1.png')}
                                    alt="Features split 01"
                                    width={528}
                                    height={396}/>
                            </div>
                        </div>
                    </div>
                    <div className="split-item">
                        <div className="split-item-content center-content-mobile reveal-from-left"
                             data-reveal-container=".split-item">
                            <section id={'roadMap'}>
                                <CustomizedTimeline/>
                            </section>
                        </div>
                    </div>
                    <section id={'token'}>
                        <div className="container">
                            <div className={innerClasses}>
                                <Typography component="h3" variant="h3" align="center" gutterBottom
                                            style={{fontFamily: 'quando-regular'}}>
                                    <a href={'https://etherscan.io/address/0xd8fd31e40423a4cef8e4a488793e87bb5b7d876d'}>WAPS</a> Tokenomics
                                </Typography>

                                <div className={tilesClasses} align='center'>

                                    <div className="tiles-item reveal-from-bottom">
                                        <div className="tiles-item-inner">
                                            <div className="features-tiles-item-header">
                                                <div className="features-tiles-item-image mb-16">
                                                    <Image
                                                        src={require('./../../assets/images/349436591579680320.svg')}
                                                        style={{
                                                            background: 'rgb(21,23,25)',

                                                        }}

                                                        alt="Features tile icon 01"
                                                        width={64}
                                                        height={64}/>
                                                </div>
                                            </div>
                                            <div className="features-tiles-item-content">
                                                <h4 style={{fontFamily: 'quando-regular'}} className="mt-0 mb-8">
                                                    WAPS token


                                                </h4>
                                                <p className="m-0 text-sm">
                                                    1699.5 WAPS Max Token Supply
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                                        <div className="tiles-item-inner">
                                            <div className="features-tiles-item-header">
                                                <div className="features-tiles-item-image mb-16">
                                                    <Image
                                                        src={require('./../../assets/images/coin.svg')}
                                                        style={{
                                                            background: 'rgb(21,23,25)',

                                                        }}
                                                        alt="Features tile icon 02"
                                                        width={64}
                                                        height={64}/>
                                                </div>
                                            </div>
                                            <div className="features-tiles-item-content">
                                                <h4 style={{fontFamily: 'quando-regular'}} className="mt-0 mb-8">
                                                    1359.6 WAPS Initial Circulating

                                                </h4>
                                                <p className="m-0 text-sm">
                                                    339.9 will be locked for 3 months

                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                                        <div className="tiles-item-inner">
                                            <div className="features-tiles-item-header">
                                                <div className="features-tiles-item-image mb-16">
                                                    <Image
                                                        src={require('./../../assets/images/tlf.svg')}
                                                        style={{
                                                            background: 'rgb(21,23,25)',

                                                        }}
                                                        alt="Features tile icon 02"
                                                        width={64}
                                                        height={64}/>
                                                </div>
                                            </div>
                                            <div className="features-tiles-item-content">
                                                <h4 style={{fontFamily: 'quando-regular'}} className="mt-0 mb-8">
                                                    849.75 WAPS pre-sale

                                                </h4>
                                                <p className="m-0 text-sm">
                                                    0.12 ETH per token, 101 ETH was raised

                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tiles-item reveal-from-bottom" data-reveal-delay="400">
                                        <div className="tiles-item-inner">
                                            <div className="features-tiles-item-header">
                                                <div className="features-tiles-item-image mb-16">
                                                    <Image
                                                        src={require('./../../assets/images/chart.svg')}
                                                        style={{
                                                            background: 'rgb(21,23,25)',

                                                        }}
                                                        alt="Features tile icon 03"
                                                        width={64}
                                                        height={64}/>
                                                </div>
                                            </div>
                                            <div className="features-tiles-item-content">
                                                <h4 style={{fontFamily: 'quando-regular'}} className="mt-0 mb-8">
                                                    407 WAPS and 67.7 ETH


                                                </h4>
                                                <p className="m-0 text-sm">
                                                    added to uniswap liquidity pool
                                                    0.16 ETH per 1 WAPS Uniswap listing price

                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tiles-item reveal-from-bottom">
                                        <div className="tiles-item-inner">
                                            <div className="features-tiles-item-header">
                                                <div className="features-tiles-item-image mb-16">
                                                    <Image
                                                        src={require('./../../assets/images/glob.svg')}
                                                        style={{
                                                            background: 'rgb(21,23,25)',

                                                        }}
                                                        alt="Features tile icon 04"
                                                        width={64}
                                                        height={64}/>
                                                </div>
                                            </div>
                                            <div className="features-tiles-item-content">
                                                <h4 style={{fontFamily: 'quando-regular'}} className="mt-0 mb-8">
                                                    101 WAPS


                                                </h4>
                                                <p className="m-0 text-sm">
                                                    will be used in the first 3 months for marketing
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                                        <div className="tiles-item-inner">
                                            <div className="features-tiles-item-header">
                                                <div className="features-tiles-item-image mb-16">
                                                    <Image
                                                        src={require('./../../assets/images/hand2.svg')}
                                                        style={{
                                                            background: 'rgb(21,23,25)',

                                                        }}
                                                        alt="Features tile icon 05"
                                                        width={64}
                                                        height={64}/>
                                                </div>
                                            </div>
                                            <div className="features-tiles-item-content">
                                                <h4 style={{fontFamily: 'quando-regular'}} className="mt-0 mb-8">
                                                    339.9 WAPS currently not in circulation


                                                </h4>
                                                <p className="m-0 text-sm">
                                                    255 WAPS for a team locked for 3 months
                                                </p><p className="m-0 text-sm">
                                                84.9 WAPS for future marketing locked for 3 months
                                            </p>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </section>
                    <section id={'waps'}>
                        <Typography component="h3" variant="h3" align="center" gutterBottom
                                    style={{fontFamily: 'quando-regular'}}>
                            Get<a href={'https://www.dextools.io/app/uniswap/pair-explorer/0xb8cd44ca2560d340019a50b1d18f67a5ed0cdf97'}
                                  target={'_blank'}> WAPS</a>
                        </Typography>
                        <Typography component="h5" variant="h5" align="center" gutterBottom
                                    style={{fontFamily: 'quando-regular'}}>
                            Presale ended, 101 ETH was raised
                        </Typography>
                        <div style={{marginTop: '40px', textAlign: "center"}}>

                            </div>
                            <Grid container  spacing={1} justify="center">
                            <ul style={{  listStylePosition: 'inside'}}>
                            <li><a href={'https://v2.unicrypt.network/pair/0xb8cd44ca2560d340019a50b1d18f67a5ed0cdf97'}
                                  target={'_blank'}>🔒 Liquidity locked on Unicrypt for 3 months</a></li>
                            <li><a href={'https://etherscan.io/tx/0x7f46bd121713febc00710fe3ab7da0b44a1b1f11b9307e43be60c4c34b348dcd'}
                                  target={'_blank'}>🔒 Team Tokens locked for 3 months</a></li>
                            <li>1699.5 WAPS Max Token Supply
<a href={'https://v2.unicrypt.network/pair/0xb8cd44ca2560d340019a50b1d18f67a5ed0cdf97'}
                                  target={'_blank'}> (3300.5 WAPS was burnt)</a> </li>
                            <li>Presale Price: <span style={{color: 'rgb(153,89,51)'}}>0.12 ETH</span> per 1 WAPS</li>
                                <li>Uniswap listing price <span style={{color: 'rgb(153,89,51)'}}>0.16 ETH</span> per 1 WAPS</li>


                            </ul>
                        </Grid>
                        <div style={{marginTop: '40px', textAlign: "center"}}>
                            <p><span style={{color: 'rgb(153,89,51)'}}>WAPS</span> address:
                                0xd8fd31e40423a4cef8e4a488793e87bb5b7d876d</p>
                            <Copys/>
                        </div>



                    </section>
                </div>
            </div>
        </section>
    );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;