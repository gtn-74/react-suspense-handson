import React from "react";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const AlwaysSuspend: React.FC = () => {
  console.log("alwaysSuspend is rendered");
  throw sleep(1000); // 再レンダリングが1秒ごとに実行される
};
/*
throwされたpromiseは、サスペンドがいつ終了すると見込まれるかを示すもの
通常コンポーネントは、無限にローディングは続かない
Promiseが解決する　＝　ローディングの終了が表される
*/

// ランダムで出力される値が.5より小さかったら、throw
export const SometimeSuspend: React.FC = () => {
  if (Math.random() < 0.5) {
    throw sleep(1000);
  }
  return <p>Hello,world</p>;
};

interface Props {
  name: string;
}
export const RenderingNotifier: React.FC<Props> = ({ name }) => {
  console.log(`${name} is rendered`);
  return null;
};

// 非同期データ取得を実践してみよう
async function fetchData1(): Promise<string> {
  await sleep(1000);
  return `Hello, ${(Math.random() * 1000).toFixed(0)}`;
}
//  失敗
/*
export const DataLoader: React.VFC = () => {
  const [data, setData] = React.useState<string | null>(null);
  dataがなければloadingを開始する

  if (data === null) {
    throw fetchData1().then(setData);
  }
dataがあればそれを表示
  return <div>Data is {data}</div>;
};
*/

// 非推奨のsuspend
export const SuccessDataLoader: React.VFC = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<string | null>(null);
  if (loading && data === null) {
    sleep(500).then(() => setData("boom!"));
    throw fetchData1().then(setData);
  }
  return (
    <div>
      <div>Data is {data}</div>
      <button className="border p-1" onClick={() => setLoading(true)}>
        load
      </button>
    </div>
  );
};

// 再レンダリングでサスペンドしても歴史は消される
export const RefreshHistoryDataLoader: React.VFC = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<string | null>(null);
  const _ = React.useMemo(() => {
    if (loading) {
      console.log("loading is true");
    }
    return 1;
  }, [loading]);
  if (loading && data === null) {
    throw fetchData1().then(setData);
  }
  return (
    <div>
      <div>Data is {data}</div>
      <button className="border p-1" onClick={() => setLoading(true)}>
        load
      </button>
    </div>
  );
};

// TODO: 最後にやろう
// export const SwitchButton: React.FC = () => {
//   return <button>ボタンA</button>
// };

// <button>ボタンB</button>
