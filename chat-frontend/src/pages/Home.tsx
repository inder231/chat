import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { createContext, useState } from "react";

export interface IFriend {
  username: string;
  connected: boolean;
}

const TEMP_FRIENDS = [
  { username: "John Doe", connected: false },
  { username: "Steven", connected: true },
];

export const FriendContext = createContext({});

const Home = () => {
  const [friendList, setFriendList] = useState<IFriend[]>(TEMP_FRIENDS || []);
  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid templateColumns="repeat(10,1fr)" h="100vh" as={Tabs}>
        <GridItem colSpan={3} borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan={7}>
          <Chat />
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
