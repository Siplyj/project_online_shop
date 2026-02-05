import MainPageAddress from 'components/MainPage/MainPageAddress';
import MainPageBrands from 'components/MainPage/MainPageBrands';
import MainPageCategories from 'components/MainPage/MainPageCategories';
import ProductsSlider from 'components/MainPage/ProductsSlider';

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