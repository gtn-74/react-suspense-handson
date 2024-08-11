# Suspenseを学ぶ  
 ## suspendとは...  
コンポーネントがレンダリングできない状態  

```   
function App() {
  return (
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
        <AlwaysSuspend />
    </div>
  );
}
```   
**suspendが発生したらその部分だけじゃなく周りも巻き込んで表示できなくな**  

**下の場合だと画面は復活する**  
```   
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      <Suspense fallback={<p>loading...</p>}>
        <AlwaysSuspend />
      </Suspense>
    </div>
```   

**この場合表示されない**  
```   
    <Suspense fallback={<p>loading...</p>}>
        <p>ここは表示される？</p>
        <AlwaysSuspend />
    </Suspense>
```   

throwされたpromiseは、サスペンドがいつ終了すると見込まれるかを示すもの  
通常コンポーネントは、無限にローディングは続かない  
Promiseが解決する　＝　ローディングの終了が表される  


ローディングが終了したら、それに合わせて画面を書き換える必要がある  
* fallbackの内容を片付ける  
* サスペエンドしたコンポーネントの内容を表示する作業が必要  

**上記をサスペンドしたコンポーネントの際レンダリング**と呼ぶ  

## サスペンドを終了させる  
```
<div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      <Suspense fallback={<p>loading...</p>}>
        {/* <p>ここは表示される？</p> */}
        {/* <AlwaysSuspend /> */}
        <SometimeSuspend />
        <button
          className="border p-1"
          onClick={() => setCount((c) => c + 1)}
        >
          {count}
        </button>
        {/* ボタンを押してStateを更新するたびSuspenseが走る */}
      </Suspense>
    </div>

// ランダムで出力される値が.5より小さかったら、throw
export const SometimeSuspend: React.FC = () => {
  if (Math.random() < 0.5) {
    throw sleep(1000);
  }
  return <p>Hello,world</p>
};
```

## サスペンド終了時はどこまで、再レンダリングされる？

>これはReactが提供する一貫性保証の一部であり、ある瞬間にレンダリングされたコンポーネントツリーが部分的に表示されてしまうようなことを防ぐためであると思われます。
>全部表示できるか、全部表示できないかのどちらかなのです。

> `Suspend`コンポーネントがサスペンドの境界を定義する役割を持っている
**レンダリングの一貫性を保つためサスペンド終了時にSuspenseの中身を全部レンダリングさせる必要がある**

```
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
```
```
interface Props {
  name: string;
}
export const RenderingNotifier: React.FC<Props> = ({ name }) => {
  console.log(`${name} is rendered`);
  return null;
};
```
innerRenderingは巻き込まれて再レンダリングするが
outRenderingは再レンダリングの対象にならない


```
// 非同期データ取得を実践してみよう
async function fetchData1(): Promise<string> {
  await sleep(1000);
  return `Hello, ${(Math.random() * 1000).toFixed(0)}`;
}

export const DataLoader: React.VFC = () => {
  const [data, setData] = React.useState<string | null>(null);
  // dataがなければloadingを開始する

  if (data === null) {
    throw fetchData1().then(setData);
  }
// dataがあればそれを表示
  return <div>Data is {data}</div>;
};
```

```
マウントされてないコンポーネントのState
Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.
    at DataLoader
```

Reactコンポーネントのレンダリング中に副作用を起こしてはいけない」と言われますが、その実際的な理由の一端がこれ

```
export const SuccessDataLoader: React.VFC = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<string | null>(null);
  if (loading && data === null) {
    throw fetchData1().then(setData);
  }
  return (
    <div>
      <div>Data is {data}</div>
      <button className="border p-1" onClick={() => setLoading(true)}>load</button>
    </div>
  );
};
```
**上記はあまりおすすめされない書き方**
本来、dataがあったら表示、なかったら非表示だけやればいいコンポーネントなのにコンポーネント自体が役割を持ち過ぎていることがよくない  



[続き](https://zenn.dev/uhyo/books/react-concurrent-handson/viewer/observe-suspense#%E3%82%B5%E3%82%B9%E3%83%9A%E3%83%B3%E3%83%89%E7%B5%82%E4%BA%86%E6%99%82%E3%81%AF%E3%81%A9%E3%81%93%E3%81%BE%E3%81%A7%E3%81%8C%E5%86%8D%E3%83%AC%E3%83%B3%E3%83%80%E3%83%AA%E3%83%B3%E3%82%B0%E3%81%95%E3%82%8C%E3%82%8B%E3%81%AE%E3%81%8B%EF%BC%9F)