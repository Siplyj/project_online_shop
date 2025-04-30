import { Link } from 'react-router-dom';

import classes from './Footer.module.css';

const Footer = () => {
    return (
        <div className={classes.footer_wrapper}>
            <footer className={classes.footer}>

                <div className={classes.footer_contacts}>
                    <Link to="tel:+48555555555" className={classes.footer_contacts_phone}>+48 555 555 555</Link>
                    <Link to="https://maps.app.goo.gl/zNgvWio3GFKyWpqD7" className={classes.footer_contacts_address}>Warsaw, Wołoska 12, 02-675</Link>
                </div>

                <Link to="/" className={classes.footer_logo}>
                    <img className={classes.footer_logo_image} src="../files/logo.svg" alt="Newtone" title="Newtone" />
                </Link>

                <div className={classes.footer_social_icons}>
                    <Link to="https://telegram.com/" >
                        <img className={classes.footer_social_image} src="../files/footer_icons/telegram.png" alt="Telegram" title="Telegram" />
                    </Link>
                    <Link to="https://fb.com/" >
                        <img className={classes.footer_social_image} src="../files/footer_icons/facebook.png" alt="Facebook" title="Facebook" />
                    </Link>
                    <Link to="https://youtube.com/" >
                        <img className={classes.footer_social_image} src="../files/footer_icons/youtube.png" alt="Youtube" title="Youtube" />
                    </Link>
                    <Link to="https://instagram.com/" >
                        <img className={classes.footer_social_image} src="../files/footer_icons/instagram.png" alt="Instagram" title="Instagram" />
                    </Link>
                </div>

                <div className={classes.footer_payment_systems }>
                    <img className={classes.footer_payment_system} src="../files/footer_icons/mastercard.svg" alt="Mastercard" title="Mastercard" />
                    <img className={classes.footer_payment_system} src="../files/footer_icons/visa.svg" alt="Visa" title="Visa" />
                    <img className={classes.footer_payment_system} src="../files/footer_icons/paypal.svg" alt="Paypal" title="Paypal" />
                    <img className={classes.footer_payment_system} src="../files/footer_icons/google_pay.svg" alt="Google Pay" title="Google Pay" />
                    <img className={classes.footer_payment_system} src="../files/footer_icons/apple_pay.svg" alt="Apple Pay" title="Apple Pay" />
                </div>

            </footer>
        </div>
    )
}

export default Footer;