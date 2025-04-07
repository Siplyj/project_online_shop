import { Link } from 'react-router-dom';

import classes from './Header.module.css';

const Header = () => {
    return (
        <div className={classes.header_wrapper}>
            <header className={classes.header}>

                <div className={classes.header_logo}>
                    <img className={classes.header_logo_image} src="../files/logo.svg" alt="Newtone" title="Newtone" />
                </div>

                <div className={classes.header_icons}>
                    <div className={classes.header_icon}>
                        <Link className={classes.header_icon_link} to="/account">
                            <span className={`${classes.header_icon_symbol} material-symbols-outlined`}>person</span>
                        </Link>
                        <Link className={classes.header_icon_link} to="/favorite">
                            <span className={`${classes.header_icon_symbol} material-symbols-outlined`}>favorite</span>
                        </Link>
                        <Link className={classes.header_icon_link} to="/cart">
                            <span className={`${classes.header_icon_symbol} material-symbols-outlined`}>shopping_cart</span>
                            <span className={classes.header_total_price}>0.00 EUR</span>
                        </Link>
                    </div>
                </div>

                <div className={classes.header_categories}>
                    <div className={classes.header_gender}>
                        <Link className={classes.header_gender_link} to="/woman">Женщинам
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </Link>
                        <ul className={classes.header_gender_dropdown_menu}>
                            <div className={classes.header_gender_dropdown_items}>
                                <li className={classes.header_gender_dropdown_item}>
                                    <Link to="/woman/popular">Популярное</Link>
                                </li>
                                <li className={classes.header_gender_dropdown_item}>
                                    <Link to="/woman/clothes">Одежда</Link>
                                </li>
                                <li className={classes.header_gender_dropdown_item}>
                                    <Link to="/woman/shoes">Обувь</Link>
                                </li>
                                <li className={classes.header_gender_dropdown_item}>
                                    <Link to="/woman/accessories">Аксессуары</Link>
                                </li>
                            </div>
                        </ul>
                    </div>
        
                    <div className={classes.header_gender}>
                        <Link className={classes.header_gender_link} to="/man">Мужчинам
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </Link>
                        <ul className={classes.header_gender_dropdown_menu}>
                            <div className={classes.header_gender_dropdown_items}>
                                <li className={classes.header_gender_dropdown_item}>
                                    <Link to="/man/popular">Популярное</Link>
                                </li>
                                <li className={classes.header_gender_dropdown_item}>
                                    <Link to="/man/clothes">Одежда</Link>
                                </li>
                                <li className={classes.header_gender_dropdown_item}>
                                    <Link to="/man/shoes">Обувь</Link>
                                </li>
                                <li className={classes.header_gender_dropdown_item}>
                                    <Link to="/man/accessories">Аксессуары</Link>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header;