import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecipeSearch from './components/RecipeSearch';
import AuthForm from './components/AuthForm';
import { useAuthStore } from './store/authStore';

function App() {
  const token = useAuthStore((state) => state.token);
  return (
      <div>
        {token ? (
          <RecipeSearch /> 
        ) : (
          <AuthForm />
        )}
      </div>
    );
}

export default App