import React, {useState} from 'react';
import classNames from 'classnames';
import {SectionProps} from '../../utils/SectionProps';
import Header from '../elements/Head'
import '../../App.css'
const propTypes = {
    ...SectionProps.types
}

const defaultProps = {
    ...SectionProps.defaults
}

const Hero = ({
                  className,
                  topOuterDivider,
                  bottomOuterDivider,
                  topDivider,
                  bottomDivider,
                  hasBgColor,
                  invertColor,
                  ...props
              }) => {


    const outerClasses = classNames(
        'hero section center-content',
        topOuterDivider && 'has-top-divider',
        bottomOuterDivider && 'has-bottom-divider',
        hasBgColor && 'has-bg-color',
        invertColor && 'invert-color',
        className
    );

    const innerClasses = classNames(
        'hero-inner section-inner',
        topDivider && 'has-top-divider',
        bottomDivider && 'has-bottom-divider'
    );

    return (
        <section style={{marginBottom:30}}
            {...props}
            className={outerClasses}
        >

            <div className="container cont"  style={{flex:1}}>

                    <div className={innerClasses}>


                        <div className="hero-content">
                            <section id={'about'}>
                            <Header/>
                            </section>
                        </div>

                    </div>

            </div>

        </section>
    );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;