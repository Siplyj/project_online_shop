import { Outlet } from "react-router-dom";
import Header from '../components/Header';

const RootLayout = () => {
    return (
        <>
            <Header />
            <Outlet /> {/* В этом месте будет рендериться MainPage */}
        </>
    )
};

export default RootLayout;