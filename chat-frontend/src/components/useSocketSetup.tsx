/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect } from "react";
import socket from "../socket";
import { AccountContext } from "../context/AccountContext";
import { IFriend } from "../pages/Home";

const useSocketSetup = (setFriendList: any) => {
  //@ts-expect-error
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    console.log("Running useEffect");
    // Connect
    socket.connect();
    socket.on("connect_error", (error) => {
      // Handle the connection error on the client-side
      console.error(error.message);
      setUser({ loggedIn: false });
    });
    socket.on("friends", (friendList) => {
      setFriendList(friendList);
    });

    socket.on("connected", (status, username) => {
      setFriendList((prevFriends: IFriend[]) => {
        return [...prevFriends].map((friend) => {
          if (friend.username === username) {
            friend.connected = status;
          }
          return friend;
        });
      });
    });

    // General events
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    function onConnect() {
      console.log("Connected");
    }
    function onDisconnect() {
      console.log("Disconnected");
    }
    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error");
    };
  }, [setUser, setFriendList]);
};

export default useSocketSetup;
