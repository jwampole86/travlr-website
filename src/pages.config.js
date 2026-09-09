/**
 * pages.config.js - Page routing configuration
 *
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 *
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 */
import About from './pages/About';
import AboutReference from './pages/AboutReference';
import Activities from './pages/Activities';
import Contact from './pages/Contact';
import GuestResources from './pages/GuestResources';
import GuestServices from './pages/GuestServices';
import Homeowners from './pages/Homeowners';
import PropertyDetail from './pages/PropertyDetail';
import SearchResults from './pages/SearchResults';
import Home from './pages/Home';
import HomeReference from './pages/HomeReference';


export const PAGES = {
    "About": AboutReference,
    "Activities": Activities,
    "Contact": Contact,
    "GuestResources": GuestResources,
    "GuestServices": GuestServices,
    "Homeowners": Homeowners,
    "PropertyDetail": PropertyDetail,
    "SearchResults": SearchResults,
    "Home": HomeReference,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};