// components/HomeButton.tsx
import { Link } from 'react-router-dom';

const HomeButton: React.FC = () => {
  return (
    <div className="text-left mt-4">
      <Link to="/">
        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">
          Voltar para a Home
        </button>
      </Link>
    </div>
  );
};

export default HomeButton;
