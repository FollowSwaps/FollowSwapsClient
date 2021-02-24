import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './canvas.css'
import Grid from '@material-ui/core/Grid';
import Modal from '../elements/Modal';
import Container from '@material-ui/core/Container';
import Input from "./Input";
import axios from 'axios';
import ButtonGroup from '../elements/ButtonGroup';
import {Link} from "react-router-dom";
import AnchorLink from "react-anchor-link-smooth-scroll";

const useStyles = makeStyles((theme) => ({
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
        flex: 1,
    },
    toolbarSecondary: {
        justifyContent: 'space-between',
        overflowX: 'auto',
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
    },
}));

export default function Header(props) {
    const classes = useStyles();

    // const openModal = (e) => {
    //     e.preventDefault();
    //     setVideomodalactive(true);
    // }
    //
    // const closeModal = (e) => {
    //     e.preventDefault();
    //     setVideomodalactive(false);
    // }
    //
    //
    // const ChangeWallet = (e) => {
    //
    //     axios.post(`/web_hook/add`, {'addr': InputVal})
    //         .then(res => {
    //             setWallet(res.data['addr']);
    //             setInput('')
    //             setErr(res.data['msg'])
    //             console.log(res);
    //             console.log(res.data);
    //         })
    //
    // }
    // const ChangeInput = (e) => {
    //     // console.log(e.target.value)
    //     setInput(e.target.value);
    // }
    // const get_init = (addr) => {
    //     setWallet(addr)
    // }

    // const [videoModalActive, setVideomodalactive] = useState(false);
    // const [Wallet, setWallet] = useState('asd');
    // const [InputVal, setInput] = useState();
    // const [Err, setErr] = useState('');
    // const [ignore, setIgnore] = useState(false);
    // const [InittVal, setInit] = useState();

    // useEffect(() => {
    //
    //     if (ignore === false) {
    //         // Update the document title using the browser API
    //         axios.get(`/web_hook/get`,)
    //             .then(res => {
    //                 console.log('get');
    //                 get_init(res.data['addr'])
    //                 setIgnore(true)
    //             })
    //     }
    // });

    return (
        <div className={classes.heroContent}>

            <Container>

                <Typography style={{fontFamily:'quando-regular', }} component="h3" variant="h3" align="center" gutterBottom>
                    Set up yours!
                </Typography>
                <Typography variant="h5" align="center" color="text" paragraph>
                    Bot is following the "donor" addresses and trading coins on Uniswap.

                </Typography>




<Grid container className={classes.root} spacing={1} justify="center">
<Grid item xs={6}>
                 <a href={'/app'} ><Button variant="contained"   style={{backgroundColor:'rgb(153,89,51)'}}>
                                Try beta
                            </Button></a>
</Grid>
    <Grid item xs={6}>
                  <Button  style={{ border: '1px solid rgb(153,89,51)'}}><a href='https://app.uniswap.org/#/swap?outputCurrency=0xd8fd31e40423a4cef8e4a488793e87bb5b7d876d' target={'_blank'}>Get WAPS token</a>

                    </Button>
    </Grid>
</Grid>



            </Container>

        </div>
    );
}
