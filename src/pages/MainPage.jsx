// import { Link } from 'react-router-dom';

import classes from './MainPage.module.css';
import MainPageCategories from '../components/MainPageCategories';
import MainPageProducts from '../components/MainPageProducts';
import MainPageBrands from '../components/MainPageBrands';
import MainPageAddress from '../components/MainPageAddress';

const MainPage = () => {

    return (
        <>
            <MainPageCategories />
            <MainPageProducts title="Women’s clothing" gender="women" />
            <MainPageProducts title="Men’s clothing" gender="men" />
            <MainPageBrands />
            <MainPageAddress />
        </>
    )
};

export default MainPage;