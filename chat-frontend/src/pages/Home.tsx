import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { createContext, useState } from "react";
import useSocketSetup from "../components/useSocketSetup";

export interface IFriend {
  username: string;
  userId: string;
  connected: boolean;
}

// const TEMP_FRIENDS = [
//   { username: "John Doe", connected: false },
//   { username: "Steven", connected: true },
// ];

export const FriendContext = createContext({});
export const MessagesContext = createContext(null);

const Home = () => {
  const [friendList, setFriendList] = useState<IFriend[]>([]);
  const [messages, setMessages] = useState([]);
  const [friendIndex, setFriendIndex] = useState<number>(0);
  useSocketSetup(setFriendList, setMessages);
  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid
        templateColumns="repeat(10,1fr)"
        h="100vh"
        as={Tabs}
        onChange={(index) => setFriendIndex(index)}
      >
        <GridItem colSpan={3} borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan={7} maxH="100vh">
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <Chat userId={friendList[friendIndex]?.userId} />
          </MessagesContext.Provider>
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
