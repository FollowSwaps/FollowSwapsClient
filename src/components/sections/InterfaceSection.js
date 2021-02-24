import React from 'react';
import classNames from 'classnames';
import {SectionProps} from '../../utils/SectionProps';

import '../../App.css'
const propTypes = {
    ...SectionProps.types
}

const defaultProps = {
    ...SectionProps.defaults
}

const GUI = ({
                  className,
                  topOuterDivider,
                  bottomOuterDivider,
                  topDivider,
                  bottomDivider,
                  hasBgColor,
                  invertColor,
                  interface_child,
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
                                {interface_child}
                            </section>
                        </div>

                    </div>

            </div>

        </section>
    );
}

GUI.propTypes = propTypes;
GUI.defaultProps = defaultProps;

export default GUI;