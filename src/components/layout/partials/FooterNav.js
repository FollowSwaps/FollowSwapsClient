import React, {useState} from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Input from "../../elements/Input";
import Button from "@material-ui/core/Button";
import axios from "axios";


const FooterNav = ({
  className,
  ...props
}) => {
    const [InputVal, setInput] = useState();


  const classes = classNames(
    'footer-nav',
    className
  );

  return ( <section id={'feedback'}>
    <nav
      {...props}
      className={classes}
    >
    </nav>
      </section>
  );
}

export default FooterNav;