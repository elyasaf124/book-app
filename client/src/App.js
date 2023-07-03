import React from "react";
import { Routes, Route } from "react-router-dom";
import './app.css'
import Account from "./Components/account/Account";
import AddBook from "./Components/addBook/AddBook";
import ForgetPassword from "./Components/auth/forgetpassword/Forgetpassword";
import ResetPassword from "./Components/auth/resetPassword/ResetPassword";
import Cart from "./Components/cart/Cart";
import DisplayBook from "./Components/displayBook/DisplayBook";
import Header from "./Components/header/Header";
import Home from './Components/home/Home'
import LoginModel from "./Components/loginModel/LoginModel";
import Logo from "./Components/logo/logo";
import MyBooks from "./Components/mybooks/mybooks";
import OneCard from "./Components/oneCard/OneCard";
import RegisterModel from "./Components/registerModel/RegisterModel";
import SearchResult from "./Components/searchResult/SearchResult";
import PrivateRoutes from "./privateRoutes";
import BooksConfirm from './Components/booksConfirm/BooksConfirm'
import FotterContact from "./Components/fotterContact/FotterContact";
import Footer from "./Components/footer/Footer";
import SuccessPayment from "./Components/successPayment/SuccessPayment";


function App() {


  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/addBook" element={<AddBook />} />
          <Route path="/MyBooks" element={<MyBooks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/myAccount" element={<Account />} />
          <Route path="/order/success" element={<SuccessPayment />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/booksConfirm" element={<BooksConfirm />} />
        <Route element={<Header />} />
        <Route path="/loginModel" element={<LoginModel />} />
        <Route path="/logo" element={<Logo />} />
        <Route path="/cardItem" element={<OneCard />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/users/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/book/:bookId" element={<DisplayBook />} />
        <Route path="/searchResult" element={<SearchResult />} />
        <Route path="/register" element={<RegisterModel />} />
      </Routes>
      <FotterContact />
      <Footer />
    </div>
  );
}

export default App;
