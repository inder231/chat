import { TabPanel, TabPanels, VStack, Heading } from "@chakra-ui/react";
import { useContext } from "react";
import { FriendContext } from "../pages/Home";

const Chat = () => {
  const { friendList } = useContext(FriendContext);
  return friendList.length > 0 ? (
    <VStack>
      <TabPanels>
        <TabPanel>Friend One</TabPanel>
        <TabPanel>Friend Two</TabPanel>
      </TabPanels>
    </VStack>
  ) : (
    <VStack justify="center" w="100%" h="100%">
      <Heading size="sm" fontStyle="italic">
        No friends available: Add new friends.
      </Heading>
    </VStack>
  );
};

export default Chat;
