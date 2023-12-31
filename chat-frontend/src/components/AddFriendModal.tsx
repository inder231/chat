import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import * as Yup from "yup";
import TextField from "./TextField";
import { Form, Formik } from "formik";
import socket from "../socket";
import { useCallback, useContext, useState } from "react";
import { FriendContext, IFriend } from "../pages/Home";

const friendSchema = Yup.object({
  friendName: Yup.string()
    .required("Username required")
    .min(6, "Invalid username")
    .max(28, "Invalid username"),
});

const AddFriendModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState<string>("");
  const closeModal = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);
  const { setFriendList } = useContext(FriendContext);
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Friend</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ friendName: "" }}
          onSubmit={(values) => {
            socket.emit(
              "add_friend",
              values.friendName,
              ({
                errorMsg,
                done,
                newFriend,
              }: {
                errorMsg: string;
                done: boolean;
                newFriend: IFriend;
              }) => {
                // this callback will be called by server, but executed here
                if (done) {
                  setFriendList((prev: IFriend[]) => [newFriend, ...prev]);
                  closeModal();
                  return;
                }
                setError(errorMsg);
              }
            );
          }}
          validationSchema={friendSchema}
        >
          <Form>
            <ModalBody>
              <Heading as="p" size="sm" color="red.500" textAlign="center">
                {error}
              </Heading>
              <TextField
                name="friendName"
                placeholder="Enter username..."
                autoComplete="off"
                label="Friend's username"
              />
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue">
                Send Request
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddFriendModal;
