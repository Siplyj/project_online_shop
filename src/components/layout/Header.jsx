import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectFavoriteCount } from 'store/favoritesSlice';

import useAuth from 'hooks/useAuth';
import classes from './Header.module.css';

const Header = ({ onLoginClick }) => {
  const { authStatus, logout } = useAuth();

  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalFavoriteQuantity = useSelector(selectFavoriteCount);

  const handleProfileClick = (e) => {
    if (authStatus === 'configuring') {
      e.preventDefault();
      return;
    }
    
    if (authStatus !== 'authenticated') {
      e.preventDefault();
      onLoginClick();
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className={classes.header_wrapper}>
      <header className={classes.header}>
        <Link to="/" className={classes.header_logo}>
          <img
            className={classes.header_logo_image}
            src="./files/logo.svg"
            alt="Newtone"
            title="Newtone"
          />
        </Link>

        <div className={classes.header_icons}>
          <div className={classes.header_icon}>
            <Link
              className={classes.header_icon_link}
              to={authStatus === 'authenticated' ? '/account' : '#'}
              onClick={handleProfileClick}
            >
              <span className={`${classes.header_icon_symbol} material-symbols-outlined`}>
                person
              </span>
            </Link>

            {authStatus === 'authenticated' && (
              <Link className={classes.header_icon_link} to="#" onClick={handleLogoutClick}>
                <span className={`${classes.header_icon_symbol} material-symbols-outlined`}>
                  logout
                </span>
              </Link>
            )}

            {authStatus === 'authenticated' && (
              <Link className={classes.header_icon_link} to="/favorite">
                <span className={`${classes.header_icon_symbol} material-symbols-outlined`}>
                  favorite
                </span>

                {totalFavoriteQuantity > 0 && (
                  <span className={classes.header_cart_badge}>{totalFavoriteQuantity}</span>
                )}
              </Link>
            )}

            <Link className={classes.header_icon_link} to="/cart">
              <span className={`${classes.header_icon_symbol} material-symbols-outlined`}>
                shopping_cart
              </span>

              {totalQuantity > 0 && (
                <span className={classes.header_cart_badge}>{totalQuantity}</span>
              )}

              <span className={classes.header_total_price}>
                {totalAmount.toFixed(2)} EUR
              </span>
            </Link>
          </div>
        </div>

        <div className={classes.header_categories}>
          <div className={classes.header_gender}>
            <Link className={classes.header_gender_link} to="/women">
              For women
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </Link>
            <ul className={classes.header_gender_dropdown_menu}>
              <div className={classes.header_gender_dropdown_items}>
                <li className={classes.header_gender_dropdown_item}>
                  <Link to="/women/popular">Popular</Link>
                </li>
                <li className={classes.header_gender_dropdown_item}>
                  <Link to="/women/clothes">Clothing</Link>
                </li>
                <li className={classes.header_gender_dropdown_item}>
                  <Link to="/women/shoes">Shoes</Link>
                </li>
                <li className={classes.header_gender_dropdown_item}>
                  <Link to="/women/accessories">Accessories</Link>
                </li>
              </div>
            </ul>
          </div>

          <div className={classes.header_gender}>
            <Link className={classes.header_gender_link} to="/men">
              For men
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </Link>
            <ul className={classes.header_gender_dropdown_menu}>
              <div className={classes.header_gender_dropdown_items}>
                <li className={classes.header_gender_dropdown_item}>
                  <Link to="/men/popular">Popular</Link>
                </li>
                <li className={classes.header_gender_dropdown_item}>
                  <Link to="/men/clothes">Clothing</Link>
                </li>
                <li className={classes.header_gender_dropdown_item}>
                  <Link to="/men/shoes">Shoes</Link>
                </li>
                <li className={classes.header_gender_dropdown_item}>
                  <Link to="/men/accessories">Accessories</Link>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;