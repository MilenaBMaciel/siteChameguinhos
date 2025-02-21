import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RecipePage from './pages/recipePage';
import ProfilePage from './pages/profile';
import Layout from './components/layout';
import RegisterPage from './pages/register';
import SellRecipe from './pages/sellRecipe';
import FullRecipePage from './pages/fullRecipePage';
import MyRecipes from './pages/myRecipes';
import EditRecipe from './pages/editRecipe';
import Checkout from './pages/checkout';

function App() {
  return (
    <Router> {/* Envolvendo tudo com BrowserRouter */}
    <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="myRecipes" element={<MyRecipes />} />
          <Route path="editRecipe/:id" element={<EditRecipe />} />
          <Route path="/sellRecipe" element={<SellRecipe />} />
          <Route path="/fullRecipe/:id" element={<FullRecipePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
