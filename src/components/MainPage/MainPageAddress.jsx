import { Link } from 'react-router-dom';
import classes from './MainPageAddress.module.css';

const MainPageAddress = () => {
    return (
        <section className={classes.mainpage_address_wrapper}>
            <p className={classes.mainpage_address_wrapper_title}>Our showroom</p>
            <div className={classes.mainpage_address_details}>
                <img
                    className={classes.mainpage_interior_photo}
                    src={`./files/mainpage/interior_photo.webp`}
                    alt="Our showroom"
                />
                <div className={classes.mainpage_address_section}>
                    <div className={classes.mainpage_address_line}>
                        <p className={classes.mainpage_address_title}>Address:</p>
                        <p className={classes.mainpage_address_description}>Warsaw, Wołoska 12, 02-675</p>
                    </div>
                    <div className={classes.mainpage_address_line}>
                        <p className={classes.mainpage_address_title}>Contacts:</p>
                        <p className={classes.mainpage_address_description}>+48 555 555 555</p>
                        <p className={classes.mainpage_address_description}>Mon-Sat 10:00-22:00</p>
                    </div>
                    <Link
                        to="https://maps.app.goo.gl/uLpan6PoKHoJgZHDA"
                        className={classes.mainpage_address_title}
                        target="_blank"
                    >
                        View on the map
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default MainPageAddress;