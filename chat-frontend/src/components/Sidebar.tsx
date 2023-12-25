import { ChatIcon } from "@chakra-ui/icons";
import {
  Button,
  Circle,
  Divider,
  HStack,
  Heading,
  Tab,
  TabList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { FriendContext } from "../pages/Home";

const Sidebar = () => {
  const { friendList } = useContext(FriendContext);
  return (
    <VStack py="1rem">
      <HStack justify="space-evenly" w="100%">
        <Heading size="md">Add Friend</Heading>
        <Button>
          <ChatIcon />
        </Button>
      </HStack>
      <Divider />
      <VStack as={TabList}>
        {/* <HStack as={Tab} justify="space-between" w="100%">
          <Circle bg="red.500" color="white" size="15px" />
          <Text>John Smith</Text>
          </HStack>
          <HStack as={Tab} justify="space-between" w="100%">
          <Circle bg="green.500" color="white" size="15px" />
          <Text>John Doe</Text>
        </HStack> */}
        {friendList?.map(
          (
            { username, connected }: { username: string; connected: boolean },
            i: number
          ) => (
            <HStack key={i} as={Tab} justify="space-between" w="100%">
              <Circle
                bg={connected ? "green.500" : "red.500"}
                color="white"
                size="15px"
              />
              <Text>{username}</Text>
            </HStack>
          )
        )}
      </VStack>
    </VStack>
  );
};

export default Sidebar;
