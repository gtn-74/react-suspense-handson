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
  return <p>Hello,world</p>
};


