import { Suspense, useState } from "react";
import { AlwaysSuspend, RenderingNotifier, SometimeSuspend } from "./alway-suspend";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      <RenderingNotifier name="outside-Suspense"/>
      <Suspense fallback={<p>loading...</p>}>
        {/* <p>ここは表示される？</p> */}
        {/* <AlwaysSuspend /> */}
        <SometimeSuspend />
        <RenderingNotifier name="innerside-Suspense"/>
        <button
          className="border p-1"
          onClick={() => setCount((c) => c + 1)}
        >
          {count}
        </button>
        {/* ボタンを押してStateを更新するたびSuspenseが走る */}
      </Suspense>
    </div>
  );
}

export default App;

// suspendが発生したらその部分だけじゃなく周りも巻き込んで表示できなくなる
