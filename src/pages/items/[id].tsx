import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Item } from 'types/item';
import { RentalHistory } from 'types/user';
import styles from 'styles/detail.module.css';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../api/getUser';
import Header from '../../components/Header';
import Head from 'next/head';
import Player from '../../components/Player';
import loadStyles from 'styles/loading.module.css';
import Review from '../../components/Review';
import ReviewBtn from 'components/ReviewBtn';
import prisma from '../../../lib/prisma';
import Countdown from '../../components/Countdown';
import { useAppSelector, useAppDispatch } from '../../app/hocks'
import { setPrice, setPeriod, setIsChoiced, setStart, setStartId, setRental, selectItems } from '../../features/itemsSlice'


const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Reduxのtype宣言
interface RootState {
  price: number,
  period: number,
  isChoiced: boolean,
  start: boolean,
  startId:number,
  rental: RentalHistory[]
}

export async function getStaticPaths() {
  const data = await prisma.item.findMany();
  const paths = data.map((item: { itemId: number }) => {
    return {
      params: {
        id: item.itemId.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);
  const item: Item | null = await prisma.item.findUnique({
    where: {
      itemId: id,
    },
  });
  if (!item) {
    return {
      redirect: {
        destination: '/error',
      },
    };
  }
  if (item?.releaseDate) {
    item.releaseDate = item?.releaseDate.toString();
  }
  return {
    props: {
      item,
    },
  };
}

export default function ItemDetail({ item }: { item: Item }) {
  const { price, period, isChoiced, start, startId, rental} = useAppSelector(selectItems);
  const dispatch = useAppDispatch();

  const startPlayer = (id: number) => {
    dispatch(setStart(!start));
    dispatch(setStartId(id));
  };

  const { data } = UseSWR<SessionUser>('/api/getUser', fetcher);

  const userId = data?.userId;
  useEffect(() => {
    fetch(`/api/selectRental/${userId}`)
      .then((res) => res.json())
      .then((result) => {
        dispatch(setRental(result.rental));
      });
  }, [userId]);

  const isLoggedIn = data?.isLoggedIn;

  if (!data)
    return (
      <div className={loadStyles.loadingArea}>
        <div className={loadStyles.bound}>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>g</span>
          <span>...</span>
        </div>
      </div>
    );

  let carts = data.userCarts;
  let cartflg = false;
  let rentalPeriod;
  let rentalCartId: number;
  let isRentaled = false;
  let rentalFlg;
  let rentalStart;
  let rentalEnd;
  let startFlg;
  let nowDate = new Date();
  let rentalHistory: RentalHistory[] = rental;

  let rentaledItems = rentalHistory?.filter((rentaledItem) => {
    return rentaledItem.itemId === item.itemId;
  });

  // 購入しているかしていないかのフラグ
  if (rentaledItems?.length) {
    isRentaled = true;
  }

  // 再生ボタンの出しわけ
  if (!rentaledItems?.length) {
    rentalFlg = false;
  } else if (rentaledItems.length) {
    // 同じ商品をレンタルした場合、最新のものを取得する
    let lastItem = rentaledItems.slice(-1)[0];
    if (!lastItem.rentalEnd) {
      rentalFlg = true;
      startFlg = false;
      rentalCartId = lastItem.rentalHistoryId;
      rentalPeriod = '未再生';
    } else if (lastItem.rentalStart && lastItem.rentalEnd) {
      startFlg = true;
      rentalStart = new Date(lastItem.rentalStart);
      rentalEnd = new Date(lastItem.rentalEnd);
      if (rentalEnd > nowDate) {
        rentalFlg = true;
      }
    }
  }

  // ログアウトした際に再生ボタンの非表示
  if (!isLoggedIn) {
    rentalFlg = false;
    mutate('api/getUser');
  }

  let cartId: number;
  if (carts) {
    // 商品が既に追加されている場合に同じitemIdがないか確かめる
    const check = carts.filter((cart) => {
      return cart.itemId === item.itemId;
    });
    if (check.length) {
      cartflg = true;
      cartId = check[0].cartId;
      mutate('/api/getUser');
    }
  }

  // レンタル中の作品情報を取得
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    chengeRentalPeriod(num);
  };

  // レンタル期間と価格の切り替え
  const chengeRentalPeriod = (num: number) => {
    if (num === 2) {
      dispatch(setPeriod(num));
      dispatch(setPrice(item.twoDaysPrice));
    } else {
      dispatch(setPeriod(num));
      dispatch(setPrice(item.sevenDaysPrice));
    }
  };


  // 選択した商品をカートに追加
  const handleAddItem = async (item: Item) => {
    // 　ラジオボタンの判定のチェック
    if (price === 0 || period === 0) {
      dispatch(setIsChoiced(true));
      return;
    }

    // ユーザーidの取得
    const id = data.userId;
    const itemId = item.itemId;

    // ログイン後
    if (id !== undefined) {
      await fetch(`/api/addCart/${id}/${itemId}/${period}`)
        .then((res) => res.json())
        .then((result) => {
          if (isChoiced === true) {
            dispatch(setIsChoiced(!isChoiced));
          }
          if (result.isAdd === true) {
            cartflg = true;
            mutate('/api/getUser');
          }
        })
        .catch((error) => {
          console.log('Error', error);
        });
    } else {
      // ログイン前

      let cartId: number;
      if (!data.userCarts) {
        cartId = 1;
      } else {
        cartId = data.userCarts.length + 1;
      }

      let userCarts = {
        cartId: cartId,
        rentalPeriod: period,
        itemImage: item.itemImage,
        itemId: item.itemId,
        items: item,
      };

      const body = { cart: userCarts };
      // cookieに保存するために/api/cartに飛ばす
      fetch(`/api/addCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((result) => {
          if (isChoiced === true) {
            dispatch(setIsChoiced(!isChoiced));
          }
          cartflg = true;
          mutate('/api/getUser');
        })
        .catch((error) => {
          console.log('Error', error);
        });
    }
  };

  // 選択した商品をカートから削除
  const handleDelte = async (item: Item) => {
    const id = data.userId;
    // ログイン後の場合
    if (id !== undefined) {
      await fetch(`/api/deleteCart/${cartId}`);
      mutate('/api/getUser');
    } else {
      // ログイン前の場合
      const body = { id: item.itemId, detail: true };

      await fetch(`/api/itemDelete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((result) => {
          cartflg = false;
          mutate('/api/getUser');
        })
        .catch((error) => {
          console.log('Error', error);
        });
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    item: Item
  ) => {
    e.preventDefault();
    cartflg ? handleDelte(item) : handleAddItem(item);
  };
  const closePlayer = () => {
    dispatch(setStart(!start));
    mutate('/api/getUser');
  };

  return (
    <>
      <Head>
        <title>{`${item.artist} ${item.fesName}`}</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getUser')}
      />
      <div className={styles.detailImgWrapper}>
        <Image
          className={styles.detailImg}
          src={item.itemImage}
          alt="画像"
          sizes="100vw"
          fill
          priority
        />
        <p className={styles.detailTitle}>{item.artist}</p>
      </div>
      <main className={styles.detail}>
        <form onSubmit={(e) => handleSubmit(e, item)}>
          <div>
            <div className={styles.detaiContainer}>
              <div className={styles.detailBodyWrapper}>
                <div className={styles.detailBody}>
                  <div className={styles.detailBodyInner}>
                    <p>{item.itemDetail}</p>
                    <p>{item.fesName}</p>
                    <p>{item.playTime}分</p>
                  </div>
                  {rentalFlg ? (
                    <div className={styles.btnWrapper}>
                      {startFlg ? (
                        rentalEnd &&
                        rentalStart && (
                          <Countdown
                            endTime={rentalEnd}
                            startTime={rentalStart}
                          />
                        )
                      ) : (
                        <p>視聴期間：{rentalPeriod}</p>
                      )}
                      <button
                        className={`${styles.btn} ${styles.pushdown}`}
                        onClick={() => startPlayer(rentalCartId)}
                      >
                        再生
                      </button>
                    </div>
                  ) : (
                    <>
                      {cartflg ? (
                        <div className={styles.detailRadioWrapper}>
                          <div className={styles.detailBtnWrapper}>
                            <button
                              type="submit"
                              className={`${styles.detailBtn} ${styles.bgleft}`}
                            >
                              <span>カートから削除</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.detailRadioWrapper}>
                          <p className={styles.detailLerge}>
                            【レンタル期間】
                          </p>
                          <label
                            htmlFor="palyTime"
                            className={styles.middleOnlyMr50}
                          >
                            <input
                              type="radio"
                              name="palyTime"
                              value={2}
                              onChange={(e) => handleChange(e)}
                            />
                            48時間&nbsp;{item.twoDaysPrice}円
                          </label>
                          <br className={styles.middleOnly} />
                          <label htmlFor="palyTime">
                            <input
                              type="radio"
                              name="palyTime"
                              value={7}
                              onChange={(e) => handleChange(e)}
                            />
                            7泊&nbsp;{item.sevenDaysPrice}円
                          </label>
                          <br />
                          <p className={styles.cartAlert}>
                            {isChoiced
                              ? 'レンタル期間を選択してください'
                              : ''}
                          </p>
                          <div className={styles.detailBtnWrapper}>
                            <button
                              type="submit"
                              className={`${styles.detailBtn} ${styles.bgleft}`}
                            >
                              <span>カートに追加</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <style jsx>{`
              p {
                margin-block-start: 0;
                margin-block-end: 0;
              }
            `}</style>
          </div>
        </form>
        {start && (
          <Player
            closePlayer={() => closePlayer()}
            startPlayer={() => mutate('/api/getUser')}
          />
        )}
        <section className={styles.review}>
          <div className={styles.listWrpper}>
            <div className={styles.listInner}>
              <Review itemId={item.itemId} />
            </div>
            <div className={styles.tac}>
              <ReviewBtn
                userId={userId}
                id={item.itemId}
                isRentaled={isRentaled}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
