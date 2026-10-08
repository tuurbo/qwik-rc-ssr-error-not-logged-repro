import { component$ } from "@qwik.dev/core";

const Broken = component$(() => {
  throw new Error("render failed");
});

export default component$(() => {
  return (
    <>
      <p>Before the broken component</p>
      <Broken />
    </>
  );
});
