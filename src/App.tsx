import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import Gifts from './pages/Gifts';
import Stories from './pages/Stories';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <header className="nav">
        <h1>City Vibes</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/gifts">Gifts</Link>
          <Link to="/stories">Stories</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/stories" element={<Stories />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
