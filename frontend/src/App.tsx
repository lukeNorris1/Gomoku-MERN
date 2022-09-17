import { Route, Routes } from "react-router-dom";
import { Header, UserProvider, BoardProvider } from "./components";
import { Home, Login, Game, GameHistory, GameHistoryDetails } from "./pages";

import "./App.css";

function App() {
  return (
    <>
      <UserProvider>
        <BoardProvider>
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="Login" element={<Login />} />
              <Route path="Game/" element={<Game />} />
              <Route path="GameHistory" element={<GameHistory />} />
              <Route path="game-log:boardId" element={<GameHistoryDetails />} />
            </Routes>
          </main>
        </BoardProvider>
      </UserProvider>
    </>
  );
}

export default App;
