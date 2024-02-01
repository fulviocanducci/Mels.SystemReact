export const selectStyles = {
  menu: (base: any) => ({
    ...base,
    zIndex: 100,
  }),
  control: (provided: any, state: any) =>
    state.selectProps.value.length === 0
      ? {
          ...provided,
          boxShadow: "0 0 0 .1px red !important",
          borderColor: "red !important",
        }
      : provided,
};
