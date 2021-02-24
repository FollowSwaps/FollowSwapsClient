import React from 'react';
import ReactDOM from 'react-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Button from "@material-ui/core/Button";
class Copys extends React.Component {
  state = {
    value: '0xd8fd31e40423a4cef8e4a488793e87bb5b7d876d',
    copied: false,
      variant:'outlined',
      txt:'Copy WAPS address'
  };

  render() {
    return (
      <Button variant={'outlined'} style={{backgroundColor:'rgb(153,89,51)',marginBottom:'30px'}}>


<a target={'_blank'} href={'https://www.dextools.io/app/uniswap/pair-explorer/0xb8cd44ca2560d340019a50b1d18f67a5ed0cdf97'} style={{color:'black'}}>Look at dextools</a>
      </Button>
    );
  }
}

export default Copys;