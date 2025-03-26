// jest.config.js
export default {
    testEnvironment: "jsdom",         // or "node" if no DOM needed
    transform: {},                    // disables Babel
    extensionsToTreatAsEsm: [".js"],  // treat .js files as ESM
  };
  