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
  useDisclosure,
} from "@chakra-ui/react";
import { useContext } from "react";
import { FriendContext } from "../pages/Home";
import AddFriendModal from "./AddFriendModal";

const Sidebar = () => {
  const { friendList } = useContext(FriendContext);
  const {onOpen, isOpen,onClose} = useDisclosure();
  return (
    <>
      <VStack py="1rem">
        <HStack justify="space-evenly" w="100%">
          <Heading size="md">Add Friend</Heading>
          <Button onClick={onOpen} >
            <ChatIcon />
          </Button>
        </HStack>
        <Divider />
        <VStack as={TabList}>
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
      <AddFriendModal onClose={onClose} isOpen={isOpen} />
    </>
  );
};

export default Sidebar;
