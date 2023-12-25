import ToggleColorMode from "./components/ToggleColorMode";
import Allroutes from "./components/routes";
import socket from "./socket";

function App() {
  socket.connect();
  return (
    <>
      <ToggleColorMode />
      <Allroutes />
    </>
  );
}

export default App;
