import { render } from "@testing-library/react";
import { RootStoreProvider, initRootStoreAndSocket } from "Store/RootStore";

export const createFreshRootStore = () => {
  return initRootStoreAndSocket();
};

export const renderComponentWithRootStore = (component, RootStore = null) => {
  if (RootStore === null) {
    RootStore = createFreshRootStore();
  }

  const { asFragment } = render(
    <RootStoreProvider store={RootStore}>{component}</RootStoreProvider>,
  );

  return asFragment();
};
