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
  // console.log(`${name} is rendered`);
  return null;
};

// 非同期データ取得を実践してみよう
async function fetchData1(): Promise<string> {
  await sleep(1000);
  return `Hello, ${(Math.random() * 1000).toFixed(0)}`;
}
//  失敗

export const DataLoader: React.VFC = () => {
  const [data, setData] = React.useState<string | null>(null);
  // dataがなければloadingを開始する

  if (data === null) {
    throw fetchData1().then(setData);
  }
  // dataがあればそれを表示
  return <div>Data is {data}</div>;
};

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

// コンポーネントの外側にuseStateの状態を持たせる //

// グローバル変数
let data: string | undefined;
export const PrimitiveDataLoader: React.VFC = () => {
  if (data === undefined) {
    throw fetchData1().then((d) => (data = d));
  }

  return <div>Data is {data}</div>;
};

// data取得フックを作る
// let data: string | undefined;　上記で書いてるからコメントアウトしてる
function useData1(): string {
  if (data === undefined) {
    throw fetchData1().then((d) => (data = d));
  }
  return data;
}

export const HookDataLoader: React.VFC = () => {
  // const data = useData1();
  return <div>Data is {data}</div>;
};

/*
上記は、全コンポーネント共通でグローバル変数（data）に仮保存するため、
dataを共有で使ってしまう。
フックにしてるからいいんだが、useData1を他のモジュールで使ってしまうと、過去のdata情報が上書きされちゃうので、あんまりよろしくない
*/

// 複数のデータを持つ cacheKey
const dataMap: Map<string, string> = new Map(); // Mapというデータ構造でkey:valueで管理
function useData2(cacheKey: string): string {
  const cachedData = dataMap.get(cacheKey);
  if (cachedData === undefined) {
    throw fetchData1().then((d) => dataMap.set(cacheKey, d));
  }
  return cachedData;
}

export const DataLoaderA: React.VFC = () => {
  const data = useData2("DataLoader1");
  return <div>Data is {data}</div>;
};
export const DataLoaderB: React.VFC = () => {
  const data = useData2("DataLoader2");
  return <div>Data is {data}</div>;
};

// フックを汎用化する
const dataMap_C: Map<string, unknown> = new Map();
export function useData<T>(cacheKey: string, fetch: () => Promise<T>): T {
  const cachedData = dataMap_C.get(cacheKey) as T | undefined;
  if (cachedData === undefined) {
    throw fetch().then((d) => dataMap_C.set(cacheKey, d));
  }
  return cachedData;
}

export const DataLoaderC: React.VFC = () => {
  const data = useData("DataLoader1", fetchData1);
  return <div>{data}</div>;
};
export const DataLoaderD: React.VFC = () => {
  const data = useData("DataLoader2", fetchData1);
  return <div>{data}</div>;
};

// TODO: 最後にやろう
// export const SwitchButton: React.FC = () => {
//   return <button>ボタンA</button>
// };

// <button>ボタンB</button>
