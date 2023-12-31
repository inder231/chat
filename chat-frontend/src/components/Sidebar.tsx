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
import { FriendContext, IFriend } from "../pages/Home";
import AddFriendModal from "./AddFriendModal";

const Sidebar = () => {
  const { friendList } = useContext(FriendContext);
  const { onOpen, isOpen, onClose } = useDisclosure();
  console.log(friendList);
  return (
    <>
      <VStack py="1rem">
        <HStack justify="space-evenly" w="100%">
          <Heading size="md">Add Friend</Heading>
          <Button onClick={onOpen}>
            <ChatIcon />
          </Button>
        </HStack>
        <Divider />
        <VStack as={TabList}>
          {friendList?.map((friend: IFriend, i: number) => (
            <HStack key={i} as={Tab} justify="space-between" w="100%">
              <Circle
                bg={friend?.connected === "1" ? "green.500" : "red.500"}
                color="white"
                size="15px"
              />
              <Text>{friend?.username}</Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
      <AddFriendModal onClose={onClose} isOpen={isOpen} />
    </>
  );
};

export default Sidebar;
