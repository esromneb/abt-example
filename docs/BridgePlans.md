* Each new ABT will register AsyncBehaviorTreeBridgeClient.
* When they boot, they will write the data to it via a custom method.
* The server will capture and save this data.  Or potentially the server will fire up the WASM and grab the header
  * The issue here is that the wasm is not able to be spun up twice at the same time
  * I could test this and fix this
    * If fixed, the server will start a wasm instance per ABT
    * When Groot connects the server will route to the correct wasm instance and serve connections
