import { Link } from 'react-router-dom';
import classes from './MainPageCategories.module.css';

const MainPageCategories = () => {
    return (
        <section className={classes.mainpage_categories_wrapper} >
            <Link className={classes.mainpage_categories_container} to="/women">
                <img
                    className={classes.mainpage_categories_big_image}
                    src="/files/mainpage/women.jpg"
                    alt="women category"
                />
                <div className={classes.mainpage_categories_text}>For women</div>
            </Link>
            <Link className={classes.mainpage_categories_container} to="/men">
                <img
                    className={classes.mainpage_categories_big_image}
                    src="/files/mainpage/men.jpg"
                    alt="men category"
                />
                <div className={classes.mainpage_categories_text}>For men</div>
            </Link>
            <Link to="/men">
                <img
                    className={classes.mainpage_categories_small_image}
                    src="/files/mainpage/image_small_1.jpg"
                    alt="men category"
                />
            </Link>
            <Link to="/men">
                <img
                    className={classes.mainpage_categories_small_image}
                    src="/files/mainpage/image_small_2.jpg"
                    alt="men category"
                />
            </Link>
            <Link to="/men">
                <img
                    className={classes.mainpage_categories_small_image}
                    src="/files/mainpage/image_small_3.jpg"
                    alt="men category"
                />
            </Link>
            <Link to="/men">
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