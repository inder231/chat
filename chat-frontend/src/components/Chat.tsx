import { TabPanel, TabPanels, VStack, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import { FriendContext, IFriend, MessagesContext } from "../pages/Home";
import Chatbox from "./Chatbox";

const Chat = ({ userId }) => {
  const { friendList } = useContext(FriendContext);
  const { messages } = useContext(MessagesContext);
  // console.log(messages);
  const bottomDiv = useRef(null);
  useEffect(()=>{
    bottomDiv.current?.scrollIntoView()
  },[])
  return friendList.length > 0 ? (
    <VStack h="100%" justify="end">
      <TabPanels overflowY="scroll">
        {/* { show tab panel in accordance with tabs(friends) } */}
        {friendList?.map((friend: IFriend) => (
          <VStack
            key={`chat:${friend.username}`}
            as={TabPanel}
            flexDir="column-reverse"
          >
            <div ref={bottomDiv}>
              {messages
                .filter(
                  (msg) =>
                    msg.to === friend.userId || msg.from === friend.userId
                )
                .map((message) => (
                  <Text
                    m={
                      message.to === friend.userId
                        ? "1rem 0 0 auto !important"
                        : "1rem auto 0 0 !important"
                    }
                    maxW="50%"
                    key={`msg:${friend.userId}`}
                    fontSize="lg"
                    bg={message.to === friend?.userId ? "blue.100" : "gray.100"}
                    color="gray.800"
                    borderRadius="10px"
                    p="0.5rem 1rem"
                  >
                    {message.content}
                  </Text>
                ))}
            </div>
          </VStack>
        ))}
      </TabPanels>
      <Chatbox userId={userId} />
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
