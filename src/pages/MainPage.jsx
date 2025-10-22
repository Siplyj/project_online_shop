// import { Link } from 'react-router-dom';

import MainPageCategories from 'components/MainPageCategories';
import ProductsSlider from 'components/ProductsSlider';
import MainPageBrands from 'components/MainPageBrands';
import MainPageAddress from 'components/MainPageAddress';

const MainPage = () => {

    return (
        <>
            <MainPageCategories />
            <ProductsSlider title="Women’s clothing" description="New arrivals" gender="women" />
            <ProductsSlider title="Men’s clothing" description="New arrivals" gender="men" />
            <MainPageBrands />
            <MainPageAddress />
        </>
    )
};

export default MainPage;