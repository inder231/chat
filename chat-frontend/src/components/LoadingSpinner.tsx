import { Spinner } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <Spinner
      pos="relative"
      left="50%"
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  );
};

export default LoadingSpinner;
