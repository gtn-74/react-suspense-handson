import { Suspense, useState } from "react";
import {
  AlwaysSuspend,
  RefreshHistoryDataLoader,
  RenderingNotifier,
  SometimeSuspend,
  SuccessDataLoader,
} from "./alway-suspend";
// import { AlwaysSuspend, DataLoader, RenderingNotifier, SometimeSuspend, SuccessDataLoader } from "./alway-suspend";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      
      <h1 className="text-2xl">React App!</h1>
      {/* <RenderingNotifier name="outside-Suspense"/> */}
      {/* <Suspense fallback={<p>loading...</p>}> */}
      {/* <p>ここは表示される？</p> */}
      {/* <AlwaysSuspend /> */}
      {/* <SometimeSuspend /> */}
      {/* <RenderingNotifier name="innerside-Suspense"/>
        <button
          className="border p-1"
          onClick={() => setCount((c) => c + 1)}
        >
          {count}
        </button> */}
      {/* ボタンを押してStateを更新するたびSuspenseが走る */}
      {/* </Suspense> */}
      {/* useStateの失敗例 */}
      <Suspense fallback={<p>loadong...</p>}>
        {/* <DataLoader/> suspendしたままという意味 */}
        <SuccessDataLoader /> {/* suspendしたままという意味 */}
      </Suspense>
      <Suspense fallback={<p>loadong...</p>}>
        <RefreshHistoryDataLoader />
      </Suspense>
    </div>
  );
}

export default App;

// suspendが発生したらその部分だけじゃなく周りも巻き込んで表示できなくなる
