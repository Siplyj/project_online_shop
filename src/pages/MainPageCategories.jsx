import { Link } from 'react-router-dom';
import classes from './MainPageCategories.module.css';

const MainPageCategories = () => {
    return (
        <section className={classes.mainpage_categories_wrapper} >
                <Link to="/woman">
                    <img
                        className={classes.mainpage_categories_big_image}
                        src="/files/mainpage/women.jpg"
                        alt="women category"
                    />
                </Link>
                <Link to="/man">
                    <img
                        className={classes.mainpage_categories_big_image}
                        src="/files/mainpage/men.jpg"
                        alt="men category"
                    />
                </Link>
                <Link to="/man">
                    <img
                        className={classes.mainpage_categories_small_image}
                        src="/files/mainpage/image_small_1.jpg"
                        alt="men category"
                    />
                </Link>
                <Link to="/man">
                    <img
                        className={classes.mainpage_categories_small_image}
                        src="/files/mainpage/image_small_2.jpg"
                        alt="men category"
                    />
                </Link>
                <Link to="/man">
                    <img
                        className={classes.mainpage_categories_small_image}
                        src="/files/mainpage/image_small_3.jpg"
                        alt="men category"
                    />
                </Link>
                <Link to="/man">
                    <img
                        className={classes.mainpage_categories_small_image}
                        src="/files/mainpage/image_small_4.jpg"
                        alt="men category"
                    />
                </Link>
            </section>
    )
};

export default MainPageCategories;